import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';
import { fromRoot } from './project-root.mjs';

// Run the actual ArcadeCar; the flat-deck control cancels unchanged drag laws.
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
const dt = 1 / 120;
const input = { throttle: 0, brake: 0, steer: 0, nitro: false, drift: false };
const track = { samples: Array.from({ length: 401 }, (_, i) => ({
  x: 0, z: i - 200, y: -20, t: i / 400, tx: 0, tz: 1, rx: 1, rz: 0, s: i,
})), length: 400, width: 1000, checkpoints: [0, 0.5, 1], closed: false };
function run(yaw, speed, sx, sz, gradient, lateral = 0) {
  const car = new ArcadeCar(CARS[0], 'directional grade regression');
  car.spawn(track, 0.5, 0); car.y = 3; car.yaw = yaw; car.speed = speed;
  car.vx = -Math.sin(yaw) * speed + Math.cos(yaw) * lateral;
  car.vz = -Math.cos(yaw) * speed - Math.sin(yaw) * lateral;
  car.assists = { abs: false, tcs: false, esc: false };
  car.step(dt, input, track, true, [], [], [{ x: 0, z: 0, sx, sz,
    len: 100, half: 100, y0: 3 - gradient * 50, y1: 3 + gradient * 50,
    he: 'רמפה', en: 'Ramp' }]);
  return car;
}
const close = (actual, expected) => assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
const cases = [
  ['perpendicular +Z from rest', Math.PI, 0, 1, 0],
  ['perpendicular -Z from rest', 0, 0, 1, 0],
  ['perpendicular +X while forward', -Math.PI / 2, 10, 0, 1],
  ['perpendicular -X while reversing', Math.PI / 2, -10, 0, 1],
  ['aligned uphill from rest', -Math.PI / 2, 0, 1, 0],
  ['aligned uphill forward', -Math.PI / 2, 10, 1, 0],
  ['aligned uphill reversing', -Math.PI / 2, -10, 1, 0],
  ['aligned downhill from rest', Math.PI / 2, 0, 1, 0],
  ['aligned downhill forward', Math.PI / 2, 10, 1, 0],
  ['aligned downhill reversing', Math.PI / 2, -10, 1, 0],
  ['diagonal uphill', -Math.PI / 4, 10, 1, 0],
  ['diagonal downhill', Math.PI / 4, 10, 1, 0],
  ['diagonal uphill reversing', -Math.PI / 4, -10, 1, 0],
  ['diagonal ramp axis', 0, 10, Math.SQRT1_2, Math.SQRT1_2],
];
for (const [name, yaw, speed, sx, sz] of cases) {
  test(`actual car projects ramp force and pitch along body-forward: ${name}`, () => {
    const flat = run(yaw, speed, sx, sz, 0), slope = run(yaw, speed, sx, sz, 0.1);
    const g = 0.1 * (-Math.sin(yaw) * sx - Math.cos(yaw) * sz);
    const delta = -g * 16.2 * dt - (g > 0.04 ? g * 7.4 * dt : 0);
    close(slope.speed - flat.speed, delta);
    close(slope.pitch - flat.pitch, -g * 3.4 * (1 - Math.exp(-9 * dt)));
  });
}
test('reversing the axis and both height endpoints leaves the same ramp physics', () => {
  const a = run(-Math.PI / 3, 10, 1, 0, 0.1), b = run(-Math.PI / 3, 10, -1, 0, -0.1);
  close(a.speed, b.speed); close(a.pitch, b.pitch); close(a.y, b.y);
});
test('lateral velocity does not turn a crosswise incline into longitudinal gravity', () => {
  const flat = run(0, 10, 1, 0, 0, 0.1), slope = run(0, 10, 1, 0, 0.1, 0.1);
  close(slope.speed, flat.speed); close(slope.pitch, flat.pitch);
});
