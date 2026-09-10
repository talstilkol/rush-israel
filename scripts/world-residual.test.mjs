import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fromRoot } from './project-root.mjs';
import {
  CHANNEL_EPS, EXPECTED_DECKS, EXPECTED_PIERS, EXPECTED_STRIPS, GROUND_PLANE_MIN, LAYER_CONTRIB_MIN,
  RESIDUAL_FRAMES, RESIDUAL_LAYERS, SAMPLE_TOTAL, SKY_RADIUS_MIN, WATER_IOR, WATER_IOR_EPS,
  classifyResidual, classifyRampKind, isIorWaterMaterial, physicalOnlyWaterLabelIsNotWater,
  retainWorldResidual, sameGeom, unnamedResidualIsNotNamedWorldClass, worldResidualFixture,
  worldResidualResults,
} from './world-residual-browser.mjs';
import { classifyMesh } from './world-layer-browser.mjs';
import { HISTORICAL_COLLIDERS, HISTORICAL_RAMPS } from './golden-attribution-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('physical-material-only water label is not water attribution', () => {
  const ramps = [{ x: 0, z: 0, half: 10.2, len: 46 }];
  const glass = {
    isMesh: true,
    geometry: { type: 'BoxGeometry', parameters: { width: 8, height: 12, depth: 8 } },
    material: { type: 'MeshPhysicalMaterial', ior: 1.5, transparent: false },
  };
  const road = {
    isMesh: true,
    geometry: { type: 'BufferGeometry', parameters: undefined },
    material: { type: 'MeshPhysicalMaterial', ior: 1.5, transparent: false, userData: { lanes: 4 } },
  };
  assert.equal(classifyMesh(glass, ramps), 'water');
  assert.equal(classifyResidual(glass, ramps), 'glass');
  assert.equal(classifyMesh(road, ramps), 'water');
  assert.equal(classifyResidual(road, ramps), 'carriageway');
  assert.equal(isIorWaterMaterial(glass.material), false);
  assert.equal(physicalOnlyWaterLabelIsNotWater({ frames: [] }), true);
  assert.equal(physicalOnlyWaterLabelIsNotWater(worldResidualFixture()), false);
});

test('named residual split classifies water, carriageway, sky, ground and glass', () => {
  const ramps = [{ x: 0, z: 0, half: 10.2, len: 46 }];
  assert.equal(classifyResidual({ isMesh: true, geometry: { type: 'BoxGeometry', parameters: { width: 20.4, height: 0.95, depth: 46 } } }, ramps), 'ramps');
  assert.equal(classifyRampKind({ geometry: { type: 'BoxGeometry', parameters: { width: 20.4, height: 0.95, depth: 46 } } }, ramps), 'deck');
  assert.equal(classifyResidual({ isMesh: true, geometry: { type: 'CylinderGeometry', parameters: { radiusTop: 0.55, radiusBottom: 0.72 } } }, ramps), 'piers');
  assert.equal(classifyResidual({
    isMesh: true,
    geometry: { type: 'PlaneGeometry', parameters: { width: 1400, height: 1600 } },
    material: { type: 'MeshPhysicalMaterial', ior: WATER_IOR, transparent: true },
  }, ramps), 'water');
  assert.equal(classifyResidual({
    isMesh: true,
    geometry: { type: 'SphereGeometry', parameters: { radius: 8200 } },
    material: { type: 'MeshBasicMaterial' },
  }, ramps), 'sky');
  assert.equal(classifyResidual({
    isMesh: true,
    geometry: { type: 'PlaneGeometry', parameters: { width: 1200, height: 1200 } },
    material: { type: 'MeshStandardMaterial' },
  }, ramps), 'ground');
  assert.equal(classifyResidual({ isMesh: true, isInstancedMesh: true, geometry: { type: 'BoxGeometry', parameters: { width: 1, height: 1, depth: 1 } } }, ramps), 'instanced');
  assert.equal(classifyResidual({ isMesh: true, geometry: { type: 'BoxGeometry', parameters: { width: 8, height: 12, depth: 8 } }, material: { type: 'MeshStandardMaterial' } }, ramps), 'residual');
  assert.equal(sameGeom(0.95, 0.9500001), true);
  assert.equal(WATER_IOR, 1.33);
  assert.equal(WATER_IOR_EPS, 0.02);
  assert.equal(SKY_RADIUS_MIN, 8000);
  assert.equal(GROUND_PLANE_MIN, 1000);
});

