import assert from 'node:assert/strict';
import { mkdir, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fromRoot } from './project-root.mjs';

/** Visual-mesh Ayalon clearance. Arcade circle/box evidence is not this probe. */
export const MESH_DRIVE_STEPS = 2400;
export const MESH_DRIVE_DT = 1 / 120;
export const MESH_SAMPLE_EVERY = 15;

export function oneSecondDriveIsNotMeshClearance(drive) {
  return !drive || drive.steps <= 120 || !drive.hullSamples;
}

export function meshClearanceResults(r) {
  assert.equal(r.colliderCount, 722);
  assert.equal(r.legacyCount, 546);
  assert.equal(r.pierCount, 176);
  assert.equal(r.rampCount, 50);
  assert.equal(r.routeSamples, 781);
  assert.equal(r.checkpointCount, 8);
  assert.deepEqual(r.carIds, ['sabra', 'carmel', 'kfir', 'negev', 'yam']);
  assert.deepEqual(r.pageErrors, []);
  assert.equal(r.glError, 0);
  assert.ok(r.hulls && typeof r.hulls === 'object');
  for (const id of r.carIds) {
    const hull = r.hulls[id];
    assert.ok(hull && [hull.halfLength, hull.halfWidth, hull.yMin, hull.yMax].every(Number.isFinite), `hull ${id}`);
    assert.ok(hull.arcadeIsNotMesh === true, `arcade proxy still covers ${id}`);
    assert.ok(hull.halfLength > 1.25, `${id} visual length must exceed the 1.25 arcade half-length`);
    assert.ok(hull.halfWidth > 0 && hull.yMax > 0 && hull.yMax <= 1.6 + 1e-6, `${id} visual roof ${hull.yMax}`);
  }
  assert.ok(Array.isArray(r.grid) && r.grid.length === 5);
  assert.ok(Array.isArray(r.center) && r.center.length === 781);
  assert.ok(Array.isArray(r.lanes) && r.lanes.length === 158);
  const hits = [...r.grid, ...r.center, ...r.lanes].filter(row => row.hits > 0 || row.finite === false);
  const drive = r.drive;
  assert.ok(drive && typeof drive === 'object', 'mesh-clearance drive evidence missing');
  for (const key of ['steps', 'maxSteps', 'hullSamples', 'hits', 'buried', 'respawns']) {
    assert.ok(Number.isFinite(drive[key]), `mesh-clearance drive ${key} missing`);
  }
  assert.equal(drive.maxSteps, MESH_DRIVE_STEPS);
  assert.ok(drive.steps > 120, '1s sampled drive is not mesh clearance');
  assert.ok(!oneSecondDriveIsNotMeshClearance(drive));
  assert.ok(drive.hullSamples > 0);
  const driveFail = drive.hits > 0 || drive.buried > 0 || drive.respawns > 0 || drive.finite === false
    || drive.steps >= drive.maxSteps && drive.hullSamples < 8;
  return [
    {
      case: 'visual hull exceeds the arcade circle/box on all five cars',
      status: r.carIds.every(id => r.hulls[id].arcadeIsNotMesh) ? 'passed' : 'failed',
      probes: r.carIds.length,
      failures: r.carIds.filter(id => !r.hulls[id].arcadeIsNotMesh).length,
    },
    {
      case: 'five-car rest pose visual hull vs live 722-collider catalogue',
      status: r.grid.some(row => row.hits > 0 || row.finite === false) ? 'failed' : 'passed',
      probes: r.grid.length,
      failures: r.grid.filter(row => row.hits > 0 || row.finite === false).length,
    },
    {
      case: '781 centerline rest-pose visual hulls vs live catalogue',
      status: r.center.some(row => row.hits > 0 || row.finite === false) ? 'failed' : 'passed',
      probes: r.center.length,
      failures: r.center.filter(row => row.hits > 0 || row.finite === false).length,
    },
    {
      case: 'sampled lane visual hulls at ±2.2',
      status: r.lanes.some(row => row.hits > 0 || row.finite === false) ? 'failed' : 'passed',
      probes: r.lanes.length,
      failures: r.lanes.filter(row => row.hits > 0 || row.finite === false).length,
    },
    {
      case: 'yawed visual hull samples during an AI drive without mesh hits',
      status: driveFail ? 'failed' : 'passed',
      probes: drive.hullSamples,
      failures: driveFail ? Math.max(1, drive.hits) : 0,
    },
    {
      case: 'arcade-only rest catalogue is not mesh clearance',
      status: hits.length ? 'failed' : 'passed',
      probes: r.grid.length + r.center.length + r.lanes.length,
      failures: hits.length,
    },
  ];
}

