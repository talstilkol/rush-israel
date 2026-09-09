import assert from 'node:assert/strict';
import { mkdir, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fromRoot } from './project-root.mjs';

/** Actual Ayalon rest-pose/grid envelope probes. Arcade box, not a render-mesh. */
export async function measureRouteClearance(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const report = await page.evaluate(async () => {
      const { RaceEngine } = await import('/src/game/engine.ts');
      const { ArcadeCar } = await import('/src/game/vehicle.ts');
      const { CARS } = await import('/src/game/cars.ts');
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'width:800px;height:600px';
      document.body.append(canvas);
      const engine = new RaceEngine(canvas, {
        trackId: 'ayalon', carId: 'sabra', quality: 'low', night: false, langHe: true, onHud() {}, onFinish() {},
      });
      try {
        await engine.ready;
        engine.renderer.setAnimationLoop(null);
        const colliders = engine.world.colliders;
        const ramps = engine.world.ramps;
        const streets = engine.world.streets;
        const samples = engine.built.samples;
        const added = colliders.filter(c => c.role === 'support-pier');
        const legacy = colliders.filter(c => c.role !== 'support-pier');
        const probe = (car) => {
          const before = { x: car.x, y: car.y, z: car.z };
          car.lastHit = '';
          car.hitColliders(colliders);
          return {
            x: car.x, y: car.y, z: car.z,
            fromX: before.x, fromY: before.y, fromZ: before.z,
            moved: Math.hypot(car.x - before.x, car.z - before.z),
            dy: car.y - before.y, lastHit: car.lastHit,
            finite: [car.x, car.y, car.z, car.vx, car.vz].every(Number.isFinite),
          };
        };
        const pose = (t, lateral, extra = {}) => {
          const car = new ArcadeCar(CARS[0], 'route envelope');
          car.spawn(engine.built, t, lateral);
          Object.assign(car, extra);
          return car;
        };
        const grid = engine.racers.map(r => {
          const car = new ArcadeCar(r.stats, r.stats.id);
          Object.assign(car, { x: r.x, y: r.y, z: r.z, yaw: r.yaw, pitch: 0, roll: 0, vx: 0, vz: 0, vy: 0, speed: 0 });
          return { id: r.stats.id, x: r.x, y: r.y, z: r.z, ...probe(car) };
        });
        const center = samples.map((s, sample) => {
          const car = pose(s.t, 0);
          return { sample, t: s.t, roadY: s.y, lateral: 0, pitch: 0, ...probe(car) };
        });
        const lanes = [];
        for (let sample = 0; sample < samples.length; sample += 10) {
          const s = samples[sample];
          for (const lateral of [-2.2, 2.2]) {
            const car = pose(s.t, lateral);
            lanes.push({ sample, t: s.t, roadY: s.y, lateral, pitch: 0, ...probe(car) });
          }
        }
        const underpass = [];
        for (let sample = 0; sample < samples.length; sample++) {
          const s = samples[sample];
          for (let ramp = 0; ramp < ramps.length; ramp++) {
            const r = ramps[ramp], dx = s.x - r.x, dz = s.z - r.z;
            const along = dx * r.sx + dz * r.sz, across = dx * r.sz - dz * r.sx;
            if (Math.abs(along) > r.len / 2 || Math.abs(across) > r.half) continue;
            const deck = r.y0 + (r.y1 - r.y0) * (along / r.len + 0.5);
            if (!(deck >= 9.4 - 1e-6 && s.y + 1.6 < deck - 0.04)) continue;
            for (const pitch of [0, 0.4]) {
              const car = pose(s.t, 0, { pitch });
              underpass.push({ sample, ramp, t: s.t, roadY: s.y, deck, pitch, ...probe(car) });
            }
          }
        }
        const driveCar = pose(0.03, 0);
        const driveStart = { x: driveCar.x, y: driveCar.y, z: driveCar.z };
        const input = { throttle: 1, brake: 0, steer: 0, nitro: false, drift: false };
        let buried = 0, airborne = 0;
        for (let i = 0; i < 120; i++) {
          driveCar.step(1 / 120, input, engine.built, true, colliders, streets, ramps);
          if (!Number.isFinite(driveCar.y) || driveCar.y < driveStart.y - 0.5) buried += 1;
          if (driveCar.airborne) airborne += 1;
        }
        const drive = {
          steps: 120, buried, airborne,
          start: driveStart,
          end: { x: driveCar.x, y: driveCar.y, z: driveCar.z },
          progressed: Math.hypot(driveCar.x - driveStart.x, driveCar.z - driveStart.z),
          finite: [driveCar.x, driveCar.y, driveCar.z].every(Number.isFinite),
        };
        return {
          colliderCount: colliders.length, legacyCount: legacy.length, pierCount: added.length,
          rampCount: ramps.length, routeSamples: samples.length,
          checkpointCount: engine.built.checkpoints.length,
          carIds: CARS.map(c => c.id),
          grid, center, lanes, underpass, drive,
          glError: engine.renderer.getContext().getError(),
        };
      } finally {
        engine.dispose();
        canvas.remove();
      }
    });
    return { ...report, pageErrors };
  } finally {
    await page.close();
  }
}

