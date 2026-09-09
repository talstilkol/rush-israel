import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
import { fromRoot } from './project-root.mjs';
import { routeClearanceResults, retainRouteClearance } from './route-clearance-browser.mjs';

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
const { ArcadeCar } = await import(compile(fromRoot('src/game/vehicle.ts')));
const { CARS } = await import(compile(fromRoot('src/game/cars.ts')));
const { supportPierCollider, overheadSlabCollider, vehicleEnvelope } = await import(compile(fromRoot('src/game/collider-height.ts')));

function clearRow(extra = {}) {
  return { x: 0, y: 0.5, z: 0, fromX: 0, fromY: 0.5, fromZ: 0, moved: 0, dy: 0, lastHit: '', finite: true, ...extra };
}
function fixture() {
  const n = 781;
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: n,
    checkpointCount: 8, carIds: ['sabra', 'carmel', 'kfir', 'negev', 'yam'],
    pageErrors: [], glError: 0,
    grid: ['sabra', 'carmel', 'kfir', 'negev'].map((id, i) => ({ id, ...clearRow({ x: i * 5, fromX: i * 5 }) })),
    center: Array.from({ length: n }, (_, sample) => ({ sample, t: sample / (n - 1), roadY: 0.5, lateral: 0, pitch: 0, ...clearRow() })),
    lanes: Array.from({ length: 158 }, (_, i) => ({ sample: (i >> 1) * 10, t: 0, roadY: 0.5, lateral: i % 2 ? 2.2 : -2.2, pitch: 0, ...clearRow() })),
    underpass: [{ sample: 10, ramp: 0, t: 0.1, roadY: 0.5, deck: 9.4, pitch: 0, ...clearRow() }, { sample: 10, ramp: 0, t: 0.1, roadY: 0.5, deck: 9.4, pitch: 0.4, ...clearRow() }],
    drive: { steps: 120, buried: 0, airborne: 0, start: { x: 0, y: 0.5, z: 0 }, end: { x: 0, y: 0.5, z: 12 }, progressed: 12, finite: true },
  };
}

test('complete route-clearance evidence yields five narrowly scoped passes', () => {
  assert.deepEqual(routeClearanceResults(fixture()).map(r => r.status), Array(5).fill('passed'));
});
for (const [name, mutate] of [
  ['lost collider', r => { r.colliderCount = 721; }],
  ['lost pier', r => { r.pierCount = 175; }],
  ['lost sample', r => { r.center.pop(); }],
  ['lost lane', r => { r.lanes.pop(); }],
  ['empty underpass', r => { r.underpass.length = 0; }],
  ['page error', r => r.pageErrors.push('error')],
  ['gl error', r => { r.glError = 1; }],
  ['missing grid car', r => r.grid.pop()],
  ['nonfinite probe', r => { r.center[0].moved = NaN; }],
]) test(`route-clearance evidence fails closed: ${name}`, () => {
  const r = fixture();
  mutate(r);
  assert.throws(() => routeClearanceResults(r));
});
test('a measured centerline displacement cannot be relabelled as clearance', () => {
  const r = fixture();
  r.center[3].moved = 0.4;
  r.center[3].x = 0.4;
  assert.equal(routeClearanceResults(r)[1].status, 'failed');
});
test('a measured grid penetration remains failed', () => {
  const r = fixture();
  r.grid[0].moved = 1.77;
  r.grid[0].x += 1.77;
  assert.equal(routeClearanceResults(r)[0].status, 'failed');
});
test('a buried 1s drive cannot pass', () => {
  const r = fixture();
  r.drive.buried = 4;
  assert.equal(routeClearanceResults(r)[4].status, 'failed');
});
test('pitched underpass displacement remains failed', () => {
  const r = fixture();
  r.underpass[1].moved = 0.2;
  r.underpass[1].x = 0.2;
  assert.equal(routeClearanceResults(r)[3].status, 'failed');
});
test('invalid complete report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'route-invalid-'));
  try {
    const r = fixture();
    r.colliderCount = 711;
    await assert.rejects(retainRouteClearance(r, out));
    assert.equal(JSON.parse(await readFile(join(out, 'results.json'), 'utf8')).colliderCount, 711);
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});

const input = { throttle: 0, brake: 0, steer: 0, nitro: false, drift: false };
const track = {
  samples: Array.from({ length: 401 }, (_, i) => ({ x: 0, z: i - 200, y: 0, t: i / 400, tx: 0, tz: 1, rx: 1, rz: 0 })),
  length: 400, width: 28, checkpoints: [0, 0.5, 1], closed: false,
};
test('rest-pose centerline is not pushed by a pier beside the carriageway', () => {
  const pier = supportPierCollider(20, 0, 8.45);
  const car = new ArcadeCar(CARS[0], 'beside');
  car.spawn(track, 0.5, 0);
  car.x = 0; car.z = 0; car.y = 0;
  const before = { x: car.x, z: car.z, y: car.y };
  car.hitColliders([pier]);
  assert.equal(car.x, before.x);
  assert.equal(car.z, before.z);
  assert.equal(car.y, before.y);
});
test('old upright proxy still misses a pitched roof that the envelope treats as solid', () => {
  const slab = overheadSlabCollider(0, 0, 4, 1.7, 2.1);
  const car = new ArcadeCar(CARS[0], 'pitch-route');
  car.spawn(track, 0.5, 0);
  Object.assign(car, { x: 0, z: 0, y: 0, pitch: 0.4 });
  const upright = car.y + 1.6 <= 1.7;
  assert.equal(upright, true);
  car.hitColliders([slab]);
  assert.ok(Math.hypot(car.x, car.z) >= 4 - 1e-6);
  assert.ok(vehicleEnvelope(0.4, 0).yMax > 1.6);
});
test('a 9.4 underpass still clears rest and pitched envelopes on the public step', () => {
  const bridge = { x: 0, z: 0, sx: 1, sz: 0, len: 40, half: 10, y0: 9.4, y1: 9.4, he: 'גשר', en: 'Bridge' };
  for (const pitch of [0, 0.4]) {
    const car = new ArcadeCar(CARS[0], 'under-route');
    car.spawn(track, 185 / 400, 0);
    Object.assign(car, { x: 0, z: -8, y: 0, speed: 12, vz: 12, pitch });
    for (let i = 0; i < 160; i++) car.step(1 / 120, { ...input, throttle: 0.4 }, track, true, [], [], [bridge]);
    assert.equal(car.y, 0);
    assert.ok(car.z > 0);
  }
});
