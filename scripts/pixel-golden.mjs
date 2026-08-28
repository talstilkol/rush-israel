#!/usr/bin/env node
/** 21.16: capture g01/g05/g07/g08 and pixelmatch vs golden-baseline (threshold 0.12, fail >8%). */
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { fromRoot } from "./project-root.mjs";

const baseline = process.env.GOLDEN_DIR || fromRoot("golden-baseline");
const tmp = process.env.GOLDEN_TMP || fromRoot("artifacts", "golden-tmp");
const UPDATE = process.env.UPDATE_GOLDEN === "1";
const files = ["ayalon-day-g01.png", "ayalon-day-g05.png", "ayalon-day-g07.png", "ayalon-night-g08.png"];
const ids = ["g01", "g05", "g07"];

await mkdir(tmp, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await page.goto("http://127.0.0.1:8080/?qa=1", { waitUntil: "domcontentloaded", timeout: 40000 });
await page.waitForTimeout(900);
await page.evaluate(() =>
  [...document.querySelectorAll("button")].find((n) => /בחר מסלול/.test(n.textContent || ""))?.click(),
);
await page.waitForTimeout(350);
await page.evaluate(() =>
  [...document.querySelectorAll("button")].find((n) => /^הכל$/.test((n.textContent || "").trim()))?.click(),
);
await page.waitForTimeout(250);
const ok = await page.evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((n) => /נתיבי איילון/.test(n.textContent || ""));
  el?.click();
  return !!el;
});
if (!ok) throw new Error("ayalon");
await page.waitForFunction(() => !!window.__controlsTest, { timeout: 35000 });
if (errs.length) throw new Error(errs.join("\n"));
await page.evaluate(() => window.__controlsTest.skipCountdown());

for (const id of ids) {
  await page.evaluate((gid) => window.__controlsTest.gotoGolden(gid), id);
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${tmp}/ayalon-day-${id}.png` });
}
await page.evaluate(() => window.__controlsTest.setNight(true));
await page.waitForTimeout(400);
await page.evaluate(() => window.__controlsTest.gotoGolden("g08"));
await page.waitForTimeout(500);
await page.screenshot({ path: `${tmp}/ayalon-night-g08.png` });
await browser.close();

function readPng(buf) {
  return PNG.sync.read(buf);
}

const report = [];
let failed = 0;
for (const f of files) {
  const aBuf = await readFile(`${tmp}/${f}`);
  const a = readPng(aBuf);
  let b;
  try {
    b = readPng(await readFile(`${baseline}/${f}`));
  } catch {
    if (UPDATE) {
      await copyFile(`${tmp}/${f}`, `${baseline}/${f}`);
      report.push({ f, pct: 1, note: "created" });
      continue;
    }
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
    await writeFile(`${tmp}/diff-${f}`, PNG.sync.write(diff));
  }
}

await writeFile(`${tmp}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

if (failed && UPDATE) {
  for (const f of files) await copyFile(`${tmp}/${f}`, `${baseline}/${f}`);
  console.log("pixel-golden updated baselines");
  process.exit(0);
}
if (failed) {
  console.error("pixel-golden fail", failed);
  process.exit(1);
}
console.log("pixel-golden ok");
