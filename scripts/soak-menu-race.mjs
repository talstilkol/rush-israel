#!/usr/bin/env node
/** G1-05 / Codex 71: 20 menu→race cycles, textures delta ≤2. */
import { chromium } from "playwright";

const CYCLES = Number(process.env.SOAK_CYCLES || 20);
const url = process.env.SOAK_URL || "http://127.0.0.1:8080/?qa=1";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));

async function toTitle() {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 40000 });
  await page.waitForTimeout(900);
}

async function driveOnce() {
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
  await page.waitForFunction(() => !!window.__controlsTest, { timeout: 28000 });
  const mem = await page.evaluate(() => window.__controlsTest.getMemory?.() ?? { textures: 0, geometries: 0 });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  await page.evaluate(() =>
    [...document.querySelectorAll("button")].find((n) => /מסך ראשי|Main menu/.test(n.textContent || ""))?.click(),
  );
  await page.waitForTimeout(500);
  return mem;
}

await toTitle();
let first = { textures: 0, geometries: 0 };
let last = first;
let peakTextures = 0;
let peakGeometries = 0;
for (let i = 0; i < CYCLES; i++) {
  last = await driveOnce();
  if (i === 0) first = last;
  peakTextures = Math.max(peakTextures, last.textures);
  peakGeometries = Math.max(peakGeometries, last.geometries);
  if (errs.length) throw new Error(errs.join("\n"));
  console.log("cycle", i + 1, "/", CYCLES, "tex", last.textures, "geo", last.geometries);
}
await browser.close();
const dTex = last.textures - first.textures;
const dGeo = last.geometries - first.geometries;
if (dTex > 2) throw new Error("texture leak " + dTex + " " + JSON.stringify({ first, last, peakTextures }));
if (dGeo > 2) throw new Error("geometry leak " + dGeo + " " + JSON.stringify({ first, last, peakGeometries }));
console.log("soak ok", CYCLES, "dTex", dTex, "dGeo", dGeo, first, last);
