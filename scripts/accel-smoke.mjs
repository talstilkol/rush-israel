#!/usr/bin/env node
/** 0–100 lab: Ayalon, TCS/ABS/ESC off, 3 runs × 5 cars.
 * Gate: ±15% vs claimed zeroTo100. Cars are extrusion, not a scan. */
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { CARS } from "../src/game/cars.ts";
import { PHYSICS_VERSION } from "../src/game/physics.ts";

const url = process.env.SMOKE_URL ?? "http://127.0.0.1:8080/?qa=1";
const TOL = 0.15;
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

async function oneRun(carId) {
  return p.evaluate((id) => {
    const t = window.__controlsTest;
    t.resetStart();
    t.skipCountdown();
    t.setCarId(id);
    t.setAssists({ abs: false, tcs: false, esc: false });
    t.setNitro(0);
    t.setDamage(0);
    t.setSteer(0);
    t.setThrottle(1);
    t.setKeys(["KeyW"]);
    let t0 = null;
    let ms = 0;
    for (let i = 0; i < 480; i++) {
      t.advanceTime(50);
      ms += 50;
      const v = t.getSpeed();
      if (t.getDamage() > 0.04) return { t: null, v, hit: true };
      if (t0 == null && v > 0.5) t0 = ms;
      if (t0 != null && v >= 27.778) return { t: (ms - t0) / 1000, v, hit: false };
    }
    return { t: null, v: t.getSpeed(), hit: false };
  }, carId);
}

const runsOut = [];
const fails = [];
for (const car of CARS) {
  const times = [];
  for (let n = 0; n < 3; n++) {
    const r = await oneRun(car.id);
    if (r.t == null || r.hit) {
      fails.push(`${car.id} run${n} v=${r.v?.toFixed?.(1)} hit=${r.hit}`);
      continue;
    }
    times.push(+r.t.toFixed(3));
  }
  if (times.length < 2) {
    fails.push(`${car.id} too few runs ${times}`);
    runsOut.push({ carId: car.id, t: times, mean: null, target: car.zeroTo100, tol: TOL, model: "extrusion", ok: false });
    continue;
  }
  const mean = times.reduce((a, b) => a + b, 0) / times.length;
  const lo = car.zeroTo100 * (1 - TOL);
  const hi = car.zeroTo100 * (1 + TOL);
  const okCar = mean >= lo && mean <= hi;
  if (!okCar) fails.push(`${car.id} mean ${mean.toFixed(2)}s not in ${lo.toFixed(2)}–${hi.toFixed(2)} (claim ${car.zeroTo100})`);
  runsOut.push({
    carId: car.id,
    t: times,
    mean: +mean.toFixed(3),
    target: car.zeroTo100,
    tol: TOL,
    model: "extrusion",
    ok: okCar,
  });
}

const report = {
  physicsVersion: PHYSICS_VERSION,
  track: "ayalon",
  note: "extrusion glTF, not a scanned hero. ±15% vs claimed zeroTo100.",
  runs: runsOut,
};
await mkdir("artifacts", { recursive: true });
await writeFile("artifacts/accel.json", JSON.stringify(report, null, 2));
await writeFile("golden-baseline/accel.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await b.close();
if (fails.length) throw new Error("qa:accel fail\n" + fails.join("\n"));
console.log("accel-smoke ok");
