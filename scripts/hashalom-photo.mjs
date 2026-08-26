#!/usr/bin/env node
/** 21.9: HaShalom photo pack. User unblocked by המשך. Not an Ayalon freeze. */
import { chromium } from "playwright";
import { mkdir, writeFile, stat } from "node:fs/promises";

const out = process.env.GOLDEN_DIR || "/workspace/golden-baseline";
await mkdir(out, { recursive: true });
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
  [...document.querySelectorAll("button")].find((n) => /נתיבי איילון/.test(n.textContent || ""))?.click();
});
await p.waitForFunction(() => !!window.__controlsTest, { timeout: 35000 });
await p.evaluate(() => window.__controlsTest.skipCountdown());

await p.evaluate(() => window.__controlsTest.frameAzrieli());
await p.waitForTimeout(600);
const lock = await p.evaluate(() => window.__controlsTest.getPhotoLock?.());
await p.screenshot({ path: `${out}/hashalom-azrieli.png` });
await p.evaluate(() => window.__controlsTest.exitPhoto());

const shots = [`${out}/hashalom-azrieli.png`];
for (const [fn, name] of [
  ["frameToHa", "hashalom-toha.png"],
  ["frameCityGate", "hashalom-citygate.png"],
  ["frameMidtown", "hashalom-midtown.png"],
  ["frameElectra", "hashalom-electra.png"],
  ["frameSavidor", "hashalom-savidor.png"],
  ["frameHagana", "hashalom-hagana.png"],
  ["frameUniversity", "hashalom-university.png"],
  ["frameGaluyot", "hashalom-galuyot.png"],
  ["framePlatinum", "hashalom-platinum.png"],
  ["frameTau", "hashalom-tau.png"],
  ["frameSarona", "hashalom-sarona.png"],
  ["frameHakirya", "hashalom-hakirya.png"],
  ["frameShalomMeir", "hashalom-shalommeir.png"],
]) {
  await p.evaluate((f) => window.__controlsTest[f](), fn);
  await p.waitForTimeout(500);
  const file = `${out}/${name}`;
  await p.screenshot({ path: file });
  shots.push(file);
  await p.evaluate(() => window.__controlsTest.exitPhoto());
}

for (const id of ["g04", "g05", "g06"]) {
  const ok = await p.evaluate((gid) => window.__controlsTest.gotoGolden(gid), id);
  if (!ok) throw new Error("missing golden " + id);
  await p.waitForTimeout(480);
  const file = `${out}/hashalom-${id}.png`;
  await p.screenshot({ path: file });
  shots.push(file);
}

const ramp = await p.evaluate(() => {
  const t = window.__controlsTest;
  const ramps = t.getRamps?.() ?? [];
  const r = ramps.find((x) => /שלום|HaShalom/i.test(x.he) && Math.abs(x.y1 - x.y0) > 5);
  if (!r) return null;
  const k = 0.4;
  const along = (k - 0.5) * r.len;
  t.teleport(r.x + r.sx * along, r.z + r.sz * along, Math.atan2(-r.sx, -r.sz), r.y0 + (r.y1 - r.y0) * k);
  return { y0: r.y0, y1: r.y1, len: r.len, he: r.he };
});
if (!ramp) throw new Error("no HaShalom ramp");
await p.waitForTimeout(280);
const file = `${out}/hashalom-ramp.png`;
await p.screenshot({ path: file });
shots.push(file);
const live = await p.evaluate(() => ({
  y: window.__controlsTest.getY(),
  side: window.__controlsTest.getSide(),
  airborne: window.__controlsTest.getAirborne(),
  progress: window.__controlsTest.getProgress(),
}));
if (live.airborne) throw new Error("ramp airborne");
const lo = Math.min(ramp.y0, ramp.y1) - 0.4;
const hi = Math.max(ramp.y0, ramp.y1) + 0.4;
if (live.y < lo || live.y > hi) throw new Error("ramp Y " + live.y + " not in " + lo + ".." + hi);

for (const f of shots) {
  const s = await stat(f);
  if (s.size < 20000) throw new Error("tiny " + f + " " + s.size);
}
await writeFile(
  `${out}/hashalom-photo.json`,
  JSON.stringify({ ramp, live, lock, shots: shots.map((s) => s.split("/").pop()) }, null, 2),
);
await b.close();
console.log("hashalom-photo ok", live.side, "y", +live.y.toFixed(2));
