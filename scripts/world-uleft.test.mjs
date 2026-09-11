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
  BAND_PIXELS, BOTH_IDS, CAPTURE_LAYERS, EXTRAS_IDS, FAILURE_LIMIT, IBL_IDS, PIER_IDS, SKY_IDS, UNNAMED_IDS,
  ULEFT_BAND_MIN, ULEFT_BLUE_MIN, ULEFT_FRAMES, ULEFT_L2_MIN, ULEFT_LAYERS, ULEFT_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantUleft, leftoverIsNotUleftMismatch, retainWorldUleft, uleftBufferIsNotOriginalGolden,
  worldUleftFixture, worldUleftResults,
} from './world-uleft-browser.mjs';
import { worldWgiFixture } from './world-wgi-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px leftover report without remaining unnamed occupancy vs env is not uleft mismatch', () => {
  assert.equal(leftoverIsNotUleftMismatch({ frames: [] }), true);
  assert.equal(leftoverIsNotUleftMismatch(worldWgiFixture()), true);
  assert.equal(leftoverIsNotUleftMismatch(worldUleftFixture()), false);
  assert.throws(() => worldUleftResults(worldWgiFixture()), /leftover g07 after ramps\+buildings\+instanced\+ground is not remaining unnamed occupancy vs env mismatch/);
});

test('uleft buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(uleftBufferIsNotOriginalGolden(worldUleftFixture()), false);
  assert.equal(uleftBufferIsNotOriginalGolden({
    ...worldUleftFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(ULEFT_L2_MIN, 8);
  assert.equal(ULEFT_LUMA_MIN, 8);
  assert.equal(ULEFT_BLUE_MIN, 8);
  assert.equal(ULEFT_BAND_MIN, 0.02);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(ULEFT_LAYERS, ['unnamed', 'env', 'both', 'sky', 'piers', 'extras']);
  assert.deepEqual([...CAPTURE_LAYERS], ['unnamed', 'env', 'both', 'sky', 'piers', 'extras']);
  assert.deepEqual([...UNNAMED_IDS], ['unnamed']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.deepEqual([...BOTH_IDS], ['both']);
  assert.deepEqual([...SKY_IDS], ['sky']);
  assert.deepEqual([...PIER_IDS], ['piers']);
  assert.deepEqual([...EXTRAS_IDS], ['extras']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-uleft-browser.mjs'), 'utf8');
  assert.match(src, /SphereGeometry/);
  assert.match(src, /radius, 8200/);
  assert.match(src, /hideMeshes\(leftoverOf\(\)\)/);
  assert.match(src, /hideMeshes\(remainingOf\(\)\)/);
  assert.match(src, /hideMeshes\(membership\.sky\)/);
  assert.match(src, /hideMeshes\(membership\.piers\)/);
  assert.match(src, /hideMeshes\(membership\.extras\)/);
  assert.match(src, /\.\.\.hideMeshes\(leftoverOf\(\)\), \.\.\.swapEnv\(gray\)/);
  assert.match(src, /unnamed\(\) \{/);
  assert.match(src, /isInstancedMesh/);
  assert.match(src, /membership\.ramps, \.\.\.membership\.buildings, \.\.\.membership\.instanced, \.\.\.membership\.ground/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), bothIsCombined: true }), /uleft isolation still combined with hemi/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), unnamedHidesRemaining: false }), /unnamed isolation did not hide remaining occupancy meshes/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), unnamedHidesLeftover: false }), /unnamed isolation did not hide leftover ramps\+buildings\+instanced\+ground/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), bothHidesRemaining: false }), /both isolation did not hide remaining occupancy meshes/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), bothSetsGray: false }), /both isolation did not swap gray cubemap/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), skyHidesSky: false }), /sky isolation did not hide sky dome/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), piersHidesPiers: false }), /piers isolation did not hide pier meshes/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), extrasHidesExtras: false }), /extras isolation did not hide unclassified extras/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), envHidesLeftover: false }), /env isolation did not hide leftover ramps\+buildings\+instanced\+ground/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), intensityClearsIbl: true }), /uleft isolation clears scene.environment via sun/);
  assert.throws(() => worldUleftResults({ ...worldUleftFixture(), uleftDeltasUseIgndBaseline: false }), /leftover g07 still uses ramps\+buildings leftover as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked uleft poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(ULEFT_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(ULEFT_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(ULEFT_FRAMES[3].night, true);
  assert.equal(dominantUleft(worldUleftFixture().frames[0].layers), 'unnamed');
});

test('uleft-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldUleftResults(worldUleftFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-uleft evidence fails closed: ${name}`, () => {
  const r = worldUleftFixture();
  mutate(r);
  assert.throws(() => worldUleftResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldUleftFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldUleftResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldUleftFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldUleftResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during uleft sampling', () => {
  const r = worldUleftFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldUleftResults(r));
});

test('invalid world-uleft report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-uleft-invalid-'));
  try {
    const r = worldUleftFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldUleft(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi hex off env eint back hterm nfill upper renv gleft wgi uleft nmesh and ogrp probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldWgi \} from '\.\/world-wgi-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldUleft \} from '\.\/world-uleft-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldNmesh \} from '\.\/world-nmesh-browser\.mjs';/);
  assert.match(src, /verifyWorldWgi\(browser, url\)/);
  assert.match(src, /verifyWorldUleft\(browser, url\)/);
  assert.match(src, /verifyWorldNmesh\(browser, url\)/);
  assert.match(src, /verifyWorldOgrp\(browser, url\)/);
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
