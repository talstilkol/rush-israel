#!/usr/bin/env node
/** G1-05 soak. Default 8 cycles — not 100. Prints heap if exposed. */
import { chromium } from "playwright";

const CYCLES = Number(process.env.SOAK_CYCLES || 8);
const url = process.env.SOAK_URL || "http://127.0.0.1:8080/";

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
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  await page.evaluate(() =>
    [...document.querySelectorAll("button")].find((n) => /מסך ראשי|Main menu/.test(n.textContent || ""))?.click(),
  );
  await page.waitForTimeout(500);
}

await toTitle();
for (let i = 0; i < CYCLES; i++) {
  await driveOnce();
  if (errs.length) throw new Error(errs.join("\n"));
  console.log("cycle", i + 1, "/", CYCLES);
}
await browser.close();
console.log("soak ok", CYCLES);
