#!/usr/bin/env node
/** Phase A gate: Ayalon g01/g05/g07/g08 + JSON. Not an art pass. */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const out = process.env.GOLDEN_DIR || "/workspace/golden-baseline";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await page.goto("http://127.0.0.1:8080/?qa=1", { waitUntil: "domcontentloaded", timeout: 40000 });
await page.waitForTimeout(1200);
if (errs.length) throw new Error(errs.join("\n"));
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
if (!ok) throw new Error("ayalon");
await page.waitForFunction(() => !!window.__controlsTest, { timeout: 28000 });
await page.evaluate(() => window.__controlsTest.skipCountdown());

for (const id of ["g01", "g05", "g07"]) {
  await page.evaluate((gid) => window.__controlsTest.gotoGolden(gid), id);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/ayalon-day-${id}.png` });
}
await page.evaluate(() => window.__controlsTest.setNight(true));
await page.waitForTimeout(400);
await page.evaluate(() => window.__controlsTest.gotoGolden("g08"));
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/ayalon-night-g08.png` });
const txt = await page.evaluate(() => window.render_game_to_text());
const dump = JSON.parse(txt);
if (dump.track !== "ayalon") throw new Error("track " + dump.track);
if (dump.telem?.backend && dump.telem.backend !== "webgl2" && dump.telem.backend !== "webgl1") {
  throw new Error("backend " + dump.telem.backend);
}
await writeFile(`${out}/ayalon-dump.json`, JSON.stringify(dump, null, 2));
await page.evaluate(() => {
  const t = window.__controlsTest;
  t.resetStart();
  t.setNight(false);
  t.setThrottle(1);
  t.setSteer(0);
  t.setKeys(["KeyW"]);
});
await page.waitForFunction(() => (window.__controlsTest.getSpeed() ?? 0) > 6, { timeout: 16000 });
const y0 = await page.evaluate(() => window.__controlsTest.getYaw());
await page.evaluate(() => window.__controlsTest.setSteer(1));
await page.waitForTimeout(400);
const yA = await page.evaluate(() => window.__controlsTest.getYaw());
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
if (wrap(yA - y0) <= 0.03) throw new Error("steer");
await browser.close();
console.log("golden-ok", dump.track, dump.telem?.backend, "steer", +wrap(yA - y0).toFixed(3));
