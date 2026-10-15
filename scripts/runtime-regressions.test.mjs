import './runtime-typescript-loader.mjs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
const { ArcadeCar, separateCars } = await import('../src/game/vehicle.ts');
const { TRACKS, getTrack } = await import('../src/game/tracks.ts');
const { buildTrack } = await import('../src/game/spline.ts');
const { CARS } = await import('../src/game/cars.ts');
const { roadLaneCount } = await import('../src/game/road-layout.ts');
const { PHYSICS_DT } = await import('../src/game/physics.ts');
const ayalon = buildTrack(getTrack('ayalon'));
const input = { steer: 0, throttle: 1, brake: 0, drift: false, nitro: true };
const makeCar = () => {
  const car = new ArcadeCar(CARS[0], CARS[0].nameEn);
  car.spawn(ayalon, 0.03, -2.2);
  return car;
};

test('restoring a real car snapshot reproduces its subsequent physics exactly', () => {
  const car = makeCar();
  for (let i = 0; i < 600; i++) car.step(PHYSICS_DT, input, ayalon, true);
  const saved = car.snap();
  for (let i = 0; i < 180; i++) car.step(PHYSICS_DT, input, ayalon, true);
  const expected = car.snap();
  // Loading onto a fresh car catches transient state omitted by position-only snapshots.
  const restored = makeCar();
  restored.load(saved);
  for (let i = 0; i < 180; i++) restored.step(PHYSICS_DT, input, ayalon, true);
  assert.deepEqual(restored.snap(), expected);
});

test('spawning again clears driving state and preserves the real accumulated player damage', () => {
  const car = makeCar();
  const track = buildTrack(getTrack('oldjaffa'));
  for (let i = 0; i < 900; i++) car.step(PHYSICS_DT, { ...input, steer: 1, nitro: false, drift: true }, track, true);
  const damage = car.damage;
  car.spawn(ayalon, 0.03, -2.2);
  assert.equal(car.damage, damage);
  const fresh = makeCar().snap();
  const actual = car.snap();
  actual.damage = fresh.damage;
  assert.deepEqual(actual, fresh);
});

test('cars on separated elevations cannot push each other sideways', () => {
  const lower = makeCar();
  const upper = makeCar();
  upper.y += 40;
  const before = lower.snap();
  separateCars([lower, upper]);
  assert.deepEqual(lower.snap(), before);
});

for (const def of TRACKS) {
  test(`actual track geometry stays finite: ${def.id}`, () => {
    const built = buildTrack(def);
    assert.ok(built.length > 0);
    for (const sample of built.samples) {
      for (const value of Object.values(sample)) assert.ok(Number.isFinite(value), `${def.id}: non-finite sample`);
    }
  });
}

test('Jaffa elevation has no vertical 3m discontinuity at the raised section', () => {
  const def = getTrack('oldjaffa');
  for (const t of [0.09, 0.15, 0.42, 0.48]) {
    assert.ok(Math.abs(def.elevation(t + 0.00001) - def.elevation(t - 0.00001)) < 0.01);
  }
});

test('road loading and world building share the real track lane policy', () => {
  assert.equal(roadLaneCount(getTrack('ayalon')), 8);
  assert.equal(roadLaneCount(getTrack('namal')), 4);
  for (const def of TRACKS) assert.ok([3, 4, 8].includes(roadLaneCount(def)));
});

const { rulesetKey } = await import('../src/game/race-rules.ts');
const { emptyTune } = await import('../src/game/garage.ts');
const { hashTimedRecord, canonicalTimedRecordsString, decodeTimedRecords, recordHashMatches } = await import('../src/game/records.ts');
const { PHYSICS_VERSION } = await import('../src/game/physics.ts');
const rules = { mode: 'circuit', weather: 'clear', carId: CARS[0].id, handling: 'simcade', assists: 'abs+tcs+esc', laps: 3, tune: emptyTune() };

