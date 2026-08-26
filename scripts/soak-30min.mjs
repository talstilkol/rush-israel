#!/usr/bin/env node
/**
 * Wall-clock 30-minute drive soak. Not advanceTime. Not 90 seconds.
 * SOAK_MS overrides duration (ms).
 */
import { chromium } from "playwright";
import { appendFile, mkdir } from "node:fs/promises";

const MS = Number(process.env.SOAK_MS || 30 * 60 * 1000);
const url = process.env.SOAK_URL || "http://127.0.0.1:8080/";
const logDir = "/workspace/soak-logs";
await mkdir(logDir, { recursive: true });
const logFile = `${logDir}/drive-30min.log`;

const line = async (s) => {
  const row = `${new Date().toISOString()} ${s}\n`;
  process.stdout.write(row);
  await appendFile(logFile, row);
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.setDefaultTimeout(120000);
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
page.on("crash", () => errs.push("page crash"));

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 40000 });
await page.waitForTimeout(1200);
await page.evaluate(() =>
  [...document.querySelectorAll("button")].find((n) => /בחר מסלול/.test(n.textContent || ""))?.click(),
);
await page.waitForTimeout(400);
await page.evaluate(() =>
  [...document.querySelectorAll("button")].find((n) => /^הכל$/.test((n.textContent || "").trim()))?.click(),
);
await page.waitForTimeout(300);
const ok = await page.evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((n) => /נתיבי איילון/.test(n.textContent || ""));
  if (!el) return false;
  el.click();
  return true;
});
if (!ok) throw new Error("no ayalon");
await page.waitForFunction(() => !!window.__controlsTest, { timeout: 40000 });
await page.evaluate(() => {
  const t = window.__controlsTest;
  t.skipCountdown();
  t.resetStart();
  t.setThrottle(1);
  t.setSteer(0);
  t.setKeys(["KeyW"]);
});

const t0 = Date.now();
await line(`start ms=${MS} backend-drive`);
let ticks = 0;
let maxSpeed = 0;
let off = 0;

while (Date.now() - t0 < MS) {
  await page.waitForTimeout(15000);
  ticks++;
  if (errs.length) {
    await line(`FAIL ${errs.join(" | ")}`);
    throw new Error(errs.join("\n"));
  }
  const snap = await page.evaluate(() => {
    const t = window.__controlsTest;
    const txt = window.render_game_to_text?.();
    return {
      speed: t.getSpeed(),
      on: t.getOnTrack(),
      p: t.getProgress(),
      gl: t.isGlLost?.(),
      txt,
    };
  });
  maxSpeed = Math.max(maxSpeed, snap.speed);
  if (!snap.on) off++;
  if (snap.gl) throw new Error("webgl lost");
  if (snap.speed < 2) {
    await page.evaluate(() => {
      const t = window.__controlsTest;
      t.setThrottle(1);
      t.setKeys(["KeyW"]);
    });
  }
  const elapsed = Math.round((Date.now() - t0) / 1000);
  await line(`t=${elapsed}s spd=${snap.speed.toFixed(1)} on=${snap.on} p=${snap.p.toFixed(3)} offTicks=${off}`);
}

await page.screenshot({ path: `${logDir}/drive-30min-end.png` });
await browser.close();
await line(`ok ticks=${ticks} maxSpeed=${maxSpeed.toFixed(1)} offTicks=${off} elapsed=${Math.round((Date.now() - t0) / 1000)}s`);