export async function measureMeshClearance(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const report = await page.evaluate(async ({ maxSteps, dt, every }) => {
      const { RaceEngine } = await import('/src/game/engine.ts');
      const { ArcadeCar, aiInput } = await import('/src/game/vehicle.ts');
      const { CARS } = await import('/src/game/cars.ts');
      const { visualHull, arcadeProxyIsNotMesh, visualOverlapsCollider } = await import('/src/game/car-hull.ts');
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
        const countHits = (car, body) => {
          let hits = 0;
          for (const collider of colliders) {
            if (visualOverlapsCollider(car, collider, body)) hits += 1;
          }
          return hits;
        };
        const hulls = Object.fromEntries(CARS.map(def => {
          const hull = visualHull(def.body);
          return [def.id, { ...hull, arcadeIsNotMesh: arcadeProxyIsNotMesh(hull), body: def.body }];
        }));
        const pose = (def, t, lateral, extra = {}) => {
          const car = new ArcadeCar(def, def.id);
          car.spawn(engine.built, t, lateral);
          Object.assign(car, extra);
          const hits = countHits(car, def.body);
          return {
            id: def.id, x: car.x, y: car.y, z: car.z, yaw: car.yaw, hits,
            finite: [car.x, car.y, car.z, car.yaw].every(Number.isFinite),
          };
        };
        const grid = CARS.map((def, i) => pose(def, 0.02, (i - 2) * 2.2));
        const center = samples.map((s) => pose(CARS[0], s.t, 0));
        const lanes = [];
        for (let sample = 0; sample < samples.length; sample += 10) {
          const s = samples[sample];
          for (const lateral of [-2.2, 2.2]) lanes.push(pose(CARS[0], s.t, lateral));
        }
        const car = new ArcadeCar(CARS[0], 'mesh clearance');
        car.spawn(engine.built, 0.02, 0);
        car.isAi = true;
        car.aiSkill = 1;
        car.aiOffset = 0;
        let buried = 0, respawns = 0, hullSamples = 0, hits = 0, steps = 0;
        for (; steps < maxSteps; steps++) {
          const prevOff = car.offTrackT;
          const inp = aiInput(car, engine.built);
          car.step(dt, inp, engine.built, true, colliders, streets, ramps);
          if (!Number.isFinite(car.y) || car.y < (samples[car.sampleIndex] ?? samples[0]).y - 0.5) buried += 1;
          if (prevOff > 3 && car.offTrackT < 0.05) respawns += 1;
          if (steps % every === 0) {
            hullSamples += 1;
            hits += countHits(car, CARS[0].body);
          }
        }
        return {
          colliderCount: colliders.length, legacyCount: legacy.length, pierCount: added.length,
          rampCount: ramps.length, routeSamples: samples.length,
          checkpointCount: engine.built.checkpoints.length,
          carIds: CARS.map(c => c.id),
          hulls, grid, center, lanes,
          drive: {
            steps, maxSteps, hullSamples, hits, buried, respawns,
            finite: [car.x, car.y, car.z, car.yaw].every(Number.isFinite),
          },
          glError: engine.renderer.getContext().getError(),
        };
      } finally {
        engine.dispose();
        canvas.remove();
      }
    }, { maxSteps: MESH_DRIVE_STEPS, dt: MESH_DRIVE_DT, every: MESH_SAMPLE_EVERY });
    return { ...report, pageErrors };
  } finally {
    await page.close();
  }
}

export async function retainMeshClearance(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = meshClearanceResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function verifyMeshClearance(browser, url) {
  const report = await measureMeshClearance(browser, url);
  const out = process.env.MESH_CLEARANCE_OUTPUT ?? fromRoot('artifacts', 'mesh-clearance');
  const results = await retainMeshClearance(report, out);
  assert.ok(results.every(row => row.status === 'passed'), JSON.stringify(results.concat(report.drive)));
  return results;
}

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  try {
    console.log(JSON.stringify(await verifyMeshClearance(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1')));
  } finally {
    await browser.close();
  }
}
