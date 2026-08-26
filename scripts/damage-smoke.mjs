#!/usr/bin/env node
/** Codex 64: Esc keeps damage, restart zeros it. */
import { chromium } from "playwright";

const url = process.env.SMOKE_URL ?? "http://127.0.0.1:8080/?qa=1";
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto(url, { waitUntil: "networkidle", timeout: 25000 });
await p.waitForTimeout(600);
await p.evaluate(() =>
  [...document.querySelectorAll("button")].find((n) => /בחר מסלול/.test(n.textContent || ""))?.click(),
);
await p.waitForTimeout(300);
await p.evaluate(() =>
  [...document.querySelectorAll("button")].find((n) => /^הכל$/.test((n.textContent || "").trim()))?.click(),
);
await p.waitForTimeout(200);
await p.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => /נתיבי איילון/.test(b.textContent || ""))?.click();
});
await p.waitForFunction(() => !!window.__controlsTest, { timeout: 35000 });
await p.evaluate(() => {
  window.__controlsTest.skipCountdown();
  window.__controlsTest.setDamage(0.7);
});
const hurt = await p.evaluate(() => window.__controlsTest.getDamage());
if (hurt < 0.6) throw new Error("setDamage failed " + hurt);
await p.keyboard.press("Escape");
await p.waitForTimeout(200);
const afterEsc = await p.evaluate(() => window.__controlsTest.getDamage());
if (afterEsc < 0.6) throw new Error("Esc reset damage " + afterEsc);
await p.evaluate(() => window.__controlsTest.resetStart());
const after = await p.evaluate(() => window.__controlsTest.getDamage());
await b.close();
if (after > 0.02) throw new Error("restart did not zero damage " + after);
console.log("damage-smoke ok", { hurt, afterEsc, after });
