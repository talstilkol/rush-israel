#!/usr/bin/env node
/** 21.16: capture g01/g05/g07/g08 and pixelmatch vs golden-baseline (threshold 0.12, fail >8%). */
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { openAyalonRace, goldenState, validateGoldenSnapshot } from "./golden-capture.mjs";
import { prepareGoldenOutput } from "./golden-output.mjs";
import { createHash } from "node:crypto";
import { fromRoot } from "./project-root.mjs";

const baseline = process.env.GOLDEN_DIR || fromRoot("golden-baseline");
const tmp = process.env.GOLDEN_TMP || fromRoot("artifacts", "golden-tmp");
if (process.env.UPDATE_GOLDEN === "1") throw new Error("Automatic golden baseline updates are forbidden; preserve the reviewed image authority");
const files = ["ayalon-day-g01.png", "ayalon-day-g05.png", "ayalon-day-g07.png", "ayalon-night-g08.png"];
const ids = ["g01", "g05", "g07"];

const output = prepareGoldenOutput({ baseline, output: tmp,
  names: ["report.json", "capture.json", "capture-failure.png", ...files, ...files.map(f => `diff-${f}`)] });
const baselineHashes = Object.fromEntries(await Promise.all(files.map(async name =>
  [name, createHash("sha256").update(await readFile(`${baseline}/${name}`)).digest("hex")])));
const capture = { status: "pending", frames: [], errors: [], failedRequests: [], baselineHashes,
  pixelThreshold: 0.12, failureLimit: 0.08, baselineUpdates: 0 };
let browser, page;
try {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  page.on("pageerror", error => capture.errors.push(String(error)));
  page.on("requestfailed", request => capture.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  await page.goto("http://127.0.0.1:8080/?qa=1", { waitUntil: "domcontentloaded", timeout: 40000 });
  capture.initial = await openAyalonRace(page);
  if (capture.errors.length) throw new Error(capture.errors.join("\n"));
  await page.evaluate(() => window.__controlsTest.skipCountdown());
  // Original pose order and post-pose waits remain unchanged. They are not a
  // claim of deterministic pixel content: the running simulation is recorded.
  for (const id of ids) {
    const moved = await page.evaluate(gid => window.__controlsTest.gotoGolden(gid), id);
    if (moved !== true) throw new Error(`unknown golden camera ${id}`);
    await page.waitForTimeout(450);
    const state = await goldenState(page);
    validateGoldenSnapshot(state.engine);
    if (capture.errors.length) throw new Error(capture.errors.join("\n"));
    output.write(`ayalon-day-${id}.png`, await page.screenshot());
    capture.frames.push({ file: `ayalon-day-${id}.png`, ...state });
  }
  await page.evaluate(() => window.__controlsTest.setNight(true));
  await page.waitForTimeout(400);
  const moved = await page.evaluate(() => window.__controlsTest.gotoGolden("g08"));
  if (moved !== true) throw new Error("unknown golden camera g08");
  await page.waitForTimeout(500);
  const state = await goldenState(page);
  validateGoldenSnapshot(state.engine);
  if (state.engine.night !== true) throw new Error("night golden frame remained in daytime");
  if (capture.errors.length) throw new Error(capture.errors.join("\n"));
  output.write("ayalon-night-g08.png", await page.screenshot());
  capture.frames.push({ file: "ayalon-night-g08.png", ...state });
  if (capture.errors.length) throw new Error(capture.errors.join("\n"));
  capture.status = "captured_not_compared";
} catch (error) {
  capture.status = "capture_failed";
  capture.error = String(error);
  if (page && !page.isClosed()) await page.screenshot().then(bytes => output.write("capture-failure.png", bytes)).catch(() => {});
  throw error;
} finally {
  try { output.write("capture.json", JSON.stringify(capture, null, 2) + "\n"); }
  finally { await browser?.close(); }
}

function readPng(buf) {
  return PNG.sync.read(buf);
}

const report = [];
let failed = 0;
for (const f of files) {
  const aBuf = await readFile(`${output.directory}/${f}`);
  const a = readPng(aBuf);
  let b;
  try {
    b = readPng(await readFile(`${baseline}/${f}`));
  } catch {
    throw new Error("missing baseline " + f);
  }
  if (a.width !== b.width || a.height !== b.height) {
    failed++;
    report.push({ f, pct: 1, note: `size ${a.width}x${a.height} vs ${b.width}x${b.height}` });
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.12 });
  const pct = n / (a.width * a.height);
  report.push({ f, pct: +pct.toFixed(4), mismatched: n });
  if (pct > 0.08) {
    failed++;
    output.write(`diff-${f}`, PNG.sync.write(diff));
  }
}

output.write("report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

if (failed) {
  console.error("pixel-golden fail", failed);
  process.exit(1);
}
console.log("pixel-golden ok");
