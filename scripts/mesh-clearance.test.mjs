import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
import { fromRoot } from './project-root.mjs';
import {
  MESH_DRIVE_STEPS, meshClearanceResults, oneSecondDriveIsNotMeshClearance, retainMeshClearance,
} from './mesh-clearance-browser.mjs';

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
const {
  visualHull, arcadeProxyIsNotMesh, visualEnvelope, visualOverlapsCollider,
  arcadeCircleMissesFrontPole, ARCADE_BOX, obstacleFootprint,
} = await import(compile(fromRoot('src/game/car-hull.ts')));
const { CARS } = await import(compile(fromRoot('src/game/cars.ts')));
const { CAR_CONTACT_RADIUS, CAR_HALF_LENGTH, CAR_CONTACT_HEIGHT, PIER_MESH_RADIUS } = await import(compile(fromRoot('src/game/collider-height.ts')));

function hullRow(id, extra = {}) {
  const hull = visualHull(CARS.find(c => c.id === id).body);
  return { ...hull, arcadeIsNotMesh: arcadeProxyIsNotMesh(hull), body: CARS.find(c => c.id === id).body, ...extra };
}
function pose(extra = {}) {
  return { id: 'sabra', x: 0, y: 0, z: 0, yaw: 0, hits: 0, finite: true, ...extra };
}
function driveRow(extra = {}) {
  return {
    steps: 2400, maxSteps: MESH_DRIVE_STEPS, hullSamples: 160, hits: 0, buried: 0, respawns: 0, finite: true, ...extra,
  };
}
function fixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, carIds: ['sabra', 'carmel', 'kfir', 'negev', 'yam'],
    pageErrors: [], glError: 0,
    hulls: Object.fromEntries(CARS.map(c => [c.id, hullRow(c.id)])),
    grid: CARS.map(c => pose({ id: c.id })),
    center: Array.from({ length: 781 }, (_, i) => pose({ sample: i })),
    lanes: Array.from({ length: 158 }, () => pose()),
    drive: driveRow(),
    ...extra,
  };
}

test('1s centerline drive is not mesh-clearance qualification', () => {
  assert.equal(oneSecondDriveIsNotMeshClearance({ steps: 120, progressed: 1.62 }), true);
  assert.equal(oneSecondDriveIsNotMeshClearance({ steps: 2400, hullSamples: 160 }), false);
});

test('live 722-collider visual-hull evidence yields six passes', () => {
  assert.deepEqual(meshClearanceResults(fixture()).map(r => r.status), Array(6).fill('passed'));
});

for (const [name, mutate] of [
  ['lost collider', r => { r.colliderCount = 721; }],
  ['lost pier', r => { r.pierCount = 175; }],
  ['lost ramp', r => { r.rampCount = 49; }],
  ['lost checkpoint', r => { r.checkpointCount = 7; }],
  ['page error', r => r.pageErrors.push('error')],
  ['gl error', r => { r.glError = 1; }],
  ['missing hulls', r => { delete r.hulls; }],
]) test(`mesh-clearance evidence fails closed: ${name}`, () => {
  const r = fixture();
  mutate(r);
  assert.throws(() => meshClearanceResults(r));
});

test('the old 120-step drive cannot be relabelled mesh clearance', () => {
  const r = fixture({ drive: driveRow({ steps: 120, hullSamples: 0 }) });
  assert.throws(() => meshClearanceResults(r), /1s sampled drive is not mesh clearance/);
});

test('a visual-hull rest-pose hit remains failed', () => {
  const r = fixture();
  r.center[10] = pose({ hits: 2 });
  assert.equal(meshClearanceResults(r).filter(row => row.status === 'failed').length > 0, true);
});

test('a yawed visual-hull drive hit remains failed', () => {
  const r = fixture({ drive: driveRow({ hits: 3 }) });
  assert.equal(meshClearanceResults(r).find(row => row.case.includes('yawed')).status, 'failed');
});

test('invalid mesh-clearance report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'mesh-clearance-invalid-'));
  try {
    const r = fixture();
    r.colliderCount = 711;
    await assert.rejects(retainMeshClearance(r, out));
    assert.equal(JSON.parse(await readFile(join(out, 'results.json'), 'utf8')).colliderCount, 711);
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});

