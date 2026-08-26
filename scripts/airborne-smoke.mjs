#!/usr/bin/env node
/** Codex 63: ramp snap is not airborne; a 2m drop is. */
import { chromium } from "playwright";

const url = process.env.SMOKE_URL ?? "http://127.0.0.1:8080/?qa=1";
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto(url, { waitUntil: "networkidle", timeout: 25000 });
await p.waitForTimeout(500);
await p.evaluate(() =>
  [...document.querySelectorAll("button")].find((n) => /בחר מסלול/.test(n.textContent || ""))?.click(),
);
await p.waitForTimeout(250);
await p.evaluate(() =>
  [...document.querySelectorAll("button")].find((n) => /^הכל$/.test((n.textContent || "").trim()))?.click(),
);
await p.waitForTimeout(200);
await p.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => /נתיבי איילון/.test(b.textContent || ""))?.click();
});
await p.waitForFunction(() => !!window.__controlsTest, { timeout: 35000 });
await p.evaluate(() => window.__controlsTest.skipCountdown());

const rampAir = await p.evaluate(async () => {
  const t = window.__controlsTest;
  const ramps = t.getRamps?.() ?? [];
  const r = ramps.find((x) => /שלום|HaShalom/i.test(x.he) && Math.abs(x.y1 - x.y0) > 5);
  if (!r) return { ok: false };
  const k = 0.34;
  const along = (k - 0.5) * r.len;
  t.teleport(r.x + r.sx * along, r.z + r.sz * along, Math.atan2(-r.sx, -r.sz), r.y0 + (r.y1 - r.y0) * k);
  return { ok: true };
});
if (!rampAir.ok) throw new Error("no HaShalom ramp");
await p.waitForTimeout(220);
const onRamp = await p.evaluate(() => window.__controlsTest.getAirborne());
if (onRamp) throw new Error("ramp set airborne");

await p.evaluate(() => window.__controlsTest.resetStart());
await p.waitForTimeout(80);
await p.evaluate(() => {
  const t = window.__controlsTest;
  t.teleport(t.getX(), t.getZ(), t.getYaw(), t.getY() + 2.2);
});
await p.waitForTimeout(50);
const mid = await p.evaluate(() => ({ a: window.__controlsTest.getAirborne(), y: window.__controlsTest.getY() }));
if (!mid.a) throw new Error("drop did not go airborne y=" + mid.y);

await p.waitForTimeout(900);
const land = await p.evaluate(() => ({ a: window.__controlsTest.getAirborne(), y: window.__controlsTest.getY(), on: window.__controlsTest.getOnTrack() }));
await b.close();
if (land.a) throw new Error("stuck airborne y=" + land.y);
if (!land.on) throw new Error("fell off Ayalon");
console.log("airborne-smoke ok", { onRamp, mid, land });
