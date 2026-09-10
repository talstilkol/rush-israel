import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { PNG } from 'pngjs';
import { fromRoot } from './project-root.mjs';
import {
  BAND_PIXELS, FAILURE_LIMIT, PIXEL_THRESHOLD, SLICE_DELTA_MIN, SLICE_FRAMES, SLICE_LAYERS,
  dominantLayer, regionColumnIsNotSliceMismatch, retainWorldSlice,
  sliceBufferIsNotOriginalGolden, worldSliceFixture, worldSliceResults,
} from './world-slice-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px column report without layers is not slice mismatch', () => {
  assert.equal(regionColumnIsNotSliceMismatch({ frames: [] }), true);
  assert.equal(regionColumnIsNotSliceMismatch({
    frames: [{ id: 'g01', presentPct: 0.41, presentMismatched: 100, dominant: 'bottom', dominantColumn: 'left', bands: REGION_BANDS }],
  }), true);
  assert.equal(regionColumnIsNotSliceMismatch(worldSliceFixture()), false);
  const columnOnly = worldSliceFixture();
  columnOnly.frames = columnOnly.frames.map(frame => ({
    id: frame.id, presentPct: frame.presentPct, presentMismatched: frame.presentMismatched,
    pixelThreshold: PIXEL_THRESHOLD, bands: frame.bands, dominant: frame.dominant,
    dominantColumn: 'left',
  }));
  assert.equal(regionColumnIsNotSliceMismatch(columnOnly), true);
  assert.throws(() => worldSliceResults(columnOnly), /dominant 200px band is not world-layer slice mismatch/);
});

test('slice buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(sliceBufferIsNotOriginalGolden(worldSliceFixture()), false);
  assert.equal(sliceBufferIsNotOriginalGolden({
    ...worldSliceFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(SLICE_DELTA_MIN, 0.02);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(SLICE_LAYERS, ['ramps', 'piers', 'water', 'carriageway', 'sky', 'ground', 'glass', 'instanced', 'residual']);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked slice poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(SLICE_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(SLICE_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(SLICE_FRAMES[3].night, true);
  assert.equal(dominantLayer(worldSliceFixture().frames[0].layers), 'ground');
});

test('slice-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldSliceResults(worldSliceFixture()).map(row => row.status), Array(5).fill('passed'));
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
  ['PNG refresh', r => { r.updateGolden = true; }],
  ['baseline rewrite', r => { r.baselineUpdates = 1; }],
  ['authority claim', r => { r.authority = true; }],
  ['original-golden comparisons', r => { r.originalGoldenComparisons = 4; }],
  ['threshold drift', r => { r.pixelThreshold = 0.2; }],
]) test(`world-slice evidence fails closed: ${name}`, () => {
  const r = worldSliceFixture();
  mutate(r);
  assert.throws(() => worldSliceResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldSliceFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldSliceResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldSliceFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldSliceResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during slice matching', () => {
  const r = worldSliceFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldSliceResults(r));
});

test('invalid world-slice report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-slice-invalid-'));
  try {
    const r = worldSliceFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldSlice(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade and tone probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldLayers \} from '\.\/world-layer-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldResidual \} from '\.\/world-residual-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldMismatch \} from '\.\/world-mismatch-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldBias \} from '\.\/world-bias-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldScene \} from '\.\/world-scene-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldRegion \} from '\.\/world-region-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldColumn \} from '\.\/world-column-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldSlice \} from '\.\/world-slice-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldExtra \} from '\.\/world-extra-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldMaterial \} from '\.\/world-material-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldFactor \} from '\.\/world-factor-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldRgb \} from '\.\/world-rgb-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldShade \} from '\.\/world-shade-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldTone \} from '\.\/world-tone-browser\.mjs';/);
  assert.match(src, /verifyWorldLayers\(browser, url\)/);
  assert.match(src, /verifyWorldResidual\(browser, url\)/);
  assert.match(src, /verifyWorldMismatch\(browser, url\)/);
  assert.match(src, /verifyWorldBias\(browser, url\)/);
  assert.match(src, /verifyWorldScene\(browser, url\)/);
  assert.match(src, /verifyWorldRegion\(browser, url\)/);
  assert.match(src, /verifyWorldColumn\(browser, url\)/);
  assert.match(src, /verifyWorldSlice\(browser, url\)/);
  assert.match(src, /verifyWorldExtra\(browser, url\)/);
  assert.match(src, /verifyWorldMaterial\(browser, url\)/);
  assert.match(src, /verifyWorldFactor\(browser, url\)/);
  assert.match(src, /verifyWorldRgb\(browser, url\)/);
  assert.match(src, /verifyWorldShade\(browser, url\)/);
  assert.match(src, /verifyWorldTone\(browser, url\)/);
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