test('arcade circle still misses a 0.4-radius pole 1.6 m ahead', () => {
  assert.equal(arcadeCircleMissesFrontPole(), true);
  assert.equal(CAR_CONTACT_RADIUS, 1.05);
  assert.equal(CAR_HALF_LENGTH, 1.25);
  assert.ok(1.6 > CAR_CONTACT_RADIUS + 0.4 - 1e-9 || arcadeCircleMissesFrontPole(1.6, 0.4));
});

test('the same 1.6 m front pole intersects every visual hull', () => {
  const pole = { x: 0, z: -1.6, r: 0.4, kind: 'barrier' };
  for (const def of CARS) {
    const hull = visualHull(def.body);
    assert.ok(hull.halfLength > 1.6, `${def.id} ${hull.halfLength}`);
    assert.equal(visualOverlapsCollider({ x: 0, y: 0, z: 0, yaw: 0, body: def.body }, pole, def.body), true);
  }
});

test('all five cars exceed the arcade box in length; roofs stay at or under 1.6', () => {
  for (const def of CARS) {
    const hull = visualHull(def.body);
    assert.equal(arcadeProxyIsNotMesh(hull), true);
    assert.ok(hull.halfLength > ARCADE_BOX.halfLength, def.id);
    assert.ok(hull.yMax <= ARCADE_BOX.yMax + 1e-9, `${def.id} roof ${hull.yMax}`);
    assert.ok(hull.halfWidth > 0, def.id);
  }
});

test('car-mesh layout tokens still match the visual hull table', () => {
  const mesh = readFileSync(fromRoot('src', 'game', 'car-mesh.ts'), 'utf8');
  assert.match(mesh, /if \(kind === "hatch"\)\s*return \{ L: 4\.08, W: 1\.76/);
  assert.match(mesh, /if \(kind === "muscle"\)\s*return \{ L: 4\.82, W: 1\.9/);
  assert.match(mesh, /if \(kind === "rally"\)\s*return \{ L: 4\.32, W: 1\.84/);
  assert.match(mesh, /if \(kind === "super"\)\s*return \{ L: 4\.52, W: 1\.96/);
  assert.match(mesh, /return \{ L: 4\.5, W: 1\.82/);
});

test('a 9.4 underpass still clears the shorter visual roof', () => {
  const slab = { x: 0, z: 0, r: 8, role: 'overhead-slab', vertical: { min: 9.4, max: 9.8 } };
  for (const def of CARS) {
    const env = visualEnvelope(def.body, 0.4, 0.34);
    assert.ok(env.yMax < 9.4 - 0.04, `${def.id} ${env.yMax}`);
    assert.equal(visualOverlapsCollider({ x: 0, y: 0, z: 0, yaw: 0, pitch: 0.4, roll: 0.34, body: def.body }, slab, def.body), false);
  }
});

test('a support pier beside the origin uses the unpadded 0.72 mesh radius', () => {
  const foot = obstacleFootprint({ x: 2, z: 0, r: PIER_MESH_RADIUS + CAR_CONTACT_RADIUS, role: 'support-pier', vertical: { min: 0, max: 9.4 } });
  assert.deepEqual(foot, { kind: 'circle', r: 0.72 });
});

test('malformed hull inputs fail closed instead of passing through', () => {
  assert.equal(visualOverlapsCollider({ x: NaN, y: 0, z: 0, yaw: 0 }, { x: 0, z: 0, r: 1 }), true);
  assert.equal(visualOverlapsCollider({ x: 0, y: 0, z: 0, yaw: 0 }, { x: 0, z: 0, r: NaN }), true);
  const env = visualEnvelope('gt', NaN, 0);
  assert.ok(env.yMax > visualHull('gt').yMax);
});

test('rest-pose visual envelope is not the 1.6 arcade identity', () => {
  const env = visualEnvelope('muscle', 0, 0);
  assert.ok(env.yMax < CAR_CONTACT_HEIGHT);
  assert.ok(visualHull('muscle').halfLength > CAR_HALF_LENGTH);
});
