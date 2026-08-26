#!/usr/bin/env node
/** Codex 83: Ayalon building colliders stay off the carriageway. */
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
  const min = w / 2 + 2;
  const hits = [];
  for (const c of t.getColliders()) {
    if (c.kind !== "building") continue;
    const best = t.getNearestDist(c.x, c.z);
    if (best < min) hits.push({ r: c.r, best, min, x: c.x, z: c.z });
  }
  return { min, n: t.getColliders().filter((c) => c.kind === "building").length, hits };
});
await b.close();
if (report.hits.length) {
  throw new Error("on-road buildings " + JSON.stringify(report.hits.slice(0, 6)));
}
if (report.n < 4) throw new Error("too few building colliders " + report.n);
console.log("collider-offset ok", report.n, "min", report.min);
