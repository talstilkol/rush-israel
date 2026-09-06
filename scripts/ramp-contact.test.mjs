import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';
import { fromRoot } from './project-root.mjs';

// Run the real vehicle and its local dependencies, with no physics stubs.
// Only expose the private query for direct boundary checks in this fixture.
const memo = new Map();
function compile(file) {
  if (memo.has(file)) return memo.get(file);
  const source = readFileSync(file, 'utf8') + (file.endsWith('/vehicle.ts') ? '\nexport { probeRamp };\n' : '');
  let js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  js = js.replace(/from\s*(["'])([^"']+)\1/g, (_, quote, spec) => {
    assert.ok(spec.startsWith('.'), `Unexpected vehicle runtime dependency: ${spec}`);
    return `from ${JSON.stringify(compile(resolve(dirname(file), spec + (spec.endsWith('.ts') ? '' : '.ts'))))}`;
  });
  const uri = `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;
  memo.set(file, uri); return uri;
}
const { ArcadeCar, probeRamp } = await import(compile(fromRoot('src/game/vehicle.ts')));
const { CARS } = await import(compile(fromRoot('src/game/cars.ts')));
const input = { throttle: 0, brake: 0, steer: 0, nitro: false, drift: false };
const track = { samples: Array.from({ length: 401 }, (_, i) => ({ x: 0, z: i - 200, y: 0,
  t: i / 400, tx: 0, tz: 1, rx: 1, rz: 0, curvature: 0 })), length: 400, width: 30, checkpoints: [0, 0.5, 1], closed: false };
const ramp = (y = 9.4, extra = {}) => ({ x: 0, z: 0, sx: 1, sz: 0, len: 40, half: 10,
  y0: y, y1: y, he: 'גשר', en: 'Bridge', ...extra });
function carAt(y = 0, z = 0) {
  const car = new ArcadeCar(CARS[0], 'contact regression'); car.spawn(track, (z + 200) / 400, 0);
  car.x = 0; car.z = z; car.y = y; return car;
}
const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} != ${b}`);

test('a bridge 9.4 units overhead is not a support surface', () => assert.equal(probeRamp(0, 0, [ramp()], 0), null));
test('reachable 1.2-unit rise retains existing snap allowance', () => close(probeRamp(0, 0, [ramp(1.2)], 0).y, 1.2));
test('a surface just outside the rise allowance is rejected', () => assert.equal(probeRamp(0, 0, [ramp(1.200001)], 0), null));
test('capture allowance is relative to vehicle height, not sea level', () => assert.equal(probeRamp(0, 0, [ramp(12)], 9.4), null));
test('a vehicle already on an elevated bridge retains it', () => close(probeRamp(0, 0, [ramp()], 9.4).y, 9.4));
test('overhead-first input does not shadow a reachable low ramp', () => close(probeRamp(0, 0, [ramp(), ramp(0.3)], 0).y, 0.3));
test('overhead-only overlaps return no support regardless of order', () => {
  const ramps = [ramp(5), ramp(8), ramp(12)];
  assert.equal(probeRamp(0, 0, ramps, 0), null); assert.equal(probeRamp(0, 0, ramps.reverse(), 0), null);
});
test('nearest reachable stacked surface remains preferred', () => close(probeRamp(0, 0, [ramp(8), ramp(9.4)], 9.3).y, 9.4));
test('existing higher-surface tie break is retained', () => close(probeRamp(0, 0, [ramp(0.48), ramp(0.52)], 0.5).y, 0.52));
test('downward support selection is unchanged by the overhead fix', () => close(probeRamp(0, 0, [ramp()], 12).y, 9.4));
test('sloping height at a reachable endpoint remains correct', () => close(probeRamp(-20, 0, [ramp(0.4, { y1: 8.6 })], 0.4).y, 0.4));
test('same incline is not captured through its elevated middle', () => assert.equal(probeRamp(0, 0, [ramp(0.4, { y1: 8.6 })], 0), null));
test('reversed incline direction preserves physical height', () => close(probeRamp(20, 0, [ramp(8.6, { y1: 0.4 })], 0.4).y, 0.4));
test('rotated footprint rejects an overhead bridge', () => assert.equal(probeRamp(0, 0, [ramp(9.4, { sx: 0, sz: 1 })], 0), null));
test('horizontal footprint boundaries are still inclusive', () => close(probeRamp(20, 10, [ramp(0.5)], 0).y, 0.5));
test('outside-footprint surfaces cannot supply support', () => assert.equal(probeRamp(20.01, 0, [ramp(0.5)], 0), null));
test('empty ramp list remains unsupported', () => assert.equal(probeRamp(0, 0, [], 0), null));

test('real stationary car remains below an overhead bridge after one physics step', () => {
  const car = carAt(); car.step(1 / 120, input, track, true, [], [], [ramp()]); close(car.y, 0); assert.equal(car.sideStreetEn, '');
});
test('real wheel-corner probes cannot lift a car before its centre enters a bridge footprint', () => {
  const car = carAt(0, -10.5); car.step(1 / 120, input, track, true, [], [], [ramp()]); close(car.y, 0);
});
test('real car drives completely under the bridge without a vertical teleport', () => {
  const car = carAt(0, -15); car.speed = 15;
  for (let i = 0; i < 240; i++) { car.step(1 / 120, { ...input, throttle: 0.5 }, track, true, [], [], [ramp()]); close(car.y, 0); }
  assert.ok(car.z > 10, 'trajectory must exit the bridge footprint'); assert.equal(car.airborne, false);
});
test('real car can remain on top of the same bridge', () => {
  const car = carAt(9.4); for (let i = 0; i < 120; i++) car.step(1 / 120, input, track, true, [], [], [ramp()]);
  close(car.y, 9.4); assert.equal(car.airborne, false); assert.equal(car.sideStreetEn, 'Bridge');
});
test('real car still enters a low reachable ramp', () => {
  const car = carAt(); car.step(1 / 120, input, track, true, [], [], [ramp(0.5)]); close(car.y, 0.5);
});
test('real car does not receive an overhead incline grade or pitch', () => {
  const car = carAt(), control = carAt(); car.speed = control.speed = 10;
  car.step(1 / 120, input, track, true, [], [], [ramp(5, { y1: 12 })]); control.step(1 / 120, input, track, true);
  close(car.speed, control.speed); close(car.pitch, control.pitch); close(car.y, control.y);
});
