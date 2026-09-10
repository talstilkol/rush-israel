import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
import { fromRoot } from './project-root.mjs';
import {
  COMPLETE_RACE_MAX_STEPS, completeRaceResults, oneSecondDriveIsNotComplete, retainCompleteRace,
} from './complete-race-browser.mjs';

const memo = new Map();
function compile(file) {
  if (memo.has(file)) return memo.get(file);
  let js = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  js = js.replace(/from\s*(["'])([^"']+)\1/g, (_, quote, spec) => {
    assert.ok(spec.startsWith('.'), `Unexpected dependency: ${spec}`);
    return `from ${JSON.stringify(compile(resolve(dirname(file), spec + (spec.endsWith('.ts') ? '' : '.ts'))))}`;
  });
  const uri = `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;
  memo.set(file, uri);
  return uri;
}
const { ArcadeCar, aiInput } = await import(compile(fromRoot('src/game/vehicle.ts')));
const { CARS } = await import(compile(fromRoot('src/game/cars.ts')));

function raceRow(extra = {}) {
  return {
    steps: 8000, maxSteps: COMPLETE_RACE_MAX_STEPS, buried: 0, airborne: 12, respawns: 0, stalled: 0,
    checkpointsHit: [1, 2, 3, 4, 5, 6, 7], lastCheckpoint: 7, lapComplete: true, lap: 1,
    progress: 0.97, progressed: 2580, finite: true, endedAirborne: false, endHeight: 0.02, ...extra,
  };
}
function fixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, carIds: ['sabra', 'carmel', 'kfir', 'negev', 'yam'],
    pageErrors: [], glError: 0, race: raceRow(), ...extra,
  };
}

test('1s centerline drive is not complete-race qualification', () => {
  assert.equal(oneSecondDriveIsNotComplete({ steps: 120, progressed: 1.62 }), true);
  assert.equal(oneSecondDriveIsNotComplete({ steps: 8000, progressed: 2580 }), false);
});

test('complete lap evidence yields one pass on the live 722-collider catalogue', () => {
  assert.deepEqual(completeRaceResults(fixture()).map(r => r.status), ['passed']);
});

for (const [name, mutate] of [
  ['lost collider', r => { r.colliderCount = 721; }],
  ['lost pier', r => { r.pierCount = 175; }],
  ['lost ramp', r => { r.rampCount = 49; }],
  ['lost checkpoint', r => { r.checkpointCount = 7; }],
  ['page error', r => r.pageErrors.push('error')],
  ['gl error', r => { r.glError = 1; }],
  ['missing race', r => { delete r.race; }],
]) test(`complete-race evidence fails closed: ${name}`, () => {
  const r = fixture();
  mutate(r);
  assert.throws(() => completeRaceResults(r));
});

test('the old 120-step drive cannot be relabelled a complete lap', () => {
  const r = fixture({ race: raceRow({ steps: 120, progressed: 1.62, progress: 0.03, lapComplete: false, lastCheckpoint: 0, checkpointsHit: [] }) });
  assert.throws(() => completeRaceResults(r), /1s sampled drive is not a complete race/);
});

test('a buried complete lap remains failed', () => {
  const r = fixture({ race: raceRow({ buried: 3 }) });
  assert.equal(completeRaceResults(r)[0].status, 'failed');
});

test('an off-track respawn remains failed', () => {
  const r = fixture({ race: raceRow({ respawns: 1 }) });
  assert.equal(completeRaceResults(r)[0].status, 'failed');
});

test('stopping before 0.96 progress remains failed', () => {
  const r = fixture({ race: raceRow({ progress: 0.5, lapComplete: false, lastCheckpoint: 3, checkpointsHit: [1, 2, 3] }) });
  assert.equal(completeRaceResults(r)[0].status, 'failed');
});

test('hitting the step cap without finishing remains failed', () => {
  const r = fixture({ race: raceRow({ steps: COMPLETE_RACE_MAX_STEPS, lapComplete: true, progress: 0.97 }) });
  assert.equal(completeRaceResults(r)[0].status, 'failed');
});

test('a stuck airborne finish remains failed', () => {
  const r = fixture({ race: raceRow({ endedAirborne: true, endHeight: 6 }) });
  assert.equal(completeRaceResults(r)[0].status, 'failed');
});

test('invalid complete-race report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'complete-race-invalid-'));
  try {
    const r = fixture();
    r.colliderCount = 711;
    await assert.rejects(retainCompleteRace(r, out));
    assert.equal(JSON.parse(await readFile(join(out, 'results.json'), 'utf8')).colliderCount, 711);
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});

const track = {
  samples: Array.from({ length: 401 }, (_, i) => ({ x: 0, z: i - 200, y: 0, t: i / 400, tx: 0, tz: 1, rx: 1, rz: 0 })),
  length: 400, width: 28, checkpoints: [1 / 8.15, 2 / 8.15, 3 / 8.15, 4 / 8.15, 5 / 8.15, 6 / 8.15, 7 / 8.15, 8 / 8.15],
  closed: false,
};

test('open-track consumeCheckpoints still finishes a straight throttle corridor', () => {
  const car = new ArcadeCar(CARS[0], 'complete-race unit');
  car.spawn(track, 0.02, 0);
  const input = { throttle: 1, brake: 0, steer: 0, nitro: false, drift: false };
  let steps = 0;
  for (; steps < 8000; steps++) {
    const prev = car.progress;
    car.step(1 / 120, input, track, true, [], [], []);
    const ev = car.consumeCheckpoints(track, prev);
    if (ev.lapComplete || car.progress >= 0.96) break;
  }
  assert.ok(car.progress >= 0.96 || car.lap >= 1, `progress=${car.progress} lap=${car.lap} steps=${steps}`);
  assert.ok([car.x, car.y, car.z].every(Number.isFinite));
});

test('aiInput stays finite on the public controller used for complete-race', () => {
  const car = new ArcadeCar(CARS[0], 'ai-finite');
  car.spawn(track, 0.02, 0);
  const inp = aiInput(car, track);
  assert.ok([inp.steer, inp.throttle, inp.brake].every(Number.isFinite));
  assert.equal(typeof inp.drift, 'boolean');
  assert.equal(typeof inp.nitro, 'boolean');
});
