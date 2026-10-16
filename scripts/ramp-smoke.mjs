#!/usr/bin/env node
/** 21.8: Y follows HaShalom ramp surface (not spline-flat). */
import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fromRoot } from "./project-root.mjs";

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
  const selected = [list.find(r => r.y1 > r.y0), list.find(r => r.y1 < r.y0)];
  if (selected.some(r => !r)) return { ok: false, n: ramps.length, samples: [] };
  return { ok: true, n: ramps.length, ramps: selected.map(r => ({
    r,
    samples: [0.1, 0.22, 0.34, 0.48].map(k => ({
      x: r.x + r.sx * (k - 0.5) * r.len,
      z: r.z + r.sz * (k - 0.5) * r.len,
      y: r.y0 + (r.y1 - r.y0) * k,
    })),
  })) };
});
if (!report.ok) throw new Error("no HaShalom ramp n=" + report.n);

for (const { r, samples } of report.ramps) {
  const measured = [];
  for (const s of samples) {
    await p.evaluate(({ x, z, yaw, y }) => {
      window.__controlsTest.teleport(x, z, yaw, y);
      window.__controlsTest.setThrottle(0);
      window.__controlsTest.setKeys([]);
      window.__controlsTest.setSteer(0);
      window.__controlsTest.advanceTime(1000);
    }, { x: s.x, z: s.z, y: s.y, yaw: Math.atan2(-r.sx, -r.sz) });
    // Surface following is a fixed-step physics assertion, not a frame-rate benchmark.
    const actual = await p.evaluate(() => ({
      x: window.__controlsTest.getX(), z: window.__controlsTest.getZ(), y: window.__controlsTest.getY(),
    }));
    // teleport() deliberately starts the test car at 14 m/s. Compare the ramp
    // height at its measured position after settling, not its earlier position.
    const along = (actual.x - r.x) * r.sx + (actual.z - r.z) * r.sz;
    const k = along / r.len + 0.5;
    if (k < 0 || k > 1) throw new Error(`left the measured ramp at k=${k}`);
    const expect = r.y0 + (r.y1 - r.y0) * k;
    measured.push({ k, expect, y: actual.y });
    if (Math.abs(actual.y - expect) > 0.85) {
      throw new Error(`Y@${k}=${actual.y.toFixed(2)} want ${expect.toFixed(2)} ±0.85`);
    }
  }
  const delta = measured[measured.length - 1].y - measured[0].y;
  if (delta * (r.y1 - r.y0) <= 0) throw new Error('car height moves against the real ramp grade');
  const span = Math.max(...measured.map(m => m.y)) - Math.min(...measured.map(m => m.y));
  if (span < 3) throw new Error("Y span " + span.toFixed(2) + " too small");
  console.log("ramp-smoke ok", measured.map((m) => `${m.k}:${m.y.toFixed(1)}`).join(" "), "span", +span.toFixed(2));
}
// The real HaShalom ramps also need body-relative gravity while reversing.
// Isolate surface forces with production cars and actual world ramp geometry;
// this does not claim collision, full-race, controller or physical-device acceptance.
const gradeReport = await p.evaluate(async () => {
  const [{ ArcadeCar }, { CARS }, { buildTrack, closestSample }, { getTrack }, physics, { createWorld }] = await Promise.all([
    import('/src/game/vehicle.ts'), import('/src/game/cars.ts'), import('/src/game/spline.ts'),
    import('/src/game/tracks.ts'), import('/src/game/physics.ts'), import('/src/game/world.ts'),
  ]);
  const track = buildTrack(getTrack('ayalon'));
  const world = await createWorld(getTrack('ayalon'), track, false, false, 'clear');
  const actual = world.ramps.filter(r => /שלום|HaShalom/i.test(r.he) && Math.abs(r.y1 - r.y0) > 5);
  const selected = [actual.find(r => r.y1 > r.y0), actual.find(r => r.y1 < r.y0)];
  if (selected.some(r => !r)) throw new Error('Actual ascending and descending HaShalom ramps required');
  const rows = [];
  for (const r of selected) for (const def of CARS) for (const handling of ['arcade', 'simcade']) for (const weather of Object.keys(physics.WEATHER_SPEC)) {
    const run = (turned, speed) => {
      const car = new ArcadeCar(def, def.nameEn);
      car.handling = handling; car.weather = weather;
      const near = closestSample(track.samples, r.x, r.z);
      car.spawn(track, track.samples[near.index].t, 0);
      car.x = r.x; car.z = r.z; car.y = (r.y0 + r.y1) / 2;
      car.yaw = Math.atan2(-r.sx, -r.sz) + (turned ? Math.PI : 0);
      car.speed = speed; car.vx = -Math.sin(car.yaw) * speed; car.vz = -Math.cos(car.yaw) * speed;
      const recovered = car.step(physics.PHYSICS_DT, { steer: 0, throttle: 0, brake: 0, drift: false, nitro: false }, track, true, [], [], selected);
      return { speed: car.speed, pitch: car.pitch, damage: car.damage, onTrack: car.onTrack, recovered };
    };
    const along = run(false, 5), opposite = run(true, 5);
    const alongBackwards = run(true, -5), oppositeBackwards = run(false, -5);
    const sign = Math.sign(r.y1 - r.y0);
    const passed = (opposite.speed - along.speed) * sign > 0.001
      && Math.abs(along.speed + alongBackwards.speed) < 1e-8
      && Math.abs(opposite.speed + oppositeBackwards.speed) < 1e-8
      && along.pitch * sign < 0 && opposite.pitch * sign > 0
      && [along, opposite, alongBackwards, oppositeBackwards].every(c => c.damage === 0 && c.onTrack && !c.recovered && [c.speed, c.pitch].every(Number.isFinite));
    rows.push({ ramp: r.en, rise: r.y1 - r.y0, length: r.len, car: def.id, handling, weather, along, opposite, alongBackwards, oppositeBackwards, passed });
  }
  world.dispose();
  return { kind: 'actual-world-ramp-production-vehicle-force-regression', physicsVersion: physics.PHYSICS_VERSION, passed: rows.length === 80 && rows.every(r => r.passed), rows };
});
const sourceFiles = ['src/game/vehicle.ts', 'src/game/physics.ts', 'src/game/cars.ts', 'src/game/spline.ts', 'src/game/world-builders/tracks/ayalon.ts', 'scripts/ramp-smoke.mjs'];
gradeReport.testedSourceSha256 = Object.fromEntries(await Promise.all(sourceFiles.map(async file => [file, createHash('sha256').update(await readFile(fromRoot(file))).digest('hex')])));
await mkdir(fromRoot('artifacts', 'ramp-grade'), { recursive: true });
await writeFile(fromRoot('artifacts', 'ramp-grade', 'summary.json'), JSON.stringify(gradeReport, null, 2) + '\n');
await b.close();
if (!gradeReport.passed) throw new Error(`ramp-grade failed: ${JSON.stringify(gradeReport.rows.filter(r => !r.passed).slice(0, 4))}`);
console.log(`ramp-grade ok: ${gradeReport.rows.length} actual-ramp/car/handling/weather cases; Physics ${gradeReport.physicsVersion}`);
