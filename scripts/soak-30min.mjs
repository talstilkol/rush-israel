#!/usr/bin/env node
/** Wall-clock driving soak. Not advanceTime. Short diagnostic runs never count as 30-minute acceptance. */
import { chromium } from "playwright";
import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { fromRoot } from "./project-root.mjs";
import { captureWithVerdict } from "./capture-verdict.mjs";

const MS = Number(process.env.SOAK_MS || 30 * 60 * 1000);
const smokeOnly = process.env.SOAK_SMOKE === "1";
if (!Number.isFinite(MS) || MS <= 0 || (!smokeOnly && MS < 1800000)) {
  throw new Error("30-minute acceptance requires SOAK_MS >= 1800000; short diagnostics require SOAK_SMOKE=1");
}
const url = process.env.SOAK_URL || "http://127.0.0.1:8080/";
const logDir = process.env.SOAK_ARTIFACT_DIR || fromRoot("artifacts", "driving-soak");
await mkdir(logDir, { recursive: true });
const logFile = `${logDir}/drive-30min.log`;
const line = async (s) => {
  const row = `${new Date().toISOString()} ${s}\n`;
  process.stdout.write(row);
  await appendFile(logFile, row);
};

let summary = { kind: smokeOnly ? "diagnostic-smoke" : "30-minute-driving", passed: false, completedRaces: 0, deviceAcceptance: false };
const persistSummary = value => writeFile(`${logDir}/summary.json`, `${JSON.stringify(value, null, 2)}\n`);
await persistSummary(summary);
await writeFile(logFile, "");
const browser = await chromium.launch({ headless: process.env.SOAK_NATIVE !== "1" });
let page;
try {
  page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  page.on("crash", () => errs.push("page crash"));
  page.on("console", (message) => { if (message.type() === "error") errs.push(message.text()); });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 40000 });
  await page.locator('[data-game-ready="true"]').waitFor();
  await page.getByRole("button", { name: /בחר מסלול/ }).click();
  await page.locator("button").filter({ hasText: /^הכל$/ }).click();
  await page.locator("button").filter({ hasText: /נתיבי איילון/ }).click();
  await page.waitForFunction(() => !!window.__controlsTest?.followRoad, { timeout: 40000 });
  await page.evaluate(() => {
    const t = window.__controlsTest;
    t.resetStart();
    t.skipCountdown();
    t.followRoad();
  });

  const t0 = Date.now();
  await line(`start ms=${MS} backend-drive kind=${summary.kind} steering=real-input-ai`);
  let ticks = 0;
  let off = 0;
  let maxSpeed = 0;
  let completedRaces = 0;
  let maxProgress = 0;
  let lastLog = 0;
  let lastAdvance = t0;
  let lastProgress = 0;
  let p95Worst = 0;
  let memoryHigh = { textures: 0, geometries: 0 };
  while (Date.now() - t0 < MS) {
    await page.waitForTimeout(100);
    if (errs.length) throw new Error(errs.join("\n"));
    const snap = await page.evaluate(() => {
      const t = window.__controlsTest;
      const state = JSON.parse(window.render_game_to_text());
      const finished = t.isFinished();
      if (finished) {
        t.resetStart();
        t.skipCountdown();
      }
      t.followRoad();
      return { ...state, finished, gl: t.isGlLost(), memory: t.getMemory() };
    });
    ticks++;
    if (!snap.onTrack) off++;
    if (snap.gl) throw new Error("webgl lost");
    for (const key of ["speed", "progress", "totalTime"]) {
      if (!Number.isFinite(snap[key])) throw new Error(`non-finite ${key}`);
    }
    if (snap.finished) { completedRaces++; lastProgress = 0; lastAdvance = Date.now(); }
    else if (snap.progress > lastProgress + 0.001) { lastProgress = snap.progress; lastAdvance = Date.now(); }
    if (Date.now() - lastAdvance > 60000) throw new Error(`no forward progress for 60s at p=${snap.progress}`);
    maxSpeed = Math.max(maxSpeed, snap.speed);
    maxProgress = Math.max(maxProgress, snap.progress);
    p95Worst = Math.max(p95Worst, snap.telem.p95);
    memoryHigh = {
      textures: Math.max(memoryHigh.textures, snap.memory.textures),
      geometries: Math.max(memoryHigh.geometries, snap.memory.geometries),
    };
    const elapsed = Date.now() - t0;
    if (elapsed - lastLog >= 15000) {
      lastLog = elapsed;
      await line(`t=${Math.round(elapsed / 1000)}s spd=${snap.speed.toFixed(1)} on=${snap.onTrack} p=${snap.progress.toFixed(3)} finished=${completedRaces} offTicks=${off} p95=${snap.telem.p95}`);
    }
  }
  const elapsedMs = Date.now() - t0;
  if (maxSpeed < 12 || maxProgress < 0.04) throw new Error("did not demonstrate forward driving");
  if (off / Math.max(1, ticks) > 0.05) throw new Error(`off-road ratio ${off}/${ticks} exceeds 5%`);
  if (!smokeOnly && completedRaces < 1) throw new Error("no complete race in 30 minutes");
  if (!smokeOnly && elapsedMs < 1800000) throw new Error("wall-clock duration too short");
  summary = { ...summary, passed: true, completedRaces, elapsedMs, ticks, maxSpeed, maxProgress, offRoadRatio: off / ticks, p95Worst, memoryHigh, deviceAcceptance: false };
  await captureWithVerdict(summary, {
    persist: persistSummary,
    capture: async () => {
      await page.screenshot({ path: `${logDir}/drive-30min-end.png`, timeout: 30000 });
      await line(`ok ticks=${ticks} completed=${completedRaces} elapsed=${Math.round(elapsedMs / 1000)}s kind=${summary.kind}`);
    },
    cleanup: () => browser.close(),
  });
} catch (error) {
  summary = { ...summary, passed: false, error: String(error) };
  await page?.screenshot({ path: `${logDir}/failure.png` }).catch(() => {});
  if (page) await writeFile(`${logDir}/failure-dom.txt`, await page.locator("body").innerText().catch(() => "unavailable"));
  await line(`FAIL ${error}`);
  throw error;
} finally {
  try { if (browser.isConnected()) await browser.close(); }
  finally { await persistSummary(summary); }
}
