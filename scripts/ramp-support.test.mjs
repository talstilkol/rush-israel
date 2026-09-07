import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';
import { fromRoot } from './project-root.mjs';

// Exercise the actual car and local physics modules; no substitute motion model.
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
const input = { throttle: 0, brake: 0, steer: 0, nitro: false, drift: false };
const dt = 1 / 120;
const road = (y = 2) => ({ samples: Array.from({ length: 401 }, (_, i) => ({
  x: 0, z: i - 200, y, t: i / 400, tx: 0, tz: 1, rx: 1, rz: 0, s: i,
})), length: 400, width: 30, checkpoints: [0, 0.5, 1], closed: false });
const deck = (y = 0.3, extra = {}) => ({ x: 0, z: 0, sx: 0, sz: 1, len: 40,
  half: 10, y0: y, y1: y, he: 'רמפה', en: 'Ramp', ...extra });
function carAt(track, y = track.samples[200].y, z = 0, x = 0) {
  const car = new ArcadeCar(CARS[0], 'support regression');
  car.spawn(track, (z + 200) / 400, 0); car.x = x; car.y = y; car.z = z; return car;
}
const close = (actual, expected, eps = 1e-9) => assert.ok(Math.abs(actual - expected) <= eps, `${actual} != ${expected}`);
const step = (car, track, ramps, controls = input) => car.step(dt, controls, track, true, [], [], ramps);

for (const y of [1.9051847681629823, 1.8861092979207807, 2, 10, -2]) {
  test(`main-road support at y=${y} does not fall through a lower ramp`, () => {
    const track = road(y), car = carAt(track);
    step(car, track, [deck(y - 1.6)]); close(car.y, y); assert.equal(car.sideStreetEn, '');
  });
}
test('rejecting an overhead candidate cannot expose a buried deck through the main road', () => {
  const track = road(1.9), car = carAt(track); step(car, track, [deck(3.3), deck(0.3)]); close(car.y, 1.9);
});
test('a nearby lower ramp also cannot displace a closer supporting road', () => {
  const track = road(2), car = carAt(track); step(car, track, [deck(1.4)]); close(car.y, 2);
});
test('lower-ramp input ordering does not change main-road support', () => {
  const track = road(2), ramps = [deck(0.3), deck(0.6), deck(9.4)];
  const a = carAt(track), b = carAt(track); step(a, track, ramps); step(b, track, [...ramps].reverse());
  close(a.y, 2); close(b.y, 2);
});
test('wheel-only overlap with a buried ramp cannot lower the main-road surface', () => {
  const track = road(2), car = carAt(track, 2, -20.5); step(car, track, [deck(0.3)]);
  close(car.y, 2); close(car.rideCompress, 0);
});
test('buried inclined ramps cannot supply grade or pitch through the supporting road', () => {
  const track = road(3), car = carAt(track), control = carAt(track); car.speed = control.speed = 10;
  step(car, track, [deck(0.2, { y1: 1.2 })]); step(control, track, []);
  close(car.y, control.y); close(car.speed, control.speed); close(car.pitch, control.pitch);
});
test('a car stays on the road across repeated lower and overhead intersections', () => {
  const track = road(2), car = carAt(track, 2, -25); car.speed = 12;
  for (let i = 0; i < 480; i++) { step(car, track, [deck(0.3), deck(9.4)], { ...input, throttle: 0.4 }); close(car.y, 2); }
  assert.ok(car.z > 20, 'motion must traverse the complete crossing');
});
test('a low reachable ramp above the road remains enterable', () => {
  const track = road(0), car = carAt(track); step(car, track, [deck(0.5)]); close(car.y, 0.5);
});
test('an already supported lower deck remains usable under a higher road', () => {
  const track = road(2), car = carAt(track, 0.3); step(car, track, [deck(0.3)]); close(car.y, 0.3);
});
test('an off-road ramp is not hidden by the height of a distant main road', () => {
  const track = road(10), car = carAt(track, 0.3, 0, 40); step(car, track, [deck(0.3, { x: 40 })]); close(car.y, 0.3);
});
test('a car above a lower ramp falls under gravity instead of teleporting down', () => {
  const track = road(0), car = carAt(track, 12); step(car, track, [deck(9.4)]);
  close(car.y, 12 - 18 * dt * dt); close(car.vy, -18 * dt);
});
test('a drop above the road has no first-frame altitude clamp', () => {
  const track = road(0), car = carAt(track, 2.2); step(car, track, []);
  close(car.y, 2.2 - 18 * dt * dt); close(car.vy, -18 * dt);
});
test('a falling car lands on the nearer road, not the buried deck', () => {
  const track = road(2), car = carAt(track, 5);
  for (let i = 0; i < 160; i++) { step(car, track, [deck(0.3)]); assert.ok(car.y >= 2); }
  close(car.y, 2); close(car.vy, 0); assert.equal(car.airborne, false);
});
test('a falling car can land on an elevated ramp without skipping the fall', () => {
  const track = road(0), car = carAt(track, 12); let fell = false;
  for (let i = 0; i < 160; i++) { step(car, track, [deck(9.4)]); if (car.y > 9.44 && car.airborne) fell = true; assert.ok(car.y >= 9.4); }
  assert.ok(fell); close(car.y, 9.4); close(car.vy, 0); assert.equal(car.airborne, false);
});
test('a rising car is not reattached to its ramp before its ascent ends', () => {
  const track = road(0), car = carAt(track, 0.5); car.vy = 3;
  step(car, track, [deck(0.5)]); close(car.vy, 3 - 18 * dt); close(car.y, 0.5 + (3 - 18 * dt) * dt);
});
test('a supported downhill ramp remains attached while moving', () => {
  const track = road(0), r = deck(10, { y1: 2, len: 40 }), car = carAt(track, 6); car.speed = 15;
  for (let i = 0; i < 60; i++) { step(car, track, [r]); close(car.y, r.y0 + (r.y1 - r.y0) * (car.z / r.len + 0.5)); assert.equal(car.airborne, false); }
});
test('a supported uphill ramp remains attached while moving', () => {
  const track = road(0), r = deck(2, { y1: 10, len: 40 }), car = carAt(track, 6); car.speed = 15;
  for (let i = 0; i < 60; i++) { step(car, track, [r]); close(car.y, r.y0 + (r.y1 - r.y0) * (car.z / r.len + 0.5)); assert.equal(car.airborne, false); }
});
test('leaving a supported upper deck does not teleport to a distant lower ramp', () => {
  const track = road(0), car = carAt(track, 10, 0.99); car.speed = 10;
  step(car, track, [deck(10, { len: 2 }), deck(5)]);
  assert.ok(car.z > 1); close(car.y, 10 - 18 * dt * dt);
});

test('wheel probes cannot mix a reachable edge of an unreachable overhead incline into road contact', () => {
  const track = road(1.9), car = carAt(track);
  step(car, track, [deck(0.3), deck(5.6, { y1: 0.8 })]);
  close(car.y, 1.9); close(car.rideCompress, 0);
});
test('wheel probes on a flat selected ramp do not mix in a different stacked incline', () => {
  const track = road(0), car = carAt(track, 2);
  step(car, track, [deck(2), deck(4.1, { y1: 0.1 })]);
  close(car.y, 2); close(car.rideCompress, 0);
});
