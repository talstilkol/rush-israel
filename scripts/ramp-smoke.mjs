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
    t.teleport(x, z, Math.atan2(-r.sx, -r.sz), expect);
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
  }, { x: s.x, z: s.z, yaw: Math.atan2(-report.r.sx, -report.r.sz) });
  await p.waitForTimeout(180);
  const y = await p.evaluate(() => window.__controlsTest.getY());
  measured.push({ k: s.k, expect: s.expect, y });
  if (Math.abs(y - s.expect) > 0.85) {
    throw new Error(`Y@${s.k}=${y.toFixed(2)} want ${s.expect.toFixed(2)} ±0.85`);
  }
}
const span = measured[measured.length - 1].y - measured[0].y;
if (span < 3) throw new Error("Y span " + span.toFixed(2) + " too small");
console.log("ramp-smoke ok", measured.map((m) => `${m.k}:${m.y.toFixed(1)}`).join(" "), "span", +span.toFixed(2));
await b.close();
