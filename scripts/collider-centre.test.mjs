import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';
import { fromRoot } from './project-root.mjs';

// Import the actual vehicle and local dependencies, never a substitute solver.
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
  memo.set(file, uri); return uri;
}
const { ArcadeCar } = await import(compile(fromRoot('src/game/vehicle.ts')));
const { CARS } = await import(compile(fromRoot('src/game/cars.ts')));
const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} != ${b}`);
const obstacle = (extra = {}) => ({ x: 0, z: 0, r: 2, kind: 'barrier', ...extra });
function carAt(x = 0, z = 0, vx = 0, vz = 0) {
  const car = new ArcadeCar(CARS[0], 'circular contact regression');
  Object.assign(car, { x, y: 3, z, vx, vz, vy: -0.5, yaw: 0, speed: -vz });
  return car;
}
function hit(car, c = obstacle()) {
  // TypeScript private is used only for an isolated contact-phase test.
  // Complementary tests below exercise the public fixed-step path.
  car.hitColliders([c]);
  assert.ok([car.x, car.y, car.z, car.vx, car.vz, car.speed, car.damage].every(Number.isFinite));
  return car;
}
for (const [x, z] of [[0, 0], [1e-8, 0], [-1e-8, 0], [0, 1e-8], [0, -1e-8], [3e-5, 4e-5]]) {
  test(`circular penetration at (${x},${z}) is resolved instead of skipped`, () => {
    const car = hit(carAt(x, z));
    close(Math.hypot(car.x, car.z), 2);
    close(car.y, 3); close(car.vy, -0.5);
    if (x !== 0 || z !== 0) { close(car.x, x / Math.hypot(x, z) * 2); close(car.z, z / Math.hypot(x, z) * 2); }
  });
}
for (const [vx, vz] of [[10, 0], [-10, 0], [0, 10], [0, -10], [3, 4]]) {
  test(`coincident moving contact opposes incident velocity (${vx},${vz})`, () => {
    const car = hit(carAt(0, 0, vx, vz));
    const speed = Math.hypot(vx, vz), nx = -vx / speed, nz = -vz / speed;
    close(car.x, nx * 2); close(car.z, nz * 2);
    assert.ok(car.vx * nx + car.vz * nz >= -1e-9, 'velocity must not continue into obstacle');
    assert.equal(car.lastHit, 'barrier');
  });
}
test('stationary coincident contact has a deterministic fallback and is idempotent', () => {
  const car = hit(carAt()); close(car.x, 2); close(car.z, 0);
  const snapshot = car.snap(); hit(car); assert.deepEqual(car.snap(), snapshot);
  assert.equal(car.damage, 0);
});
test('translated coincident contact uses the collider centre, not the world origin', () => {
  const car = hit(carAt(30, -40), obstacle({ x: 30, z: -40 })); close(car.x, 32); close(car.z, -40);
});
test('a tiny nonzero displacement retains its radial normal even with tangential velocity', () => {
  const car = hit(carAt(1e-8, 0, 0, 10)); close(car.x, 2); close(car.z, 0); close(car.vz, 10);
});
for (const radius of [0.62, 1.05, 3.5]) test(`existing radial clearance ${radius} is not expanded again`, () => {
  const car = hit(carAt(), obstacle({ r: radius })); close(Math.hypot(car.x, car.z), radius);
});
test('ordinary radial penetration and outward velocity retain the old response', () => {
  const car = hit(carAt(1, 0, 10, 0)); close(car.x, 2); close(car.vx, 10); assert.equal(car.lastHit, '');
});
test('tangent and separated circles leave the car untouched', () => {
  for (const x of [2, 3]) { const car = carAt(x); const before = car.snap(); hit(car); assert.deepEqual(car.snap(), before); }
});
test('rotated-box collision behavior is unchanged at the centre', () => {
  const car = hit(carAt(), obstacle({ hx: 1, hz: 3, yaw: Math.PI / 2 })); close(car.x, 0); close(car.z, -2.05);
});
test('a tiny embedded circular building retains its existing damage response', () => {
  const car = hit(carAt(1e-8, 0, -10, 0), obstacle({ kind: 'building' }));
  close(car.x, 2); assert.equal(car.lastHit, 'building'); assert.ok(car.damage > 0);
});
test('the public fixed-step path resolves a stationary centre overlap', () => {
  const track = { samples: Array.from({ length: 41 }, (_, i) => ({ x: 0, z: i - 20, y: 0, t: i / 40, tx: 0, tz: 1, rx: 1, rz: 0, s: i })),
    length: 40, width: 30, checkpoints: [0, 0.5, 1], closed: false };
  const car = new ArcadeCar(CARS[0], 'fixed-step collision'); car.spawn(track, 0.5, 0);
  car.step(1 / 120, { throttle: 0, brake: 0, steer: 0, nitro: false, drift: false }, track, true, [obstacle()]);
  close(Math.hypot(car.x, car.z), 2); assert.ok([car.y, car.speed, car.vy].every(Number.isFinite));
});
