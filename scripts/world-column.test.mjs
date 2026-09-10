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
  COLUMN_FRAMES, COLUMN_PIXELS, COLUMN_WIDTH, FAILURE_LIMIT, PIXEL_THRESHOLD, REGION_COLUMNS,
  columnBufferIsNotOriginalGolden, columnPixelmatch, cropPngRect, dominantColumn,
  regionBandIsNotColumnMismatch, retainWorldColumn, worldColumnFixture, worldColumnResults,
} from './world-column-browser.mjs';
import { REGION_BANDS } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px band without columns is not column mismatch', () => {
  assert.equal(regionBandIsNotColumnMismatch({ frames: [] }), true);
  assert.equal(regionBandIsNotColumnMismatch({
    frames: [{ id: 'g01', presentPct: 0.41, presentMismatched: 100, dominant: 'bottom', bands: REGION_BANDS }],
  }), true);
  assert.equal(regionBandIsNotColumnMismatch(worldColumnFixture()), false);
  const bandOnly = worldColumnFixture();
  bandOnly.frames = bandOnly.frames.map(frame => ({
    id: frame.id, presentPct: frame.presentPct, presentMismatched: frame.presentMismatched,
    pixelThreshold: PIXEL_THRESHOLD, bands: frame.bands, dominant: frame.dominant,
  }));
  assert.equal(regionBandIsNotColumnMismatch(bandOnly), true);
  assert.throws(() => worldColumnResults(bandOnly), /dominant 200px band is not column mismatch/);
});

test('column buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(columnBufferIsNotOriginalGolden(worldColumnFixture()), false);
  assert.equal(columnBufferIsNotOriginalGolden({
    ...worldColumnFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(COLUMN_WIDTH, 320);
  assert.equal(COLUMN_PIXELS, 320 * 200);
  assert.deepEqual(REGION_COLUMNS.map(row => row.id), ['left', 'midLeft', 'midRight', 'right']);
});

test('identical PNG column pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const cropped = cropPngRect(png, 0, 600, 320, 800);
  assert.equal(cropped.width, 320);
  assert.equal(cropped.height, 200);
  const match = columnPixelmatch(png, png, REGION_BANDS[3], REGION_COLUMNS[0]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'left');
  assert.equal(match.band, 'bottom');
});

test('locked column poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(COLUMN_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(COLUMN_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(COLUMN_FRAMES[3].night, true);
  assert.equal(dominantColumn(worldColumnFixture().frames[0].columns), 'right');
});

test('column-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldColumnResults(worldColumnFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-column evidence fails closed: ${name}`, () => {
  const r = worldColumnFixture();
  mutate(r);
  assert.throws(() => worldColumnResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldColumnFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldColumnResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldColumnFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldColumnResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during column matching', () => {
  const r = worldColumnFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldColumnResults(r));
});

test('invalid world-column report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-column-invalid-'));
  try {
    const r = worldColumnFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldColumn(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column and slice probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldLayers \} from '\.\/world-layer-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldResidual \} from '\.\/world-residual-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldMismatch \} from '\.\/world-mismatch-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldBias \} from '\.\/world-bias-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldScene \} from '\.\/world-scene-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldRegion \} from '\.\/world-region-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldColumn \} from '\.\/world-column-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldSlice \} from '\.\/world-slice-browser\.mjs';/);
  assert.match(src, /verifyWorldLayers\(browser, url\)/);
  assert.match(src, /verifyWorldResidual\(browser, url\)/);
  assert.match(src, /verifyWorldMismatch\(browser, url\)/);
  assert.match(src, /verifyWorldBias\(browser, url\)/);
  assert.match(src, /verifyWorldScene\(browser, url\)/);
  assert.match(src, /verifyWorldRegion\(browser, url\)/);
  assert.match(src, /verifyWorldColumn\(browser, url\)/);
  assert.match(src, /verifyWorldSlice\(browser, url\)/);
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
