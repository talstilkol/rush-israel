import assert from 'node:assert/strict';
import { mkdir, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fromRoot } from './project-root.mjs';

/** Complete Ayalon lap with the live arcade box and production AI. Not a render-mesh. */
export const COMPLETE_RACE_MAX_STEPS = 18000;
export const COMPLETE_RACE_DT = 1 / 120;

export function oneSecondDriveIsNotComplete(drive) {
  return !drive || drive.steps <= 120 || drive.progressed < 100;
}

export function completeRaceResults(r) {
  assert.equal(r.colliderCount, 722);
  assert.equal(r.legacyCount, 546);
  assert.equal(r.pierCount, 176);
  assert.equal(r.rampCount, 50);
  assert.equal(r.routeSamples, 781);
  assert.equal(r.checkpointCount, 8);
  assert.deepEqual(r.carIds, ['sabra', 'carmel', 'kfir', 'negev', 'yam']);
  assert.deepEqual(r.pageErrors, []);
  assert.equal(r.glError, 0);
  const race = r.race;
  assert.ok(race && typeof race === 'object', 'complete-race evidence missing');
  for (const key of ['steps', 'maxSteps', 'buried', 'airborne', 'respawns', 'stalled', 'progress', 'progressed', 'lastCheckpoint', 'lap']) {
    assert.ok(Number.isFinite(race[key]), `complete-race ${key} missing`);
  }
  assert.equal(race.maxSteps, COMPLETE_RACE_MAX_STEPS);
  assert.ok(Array.isArray(race.checkpointsHit));
  assert.ok(race.finite === true || race.finite === false);
  assert.ok(race.lapComplete === true || race.lapComplete === false);
  assert.ok(race.steps > 120, '1s sampled drive is not a complete race');
  assert.ok(!oneSecondDriveIsNotComplete({ steps: race.steps, progressed: race.progressed }));
  const stuckAir = race.endedAirborne === true && race.endHeight > 4;
  const fail = race.buried > 0 || race.respawns > 0 || !race.finite || !race.lapComplete
    || race.progress < 0.96 || race.lastCheckpoint !== 7 || race.steps >= race.maxSteps
    || stuckAir || race.stalled > 240;
  return [
    {
      case: 'complete Ayalon arcade lap through 8 checkpoints without burial',
      status: fail ? 'failed' : 'passed',
      probes: race.steps,
      failures: fail ? 1 : 0,
    },
  ];
}

export async function measureCompleteRace(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const report = await page.evaluate(async ({ maxSteps, dt }) => {
      const { RaceEngine } = await import('/src/game/engine.ts');
      const { ArcadeCar, aiInput } = await import('/src/game/vehicle.ts');
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
        const car = new ArcadeCar(CARS[0], 'complete race');
        car.spawn(engine.built, 0.02, 0);
        car.isAi = true;
        car.aiSkill = 1;
        car.aiOffset = 0;
        const start = { x: car.x, y: car.y, z: car.z };
        const checkpointsHit = [];
        let buried = 0, airborne = 0, respawns = 0, stalled = 0;
        let steps = 0;
        for (; steps < maxSteps; steps++) {
          const prevProgress = car.progress;
          const prevLast = car.lastCheckpoint;
          const prevOff = car.offTrackT;
          const prevX = car.x, prevZ = car.z;
          const inp = aiInput(car, engine.built);
          car.step(dt, inp, engine.built, true, colliders, streets, ramps);
          const ev = car.consumeCheckpoints(engine.built, prevProgress);
          if (ev.checkpoint && car.lastCheckpoint !== prevLast) checkpointsHit.push(car.lastCheckpoint);
          const s = samples[car.sampleIndex] ?? samples[0];
          if (!Number.isFinite(car.y) || car.y < s.y - 0.5) buried += 1;
          if (car.airborne) airborne += 1;
          if (prevOff > 3 && car.offTrackT < 0.05) respawns += 1;
          if (Math.hypot(car.x - prevX, car.z - prevZ) < 1e-4 && Math.abs(car.speed) < 0.2) stalled += 1;
          else stalled = 0;
          if (ev.lapComplete || car.progress >= 0.96) { steps += 1; break; }
        }
        const end = samples[car.sampleIndex] ?? samples[0];
        return {
          colliderCount: colliders.length, legacyCount: legacy.length, pierCount: added.length,
          rampCount: ramps.length, routeSamples: samples.length,
          checkpointCount: engine.built.checkpoints.length,
          carIds: CARS.map(c => c.id),
          race: {
            steps, maxSteps, buried, airborne, respawns, stalled,
            checkpointsHit, lastCheckpoint: car.lastCheckpoint,
            lapComplete: car.lap >= 1 || car.progress >= 0.96,
            lap: car.lap, progress: car.progress,
            progressed: Math.hypot(car.x - start.x, car.z - start.z),
            finite: [car.x, car.y, car.z, car.progress, car.speed].every(Number.isFinite),
            endedAirborne: car.airborne === true,
            endHeight: car.y - end.y,
          },
          glError: engine.renderer.getContext().getError(),
        };
      } finally {
        engine.dispose();
        canvas.remove();
      }
    }, { maxSteps: COMPLETE_RACE_MAX_STEPS, dt: COMPLETE_RACE_DT });
    return { ...report, pageErrors };
  } finally {
    await page.close();
  }
}

export async function retainCompleteRace(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = completeRaceResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function verifyCompleteRace(browser, url) {
  const report = await measureCompleteRace(browser, url);
  const out = process.env.COMPLETE_RACE_OUTPUT ?? fromRoot('artifacts', 'complete-race');
  const results = await retainCompleteRace(report, out);
  assert.ok(results.every(row => row.status === 'passed'), JSON.stringify(results.concat(report.race)));
  return results;
}

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  try {
    console.log(JSON.stringify(await verifyCompleteRace(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1')));
  } finally {
    await browser.close();
  }
}
