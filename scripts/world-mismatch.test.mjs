import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fromRoot } from './project-root.mjs';
import {
  CHANNEL_EPS, MISMATCH_FRAMES, MISMATCH_LAYERS, SAMPLE_TOTAL, classifyResidual,
  liveContributionIsNotGoldenMismatch, pngSampleGrid, retainWorldMismatch,
  sampleMismatchCount, worldMismatchFixture, worldMismatchResults,
} from './world-mismatch-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('live layer contribution without pngMismatch is not golden mismatch attribution', () => {
  assert.equal(liveContributionIsNotGoldenMismatch({ frames: [] }), true);
  assert.equal(liveContributionIsNotGoldenMismatch({
    frames: [{ id: 'g01', layers: [{ id: 'ground', changedFraction: 0.51, hidden: 1 }] }],
  }), true);
  assert.equal(liveContributionIsNotGoldenMismatch(worldMismatchFixture()), false);
  const liveOnly = worldMismatchFixture();
  liveOnly.frames = liveOnly.frames.map(frame => ({
    ...frame,
    pngMismatch: undefined,
    layers: frame.layers.map(layer => ({ id: layer.id, hidden: layer.hidden, changedFraction: layer.changedFraction })),
  }));
  assert.equal(liveContributionIsNotGoldenMismatch(liveOnly), true);
  assert.throws(() => worldMismatchResults(liveOnly), /live contribution is not golden mismatch/);
});

test('png 7x7 grid is 49 packed samples and mismatches itself at zero', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const grid = pngSampleGrid(buf);
  assert.equal(grid.length, SAMPLE_TOTAL);
  assert.equal(sampleMismatchCount(grid, grid), 0);
  const flipped = grid.map((value, i) => (i === 0 ? value ^ 0xffffff : value));
  assert.equal(sampleMismatchCount(grid, flipped) >= 1, true);
  assert.equal(CHANNEL_EPS, 8);
});

test('locked mismatch poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(MISMATCH_LAYERS, ['ramps', 'piers', 'water', 'carriageway', 'sky', 'ground', 'glass', 'instanced', 'residual']);
  assert.deepEqual(MISMATCH_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(MISMATCH_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(MISMATCH_FRAMES[3].night, true);
  const ramps = [{ x: 0, z: 0, half: 10.2, len: 46 }];
  assert.equal(classifyResidual({
    isMesh: true,
    geometry: { type: 'BoxGeometry', parameters: { width: 8, height: 12, depth: 8 } },
    material: { type: 'MeshPhysicalMaterial', ior: 1.5, transparent: false },
  }, ramps), 'glass');
});

test('mismatch-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldMismatchResults(worldMismatchFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-mismatch evidence fails closed: ${name}`, () => {
  const r = worldMismatchFixture();
  mutate(r);
  assert.throws(() => worldMismatchResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldMismatchFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldMismatchResults(r), /baseline hash drift/);
});

test('zero pngMismatch at a pose remains failed', () => {
  const r = worldMismatchFixture();
  r.frames[0] = { ...r.frames[0], pngMismatch: 0, pngMismatchFraction: 0 };
  const row = worldMismatchResults(r).find(item => item.case.includes('mismatch the live buffer'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during mismatch isolation', () => {
  const r = worldMismatchFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldMismatchResults(r));
});

test('invalid world-mismatch report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-mismatch-invalid-'));
  try {
    const r = worldMismatchFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldMismatch(r, out));
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

test('smoke keeps world-layer isolation after residual split', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldLayers \} from '\.\/world-layer-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldResidual \} from '\.\/world-residual-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldMismatch \} from '\.\/world-mismatch-browser\.mjs';/);
  assert.match(src, /verifyWorldLayers\(browser, url\)/);
  assert.match(src, /verifyWorldResidual\(browser, url\)/);
  assert.match(src, /verifyWorldMismatch\(browser, url\)/);
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
