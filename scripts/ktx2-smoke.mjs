#!/usr/bin/env node
/** 9.1: blob.ktx2 must load on High without pageerror. */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const buf = readFileSync("/workspace/public/game/blob.ktx2");
const mag = Buffer.from([0xab, 0x4b, 0x54, 0x58, 0x20, 0x32, 0x30, 0xbb, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!buf.subarray(0, 12).equals(mag)) throw new Error("bad ktx2 magic");

const url = process.env.SMOKE_URL ?? "http://127.0.0.1:8080/?qa=1";
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e).slice(0, 220)));
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
if (errs.length) throw new Error("boot " + errs.join("\n"));
const ok = await p.evaluate(() => window.__controlsTest.blobKtx2?.() === true);
await b.close();
if (!ok) throw new Error("blob.ktx2 not used");
console.log("ktx2-smoke ok");
