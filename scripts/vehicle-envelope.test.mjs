import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';
import { fromRoot } from './project-root.mjs';

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
const {
  vehicleEnvelope, overlapsColliderHeight, colliderContactKind, circleExitDistance,
  supportPierCollider, overheadSlabCollider, preserveColliderAtSpawn, CAR_CONTACT_HEIGHT,
  UPRIGHT_ENVELOPE,
} = await import(compile(fromRoot('src/game/collider-height.ts')));

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} != ${b}`);
const slab = (min, max = min + 0.4, r = 4) => overheadSlabCollider(0, 0, r, min, max);
const oldUpright = (span, carY) => carY < span.max && carY + 1.6 > span.min;
function carAt(y = 0, extra = {}) {
  const car = new ArcadeCar(CARS[0], 'envelope regression');
  Object.assign(car, { x: 0, z: 0, y, vx: 0, vz: 0, vy: 0, speed: 0, pitch: 0, roll: 0, ...extra });
  return car;
}

test('rest-pose envelope is the historical 1.6 upright proxy', () => {
  assert.deepEqual(vehicleEnvelope(0, 0), { yMin: 0, yMax: CAR_CONTACT_HEIGHT });
  assert.deepEqual(UPRIGHT_ENVELOPE, { yMin: 0, yMax: 1.6 });
});
test('pitch raises the roof and can drop a nose below the origin', () => {
  const env = vehicleEnvelope(0.4, 0);
  assert.ok(env.yMax > 1.6 + 0.15, env.yMax);
  assert.ok(env.yMin < -0.15, env.yMin);
});
test('roll also expands the vertical span', () => {
  const env = vehicleEnvelope(0, 0.34);
  assert.ok(env.yMax > 1.6 + 0.1, env.yMax);
  assert.ok(env.yMin < -0.1, env.yMin);
});
test('non-finite tilt fails closed with a larger envelope, not an upright miss', () => {
  const env = vehicleEnvelope(NaN, 0);
  assert.ok(env.yMax > 1.6);
  const span = { min: 1.85, max: 2.2 };
  assert.equal(oldUpright(span, 0), false);
  assert.equal(overlapsColliderHeight({ vertical: span }, 0, env), true);
});

const LOW = { min: 1.7, max: 2.1 };
test('old upright proxy misses a pitched roof against a 1.7-unit slab', () => {
  assert.equal(oldUpright(LOW, 0), false);
  assert.equal(overlapsColliderHeight({ vertical: LOW }, 0), false);
  assert.equal(overlapsColliderHeight({ vertical: LOW }, 0, vehicleEnvelope(0.4, 0)), true);
  assert.equal(colliderContactKind({ vertical: LOW, role: 'overhead-slab' }, 0, vehicleEnvelope(0.4, 0)), 'ceiling');
});
test('a 9.4-unit overhead deck still clears an upright and a pitched car at ground', () => {
  const high = { min: 9.4, max: 9.8 };
  for (const env of [UPRIGHT_ENVELOPE, vehicleEnvelope(0.4, 0), vehicleEnvelope(0.4, 0.34)]) {
    assert.equal(overlapsColliderHeight({ vertical: high }, 0, env), false);
    assert.equal(colliderContactKind({ vertical: high, role: 'overhead-slab' }, 0, env), 'none');
  }
});
test('malformed envelope or bounds still fail closed', () => {
  for (const vertical of [{ min: 0, max: NaN }, { min: 5, max: 1 }]) {
    assert.equal(overlapsColliderHeight({ vertical }, 3, UPRIGHT_ENVELOPE), true);
  }
  assert.equal(overlapsColliderHeight({ vertical: LOW }, 0, { yMin: NaN, yMax: 1 }), true);
});

test('circle exit along the perpendicular leaves a midpoint outside both overlapping piers', () => {
  const t = circleExitDistance(1, 0, 0, 1, 0, 0, 1.77);
  close(t, Math.sqrt(1.77 ** 2 - 1), 1e-9);
  assert.ok(Math.hypot(1 - 0, t - 0) >= 1.77 - 1e-9);
  assert.ok(Math.hypot(1 - 2, t - 0) >= 1.77 - 1e-9);
});

function oldSequential(x, z, colliders) {
  for (const c of colliders) {
    const d = Math.hypot(x - c.x, z - c.z);
    if (d >= c.r) continue;
    const nx = d > 0 ? (x - c.x) / d : 1;
    const nz = d > 0 ? (z - c.z) / d : 0;
    x = c.x + nx * c.r;
    z = c.z + nz * c.r;
  }
  return { x, z };
}

test('old single-pass solver leaves residual overlap between two intersecting circles', () => {
  const pair = [{ x: 0, z: 0, r: 1.77, kind: 'barrier' }, { x: 2, z: 0, r: 1.77, kind: 'barrier' }];
  const old = oldSequential(1, 0, pair);
  assert.ok(pair.some((c) => Math.hypot(old.x - c.x, old.z - c.z) < c.r - 1e-6), 'historical residual required');
  const car = carAt(0, { x: 1, z: 0 });
  car.hitColliders(pair);
  assert.ok(pair.every((c) => Math.hypot(car.x - c.x, car.z - c.z) >= c.r - 1e-6), `${car.x},${car.z}`);
  assert.ok(Number.isFinite(car.x) && Number.isFinite(car.z));
});

test('a single coincident circle still uses the historical +X escape', () => {
  const car = carAt(0);
  car.hitColliders([{ x: 0, z: 0, r: 1.77, kind: 'barrier' }]);
  close(car.x, 1.77); close(car.z, 0);
});
test('height filter still blocks a pier at ground and frees travel above the slab', () => {
  const pier = supportPierCollider(0, 0, 8.45);
  const blocked = carAt(0);
  blocked.hitColliders([pier]);
  close(Math.hypot(blocked.x, blocked.z), 1.77);
  const free = carAt(9.4);
  free.hitColliders([pier]);
  close(free.x, 0); close(free.z, 0); close(free.y, 9.4);
});
test('spawn clearing still preserves only structural piers', () => {
  assert.equal(preserveColliderAtSpawn(supportPierCollider(1, 2, 3)), true);
  assert.equal(preserveColliderAtSpawn(slab(8, 8.4)), false);
  assert.equal(preserveColliderAtSpawn({ x: 0, z: 0, r: 2, kind: 'barrier' }), false);
});
test('invalid slab geometry cannot silently create a pass-through', () => {
  for (const args of [[NaN, 0, 1, 1, 2], [0, 0, 0, 1, 2], [0, 0, 1, 5, 1]]) {
    assert.throws(() => overheadSlabCollider(...args), /slab/);
  }
});

test('a jumping car is stopped by an overhead slab without a horizontal teleport', () => {
  const car = carAt(8, { vy: 4, x: 0.2, z: -0.3 });
  car.hitColliders([slab(9.4, 9.8)]);
  assert.ok(car.y + vehicleEnvelope(0, 0).yMax <= 9.4 + 1e-9, car.y);
  assert.ok(car.vy <= 0);
  close(car.x, 0.2); close(car.z, -0.3);
});
test('a pitched car cannot squeeze under a 1.7-unit opening by being buried', () => {
  const car = carAt(0, { pitch: 0.4, x: 0, z: 0 });
  car.hitColliders([slab(1.7, 2.1)]);
  assert.ok(car.y >= -1e-6, car.y);
  assert.ok(Math.hypot(car.x, car.z) >= 4 - 1e-6, `${car.x},${car.z}`);
});
test('all five cars share the same arcade envelope proxy', () => {
  const env = vehicleEnvelope(0.4, 0.2);
  for (const def of CARS) {
    const car = new ArcadeCar(def, def.id);
    Object.assign(car, { x: 0, z: 0, y: 0, pitch: 0.4, roll: 0.2 });
    car.hitColliders([slab(1.7, 2.1)]);
    assert.ok(Math.hypot(car.x, car.z) >= 4 - 1e-6, def.id);
    assert.deepEqual(vehicleEnvelope(car.pitch, car.roll).yMax > 1.6, true);
    close(env.yMax, vehicleEnvelope(0.4, 0.2).yMax);
  }
});

const input = { throttle: 0, brake: 0, steer: 0, nitro: false, drift: false };
const track = {
  samples: Array.from({ length: 401 }, (_, i) => ({ x: 0, z: i - 200, y: 0, t: i / 400, tx: 0, tz: 1, rx: 1, rz: 0 })),
  length: 400, width: 30, checkpoints: [0, 0.5, 1], closed: false,
};
const bridge = { x: 0, z: 0, sx: 1, sz: 0, len: 40, half: 10, y0: 9.4, y1: 9.4, he: 'גשר', en: 'Bridge' };

test('public step still drives under a 9.4 bridge without a vertical teleport', () => {
  const car = new ArcadeCar(CARS[0], 'underpass');
  car.spawn(track, 185 / 400, 0);
  car.x = 0; car.z = -15; car.y = 0; car.speed = 15; car.vz = 15;
  for (let i = 0; i < 240; i++) {
    car.step(1 / 120, { ...input, throttle: 0.5 }, track, true, [], [], [bridge]);
    close(car.y, 0, 1e-6);
  }
  assert.ok(car.z > 10);
});
test('public step still remains on top of the same bridge', () => {
  const car = new ArcadeCar(CARS[0], 'deck');
  car.spawn(track, 200 / 400, 0);
  car.x = 0; car.z = 0; car.y = 9.4;
  for (let i = 0; i < 120; i++) car.step(1 / 120, input, track, true, [], [], [bridge]);
  close(car.y, 9.4, 1e-6);
});
test('an airborne step cannot pass through the bridge deck', () => {
  const car = new ArcadeCar(CARS[0], 'jump-deck');
  car.spawn(track, 200 / 400, 0);
  Object.assign(car, { x: 0, z: 0, y: 8.2, vy: 6, airborne: true, airMs: 40 });
  car.step(1 / 120, input, track, true, [], [], [bridge]);
  assert.ok(car.y + vehicleEnvelope(car.pitch, car.roll).yMax <= 9.4 + 0.05, car.y);
  assert.ok(car.vy <= 0);
});