const eps = 1e-8;
const displaced = (row) => !row.finite || row.moved > eps || Math.abs(row.dy) > eps;

export function routeClearanceResults(r) {
  assert.equal(r.colliderCount, 722);
  assert.equal(r.legacyCount, 546);
  assert.equal(r.pierCount, 176);
  assert.equal(r.rampCount, 50);
  assert.equal(r.routeSamples, 781);
  assert.equal(r.checkpointCount, 8);
  assert.deepEqual(r.carIds, ['sabra', 'carmel', 'kfir', 'negev', 'yam']);
  assert.deepEqual(r.pageErrors, []);
  assert.equal(r.glError, 0);
  assert.equal(r.grid.length, 4);
  assert.deepEqual(r.grid.map(c => c.id), ['sabra', 'carmel', 'kfir', 'negev']);
  assert.equal(r.center.length, 781);
  assert.equal(r.lanes.length, 158);
  assert.ok(r.underpass.length > 0);
  for (const row of [...r.grid, ...r.center, ...r.lanes, ...r.underpass]) {
    assert.ok([row.x, row.y, row.z, row.fromX, row.fromY, row.fromZ, row.moved, row.dy].every(Number.isFinite));
  }
  for (const car of r.grid) assert.ok([car.x, car.y, car.z].every(Number.isFinite));
  const gridHits = r.grid.filter(displaced);
  const centerHits = r.center.filter(displaced);
  const laneHits = r.lanes.filter(displaced);
  const underHits = r.underpass.filter(displaced);
  assert.equal(r.drive.steps, 120);
  assert.ok(r.drive.finite);
  assert.ok([r.drive.start.y, r.drive.end.y, r.drive.progressed].every(Number.isFinite));
  const driveFail = r.drive.buried > 0 || r.drive.airborne > 0 || r.drive.progressed < 1 || !r.drive.finite;
  return [
    { case: 'four-car grid rest pose vs live 722-collider catalogue', status: gridHits.length ? 'failed' : 'passed', probes: r.grid.length, failures: gridHits.length },
    { case: '781 centerline rest-pose samples vs live catalogue', status: centerHits.length ? 'failed' : 'passed', probes: r.center.length, failures: centerHits.length },
    { case: 'sampled lane rest poses at ±2.2', status: laneHits.length ? 'failed' : 'passed', probes: r.lanes.length, failures: laneHits.length },
    { case: '9.4 underpass rest/pitched envelope stays on the road', status: underHits.length ? 'failed' : 'passed', probes: r.underpass.length, failures: underHits.length },
    { case: '1s centerline drive from grid t without burial', status: driveFail ? 'failed' : 'passed', probes: r.drive.steps, failures: driveFail ? 1 : 0 },
  ];
}

export async function retainRouteClearance(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = routeClearanceResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function verifyRouteClearance(browser, url) {
  const report = await measureRouteClearance(browser, url);
  const out = process.env.ROUTE_CLEARANCE_OUTPUT ?? fromRoot('artifacts', 'route-clearance');
  const results = await retainRouteClearance(report, out);
  assert.ok(results.every(row => row.status === 'passed'), JSON.stringify(results));
  return results;
}

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  try {
    console.log(JSON.stringify(await verifyRouteClearance(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1')));
  } finally {
    await browser.close();
  }
}
