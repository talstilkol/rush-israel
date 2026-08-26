#!/usr/bin/env node
/** 14.9.2: Ayalon building colliders stay off the carriageway.
 * Interchange columns: center ≥ width/2+12. Surface ≥ width/2. */
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
const report = await p.evaluate(() => {
  const t = window.__controlsTest;
  const w = t.getTrackWidth();
  const half = w / 2;
  const minCenter = half + 12;
  const hits = [];
  let closest = Infinity;
  let n = 0;
  for (const c of t.getColliders()) {
    if (c.kind !== "building") continue;
    n++;
    const d = t.getNearestDist(c.x, c.z);
    closest = Math.min(closest, d);
    if (d - c.r < half - 0.25) hits.push({ why: "asphalt", d, r: c.r, x: c.x, z: c.z });
    else if (d < minCenter - 0.2) hits.push({ why: "offset", d, minCenter, r: c.r, x: c.x, z: c.z });
  }
  return { w, n, closest, minCenter, hits };
});
await b.close();
if (report.hits.length) {
  throw new Error("on-road buildings " + JSON.stringify(report.hits.slice(0, 6)));
}
if (report.n < 4) throw new Error("too few building colliders " + report.n);
console.log("collider-offset ok", report.n, "closest", +report.closest.toFixed(2), "minCenter", report.minCenter);
