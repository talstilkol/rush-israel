#!/usr/bin/env node
/** 21.20: ?webgpu=1 must boot WebGL game even if GPU probe fails. */
import { chromium } from "playwright";

const url = process.env.SMOKE_URL ?? "http://127.0.0.1:8080/?qa=1&webgpu=1";
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e).slice(0, 220)));
await p.goto(url, { waitUntil: "networkidle", timeout: 25000 });
await p.waitForTimeout(700);
await p.evaluate(() =>
  [...document.querySelectorAll("button")].find((n) => /בחר מסלול/.test(n.textContent || ""))?.click(),
);
await p.waitForTimeout(350);
await p.evaluate(() =>
  [...document.querySelectorAll("button")].find((n) => /^הכל$/.test((n.textContent || "").trim()))?.click(),
);
await p.waitForTimeout(250);
const ok = await p.evaluate(() => {
  const n = [...document.querySelectorAll("button")].find((b) => /נתיבי איילון/.test(b.textContent || ""));
  n?.click();
  return !!n;
});
if (!ok) throw new Error("no Ayalon");
await p.waitForFunction(() => !!window.__controlsTest, { timeout: 40000 });
if (errs.length) throw new Error("boot " + errs.join("\n"));
const info = await p.evaluate(() => {
  const t = window.__controlsTest;
  return {
    tried: t.webgpuTried?.() ?? false,
    ok: t.webgpuOk?.() ?? false,
    reason: t.webgpuReason?.() ?? "",
    backend: t.exportTelemetry?.()?.backend,
  };
});
if (!info.tried) throw new Error("webgpu flag ignored " + JSON.stringify(info));
await p.evaluate(() => {
  const t = window.__controlsTest;
  t.skipCountdown();
  t.resetStart();
  t.setThrottle(1);
  t.setKeys(["KeyW"]);
});
await p.waitForFunction(() => (window.__controlsTest.getSpeed() ?? 0) > 5, { timeout: 16000 });
await b.close();
console.log("webgpu-smoke", info);
