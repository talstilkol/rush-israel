#!/usr/bin/env node
import { chromium } from "playwright";

const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const url = process.env.SMOKE_URL ?? "http://127.0.0.1:8080/?qa=1";

const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
await p.goto(url, { waitUntil: "networkidle", timeout: 25000 });
await p.waitForTimeout(700);
if (errs.length) throw new Error("boot " + errs.join("\n"));
await p.evaluate(() =>
  [...document.querySelectorAll("button")].find((n) => /בחר מסלול/.test(n.textContent || ""))?.click(),
);
await p.waitForTimeout(400);
await p.evaluate(() =>
  [...document.querySelectorAll("button")].find((n) => /^הכל$/.test((n.textContent || "").trim()))?.click(),
);
await p.waitForTimeout(300);
const ok = await p.evaluate(() => {
  const n = [...document.querySelectorAll("button")].find((b) => /נתיבי איילון/.test(b.textContent || ""));
  n?.click();
  return !!n;
});
if (!ok) throw new Error("no Ayalon card");
await p.waitForFunction(() => !!window.__controlsTest, { timeout: 35000 });
if (errs.length) throw new Error("race " + errs.join("\n"));
await p.evaluate(() => {
  const t = window.__controlsTest;
  t.resetStart();
  t.skipCountdown();
  t.setThrottle(1);
  t.setKeys(["KeyW"]);
  for (let i = 0; i < 240 && (t.getSpeed() ?? 0) < 12; i++) t.advanceTime(50);
});
const mix = await p.evaluate(() => window.__controlsTest.getKinMix?.() ?? -1);
const spd = await p.evaluate(() => window.__controlsTest.getSpeed());
if (spd < 12) throw new Error("never reached 12 m/s v=" + spd);
if (mix > 0.001) throw new Error("crawl still on at speed kinMix=" + mix);
const corridor = await p.evaluate(() => {
  const t = window.__controlsTest;
  t.resetStart();
  t.skipCountdown();
  t.setDamage(0);
  t.setSteer(0);
  t.setThrottle(1);
  t.setKeys(["KeyW"]);
  const x0 = t.getX();
  const z0 = t.getZ();
  let dist = 0;
  let dmg = 0;
  for (let i = 0; i < 500; i++) {
    t.advanceTime(50);
    dist = Math.hypot(t.getX() - x0, t.getZ() - z0);
    dmg = t.getDamage();
    if (dmg > 0.04) return { ok: false, dist, dmg, on: t.getOnTrack() };
    if (dist >= 200) return { ok: true, dist, dmg, on: t.getOnTrack() };
  }
  return { ok: false, dist, dmg, on: t.getOnTrack() };
});
if (!corridor.ok) throw new Error("ayalon 200m hit " + JSON.stringify(corridor));
if (!corridor.on) throw new Error("ayalon 200m left track");
const yawDelta = await p.evaluate(() => {
  const t = window.__controlsTest;
  const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  t.setThrottle(1);
  t.setSteer(0);
  for (let i = 0; i < 8; i++) t.advanceTime(50);
  const y0 = t.getYaw();
  t.setSteer(1);
  for (let i = 0; i < 12; i++) t.advanceTime(50);
  const dA = wrap(t.getYaw() - y0);
  t.setSteer(0);
  for (let i = 0; i < 10; i++) t.advanceTime(50);
  const y1 = t.getYaw();
  t.setSteer(-1);
  for (let i = 0; i < 12; i++) t.advanceTime(50);
  const dD = wrap(t.getYaw() - y1);
  t.setSteer(0);
  return { dA, dD, speed: t.getSpeed() };
});
if (yawDelta.dA <= 0.03) throw new Error("steer A left " + JSON.stringify(yawDelta));
if (yawDelta.dD >= -0.03) throw new Error("steer D right " + JSON.stringify(yawDelta));
console.log("drive-smoke ok", yawDelta);
await b.close();