test('performance upgrades and race conditions occupy separate record classes', () => {
  const base = rulesetKey('ayalon', rules);
  for (const field of ['engine', 'tires', 'nitro']) {
    assert.notEqual(rulesetKey('ayalon', { ...rules, tune: { ...rules.tune, [field]: 1 } }), base);
  }
  assert.notEqual(rulesetKey('ayalon', { ...rules, night: true }), base);
  assert.notEqual(rulesetKey('ayalon', { ...rules, weather: 'rain' }), base);
  assert.notEqual(rulesetKey('oldjaffa', rules), base);
  assert.equal(rulesetKey('ayalon', { ...rules, tune: { ...rules.tune, paint: 1, livery: 1 } }), base);
});

test('a recorded ruleset survives serialization and cannot be changed without breaking its hash', () => {
  const item = { trackId: 'ayalon', carId: CARS[0].id, t: 1200 * PHYSICS_DT, physicsVersion: PHYSICS_VERSION, ruleset: rulesetKey('ayalon', rules) };
  item.hash = hashTimedRecord(item);
  const decoded = decodeTimedRecords(canonicalTimedRecordsString([item]));
  assert.deepEqual(decoded, [item]);
  assert.equal(recordHashMatches(item), true);
  assert.equal(recordHashMatches({ ...item, ruleset: rulesetKey('ayalon', { ...rules, night: true }) }), false);
});

test('readiness flags do not claim complete accessibility or offline support', async () => {
  const a11y = await import('../src/game/a11y/gates.ts');
  const pwa = await import('../src/game/pwa/offline.ts');
  assert.equal(a11y.A11Y_COMPLETE, false);
  assert.equal(pwa.PWA_COMPLETE, false);
});

const { closestSample, sampleAtT, behindProgress } = await import('../src/game/spline.ts');
test('static nearest-road queries find the true geometric nearest sample throughout real tracks', () => {
  for (const def of TRACKS) {
    const { samples } = buildTrack(def);
    for (let i = 0; i < samples.length; i += 31) {
      assert.equal(closestSample(samples, samples[i].x, samples[i].z).dist, 0);
    }
  }
});

test('open-track endpoint sampling cannot wrap a car back to the start', () => {
  for (const def of TRACKS.filter(track => track.open)) {
    const track = buildTrack(def);
    assert.equal(sampleAtT(track.samples, 1), track.samples.at(-1));
    assert.equal(sampleAtT(track.samples, -0.01), track.samples[0]);
    const car = new ArcadeCar(CARS[0], CARS[0].nameEn);
    car.spawn(track, 1, 0);
    assert.equal(car.sampleIndex, track.samples.length - 1);
  }
  assert.ok(behindProgress(0.01, 0.03, false) > 0.9);
  assert.equal(behindProgress(0.01, 0.03, true), 0.002);
});

const { decodeGhostRuns, ghostStorageKey, validGhostRun } = await import('../src/game/ghost-records.ts');
test('real simulated ghost trajectories stay in their own ruleset and corrupt storage is rejected', () => {
  const car = makeCar();
  const frames = [];
  for (let i = 1; i <= 1200; i++) {
    car.step(PHYSICS_DT, input, ayalon, true);
    if (i % 20 === 0) frames.push({ x: car.x, y: car.y, z: car.z, yaw: car.yaw, t: i * PHYSICS_DT });
  }
  const run = { time: 1200 * PHYSICS_DT, frames };
  const clearKey = ghostStorageKey('ayalon', rulesetKey('ayalon', rules));
  const rainKey = ghostStorageKey('ayalon', rulesetKey('ayalon', { ...rules, weather: 'rain' }));
  assert.notEqual(clearKey, rainKey);
  assert.equal(validGhostRun(run, true), true);
  const decoded = decodeGhostRuns(JSON.stringify({ [clearKey]: run }));
  assert.deepEqual(decoded[clearKey], run);
  assert.equal(decoded[rainKey], undefined);
  assert.deepEqual(decodeGhostRuns('null'), {});
  assert.deepEqual(decodeGhostRuns('{"ayalon":false}'), {});
  assert.equal(validGhostRun({ ...run, frames: frames.slice(20) }, true), false);
});
