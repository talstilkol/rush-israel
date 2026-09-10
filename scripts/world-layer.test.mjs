import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fromRoot } from './project-root.mjs';
import {
  CHANNEL_EPS, EXPECTED_DECKS, EXPECTED_PIERS, EXPECTED_STRIPS, LAYER_CONTRIB_MIN, LAYER_FRAMES,
  SAMPLE_TOTAL, WORLD_LAYERS, catalogueCountIsNotLayerAttribution, classifyMesh, classifyRampKind,
  retainWorldLayers, sameGeom, worldLayerFixture, worldLayerResults,
} from './world-layer-browser.mjs';
import { HISTORICAL_COLLIDERS, HISTORICAL_RAMPS } from './golden-attribution-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('catalogue counts without layer samples are not pixel-layer attribution', () => {
  assert.equal(catalogueCountIsNotLayerAttribution({ frames: [] }), true);
  assert.equal(catalogueCountIsNotLayerAttribution({ rampCount: 50, colliderCount: 722, frames: [{ id: 'g01' }] }), true);
  assert.equal(catalogueCountIsNotLayerAttribution(worldLayerFixture()), false);
  assert.equal(worldLayerFixture().rampCount - HISTORICAL_RAMPS, 18);
  assert.equal(worldLayerFixture().colliderCount - HISTORICAL_COLLIDERS, 181);
});

test('ramp decks and edge strips classify separately from piers', () => {
  const ramps = [{ x: 0, z: 0, half: 10.2, len: 46 }];
  assert.equal(classifyMesh({ isMesh: true, geometry: { type: 'BoxGeometry', parameters: { width: 20.4, height: 0.95, depth: 46 } } }, ramps), 'ramps');
  assert.equal(classifyRampKind({ geometry: { type: 'BoxGeometry', parameters: { width: 20.4, height: 0.95, depth: 46 } } }, ramps), 'deck');
  assert.equal(classifyMesh({ isMesh: true, geometry: { type: 'BoxGeometry', parameters: { width: 0.18, height: 0.08, depth: 43.24 } } }, ramps), 'ramps');
  assert.equal(classifyRampKind({ geometry: { type: 'BoxGeometry', parameters: { width: 0.18, height: 0.08, depth: 43.24 } } }, ramps), 'strip');
  assert.equal(classifyMesh({ isMesh: true, geometry: { type: 'CylinderGeometry', parameters: { radiusTop: 0.55, radiusBottom: 0.72 } } }, ramps), 'piers');
  assert.equal(classifyMesh({ isMesh: true, isInstancedMesh: true, geometry: { type: 'BoxGeometry', parameters: { width: 1, height: 1, depth: 1 } } }, ramps), 'instanced');
  assert.equal(classifyMesh({ isMesh: true, geometry: { type: 'BoxGeometry', parameters: { width: 8, height: 12, depth: 8 } }, material: { type: 'MeshStandardMaterial' } }, ramps), 'other');
  assert.equal(classifyMesh({ isMesh: true, geometry: { type: 'PlaneGeometry', parameters: {} }, material: { isMeshPhysicalMaterial: true } }, ramps), 'water');
  assert.equal(sameGeom(0.95, 0.9500001), true);
});

test('locked isolation poses match original-golden cameras', () => {
  assert.deepEqual(WORLD_LAYERS, ['ramps', 'piers', 'water', 'instanced', 'other']);
  assert.deepEqual(LAYER_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(LAYER_FRAMES.map(row => row.t), [0.04, 0.46, 0.62, 0.48]);
  assert.equal(LAYER_FRAMES[3].night, true);
  assert.equal(EXPECTED_DECKS, 50);
  assert.equal(EXPECTED_STRIPS, 100);
  assert.equal(EXPECTED_PIERS, 176);
  assert.equal(LAYER_CONTRIB_MIN, 0.02);
  assert.equal(SAMPLE_TOTAL, 49);
  assert.equal(CHANNEL_EPS, 8);
});

test('layer-isolation evidence yields five protocol passes', () => {
  assert.deepEqual(worldLayerResults(worldLayerFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-layer evidence fails closed: ${name}`, () => {
  const r = worldLayerFixture();
  mutate(r);
  assert.throws(() => worldLayerResults(r));
});

test('catalogue-only world label without layer samples fails closed', () => {
  const r = worldLayerFixture();
  r.frames = r.frames.map(frame => ({ id: frame.id, night: frame.night, follow: 7.4, height: 1.92, layers: [] }));
  assert.equal(catalogueCountIsNotLayerAttribution(r), true);
  assert.throws(() => worldLayerResults(r), /catalogue counts are not pixel-layer attribution/);
});

test('zero classified ramps and piers fail closed', () => {
  const r = worldLayerFixture();
  r.frames = r.frames.map(frame => ({
    ...frame,
    layers: WORLD_LAYERS.map(id => ({ id, hidden: 0, changed: 0, changedFraction: 0.2 })),
  }));
  assert.throws(() => worldLayerResults(r), /classified ramp\/pier membership missing/);
});

test('a pose with no contributing layer remains failed', () => {
  const r = worldLayerFixture();
  r.frames[0] = {
    ...r.frames[0],
    contributing: [],
    layers: WORLD_LAYERS.map(id => ({ id, hidden: id === 'ramps' ? 150 : 10, changed: 0, changedFraction: 0 })),
  };
  const contrib = worldLayerResults(r).find(row => row.case.includes('changes samples'));
  assert.equal(contrib.status, 'failed');
  assert.equal(contrib.failures, 1);
});

test('a rest-camera miss remains failed during isolation', () => {
  const r = worldLayerFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldLayerResults(r));
});

test('invalid world-layer report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-layer-invalid-'));
  try {
    const r = worldLayerFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldLayers(r, out));
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
