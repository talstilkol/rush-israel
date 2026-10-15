#!/usr/bin/env node
/** 21.8: Y follows HaShalom ramp surface (not spline-flat). */
import { chromium } from "playwright";

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
await p.waitForFunction(() => !!window.__controlsTest, { timeout: 35000 });
if (errs.length) throw new Error("boot " + errs.join("\n"));

const report = await p.evaluate(async () => {
  const t = window.__controlsTest;
  t.skipCountdown();
  const ramps = t.getRamps?.() ?? [];
  const list = ramps.filter((x) => /שלום|HaShalom/i.test(x.he) && Math.abs(x.y1 - x.y0) > 5);
  const r = list[list.length - 1] ?? list[0];
  if (!r) return { ok: false, n: ramps.length, samples: [] };
  const samples = [];
  for (const k of [0.1, 0.22, 0.34, 0.48]) {
    const along = (k - 0.5) * r.len;
    const x = r.x + r.sx * along;
    const z = r.z + r.sz * along;
    const expect = r.y0 + (r.y1 - r.y0) * k;
    samples.push({ k, expect, x, z });
  }
  return { ok: true, n: ramps.length, r, samples };
});
if (!report.ok) throw new Error("no HaShalom ramp n=" + report.n);

const measured = [];
for (const s of report.samples) {
  await p.evaluate(({ x, z, yaw }) => {
    window.__controlsTest.teleport(x, z, yaw, 0.2);
    window.__controlsTest.setThrottle(0);
    window.__controlsTest.setKeys([]);
    window.__controlsTest.setSteer(0);
    window.__controlsTest.advanceTime(1000);
  }, { x: s.x, z: s.z, yaw: Math.atan2(-report.r.sx, -report.r.sz) });
  // Surface following is a fixed-step physics assertion, not a frame-rate benchmark.
  const actual = await p.evaluate(() => ({
    x: window.__controlsTest.getX(), z: window.__controlsTest.getZ(), y: window.__controlsTest.getY(),
  }));
  // teleport() deliberately starts the test car at 14 m/s. Compare the ramp
  // height at its measured position after settling, not its earlier position.
  const along = (actual.x - report.r.x) * report.r.sx + (actual.z - report.r.z) * report.r.sz;
  const k = along / report.r.len + 0.5;
  if (k < 0 || k > 1) throw new Error(`left the measured ramp at k=${k}`);
  const expect = report.r.y0 + (report.r.y1 - report.r.y0) * k;
  measured.push({ k, expect, y: actual.y });
  if (Math.abs(actual.y - expect) > 0.85) {
    throw new Error(`Y@${k}=${actual.y.toFixed(2)} want ${expect.toFixed(2)} ±0.85`);
  }
}
const span = measured[measured.length - 1].y - measured[0].y;
if (span < 3) throw new Error("Y span " + span.toFixed(2) + " too small");
console.log("ramp-smoke ok", measured.map((m) => `${m.k}:${m.y.toFixed(1)}`).join(" "), "span", +span.toFixed(2));
await b.close();