test('locked residual poses match original-golden cameras', () => {
  assert.deepEqual(RESIDUAL_LAYERS, ['ramps', 'piers', 'water', 'carriageway', 'sky', 'ground', 'glass', 'instanced', 'residual']);
  assert.deepEqual(RESIDUAL_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(RESIDUAL_FRAMES.map(row => row.t), [0.04, 0.46, 0.62, 0.48]);
  assert.equal(RESIDUAL_FRAMES[3].night, true);
  assert.equal(EXPECTED_DECKS, 50);
  assert.equal(EXPECTED_STRIPS, 100);
  assert.equal(EXPECTED_PIERS, 176);
  assert.equal(LAYER_CONTRIB_MIN, 0.02);
  assert.equal(SAMPLE_TOTAL, 49);
  assert.equal(CHANNEL_EPS, 8);
  assert.equal(worldResidualFixture().rampCount - HISTORICAL_RAMPS, 18);
  assert.equal(worldResidualFixture().colliderCount - HISTORICAL_COLLIDERS, 181);
});

test('residual-isolation evidence yields five protocol passes', () => {
  assert.deepEqual(worldResidualResults(worldResidualFixture()).map(row => row.status), Array(5).fill('passed'));
  assert.equal(unnamedResidualIsNotNamedWorldClass(worldResidualFixture()), false);
});

for (const [name, mutate] of [
  ['lost collider', r => { r.colliderCount = 721; }],
  ['lost pier', r => { r.pierCount = 175; }],
  ['lost ramp', r => { r.rampCount = 49; }],
  ['lost deck', r => { r.decks = 49; }],
  ['lost strip', r => { r.strips = 99; }],
  ['lost classified pier', r => { r.classifiedPiers = 175; }],
  ['lost checkpoint', r => { r.checkpointCount = 7; }],
  ['page error', r => r.pageErrors.push('error')],
  ['gl error', r => { r.glError = 1; }],
  ['missing frames', r => { r.frames = r.frames.slice(0, 2); }],
  ['missing layers', r => { r.frames[0].layers = r.frames[0].layers.slice(0, 2); }],
  ['PNG refresh', r => { r.updateGolden = true; }],
  ['baseline rewrite', r => { r.baselineUpdates = 1; }],
  ['authority claim', r => { r.authority = true; }],
  ['original-golden comparisons', r => { r.originalGoldenComparisons = 4; }],
]) test(`world-residual evidence fails closed: ${name}`, () => {
  const r = worldResidualFixture();
  mutate(r);
  assert.throws(() => worldResidualResults(r));
});

test('physical-only water report without carriageway split fails closed', () => {
  const r = worldResidualFixture();
  r.frames = r.frames.map(frame => ({
    ...frame,
    layers: ['ramps', 'piers', 'water', 'instanced', 'other'].map(id => ({ id, hidden: 10, changed: 4, changedFraction: 0.2 })),
  }));
  r.classified = { ramps: 150, piers: 176, water: 90, instanced: 40, other: 698 };
  delete r.waterIorCount;
  assert.equal(physicalOnlyWaterLabelIsNotWater(r), true);
  assert.equal(unnamedResidualIsNotNamedWorldClass(r), true);
  assert.throws(() => worldResidualResults(r), /physical-material-only water is not water/);
});

test('water count that is not ior-water membership fails closed', () => {
  const r = worldResidualFixture();
  r.classified = { ...r.classified, water: 90 };
  r.waterIorCount = 3;
  assert.equal(physicalOnlyWaterLabelIsNotWater(r), true);
  assert.throws(() => worldResidualResults(r), /physical-material-only water is not water/);
});

test('a pose with no contributing residual layer remains failed', () => {
  const r = worldResidualFixture();
  r.frames[0] = {
    ...r.frames[0],
    contributing: [],
    layers: RESIDUAL_LAYERS.map(id => ({ id, hidden: id === 'ramps' ? 150 : 10, changed: 0, changedFraction: 0 })),
  };
  const contrib = worldResidualResults(r).find(row => row.case.includes('changes samples'));
  assert.equal(contrib.status, 'failed');
  assert.equal(contrib.failures, 1);
});

test('a rest-camera miss remains failed during residual isolation', () => {
  const r = worldResidualFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldResidualResults(r));
});

test('invalid world-residual report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-residual-invalid-'));
  try {
    const r = worldResidualFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldResidual(r, out));
    assert.equal(JSON.parse(await readFile(join(out, 'results.json'), 'utf8')).originalGoldenComparisons, 4);
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});

test('RSH-035 original PNG bytes stay unchanged', () => {
  for (const name of ORIGINAL_GOLDEN_FILES) {
    assert.equal(sha256(readFileSync(fromRoot('golden-baseline', name))), RSH035_BASELINE_SHA256[name], name);
  }
});

test('rest chase overlay remains the 26 August 7.4/1.92 lock', () => {
  const src = readFileSync(fromRoot('src', 'game', 'engine', 'rendering-adapter.ts'), 'utf8');
  assert.match(src, /let follow = 7\.4 \+ clamp\(Math\.abs\(p\.speed\) \/ 22, 0, 2\.2\);/);
  assert.match(src, /let height = 1\.92;/);
});

test('freeze path count 85 and generation 11 stay', () => {
  const freeze = JSON.parse(readFileSync(fromRoot('AYALON-FREEZE-MANIFEST.json'), 'utf8'));
  assert.equal(freeze.lock.source_count, 85);
  assert.equal(freeze.lock.ayalon_lock_generation, 11);
  assert.equal(freeze.lock.freeze_granted, false);
  assert.equal(freeze.preservation.golden_png_changes, 0);
  const evolution = JSON.parse(readFileSync(fromRoot('RSH-036-RUNTIME-EVOLUTION.json'), 'utf8'));
  assert.equal(Object.keys(evolution.files).length, 58);
});
