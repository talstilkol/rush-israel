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
  BAND_PIXELS, PACK_IDS, BOTH_IDS, CAPTURE_LAYERS, FAILURE_LIMIT, REVERSED_IDS, STENCIL_IDS, IBL_IDS, PRESERVE_IDS,
  PSR_BAND_MIN, PSR_BLUE_MIN, PSR_FRAMES, PSR_L2_MIN, PSR_LAYERS, PSR_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_FOV, PRODUCT_NEAR, PRODUCT_FAR_MIN,
  PRODUCT_FOLLOW, PRODUCT_HEIGHT, PRODUCT_PIXEL_RATIO, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  PRODUCT_PRESERVE, PRODUCT_STENCIL, PRODUCT_REVERSED,
  dominantPsr, leftoverIsNotPsrMismatch, psrBufferIsNotOriginalGolden, retainWorldPsr,
  worldPsrFixture, worldPsrResults,
} from './world-psr-browser.mjs';
import { worldPclFixture } from './world-pcl-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px leftover report without remaining empty-scene vs golden independently of preserveDrawingBuffer vs stencil vs reversedDepthBuffer is not pcl mismatch', () => {
  assert.equal(leftoverIsNotPsrMismatch({ frames: [] }), true);
  assert.equal(leftoverIsNotPsrMismatch(worldPclFixture()), true);
  assert.equal(leftoverIsNotPsrMismatch(worldPsrFixture()), false);
  assert.throws(() => worldPsrResults(worldPclFixture()), /leftover g07 after world.group\+outside is not remaining empty-scene vs golden independently of preserveDrawingBuffer vs stencil vs reversedDepthBuffer mismatch/);
});

test('psr buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(psrBufferIsNotOriginalGolden(worldPsrFixture()), false);
  assert.equal(psrBufferIsNotOriginalGolden({
    ...worldPsrFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(PSR_L2_MIN, 8);
  assert.equal(PSR_LUMA_MIN, 8);
  assert.equal(PSR_BLUE_MIN, 8);
  assert.equal(PSR_BAND_MIN, 0.02);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(PRODUCT_FOV, 58);
  assert.equal(PRODUCT_NEAR, 0.28);
  assert.equal(PRODUCT_FAR_MIN, 10000);
  assert.equal(PRODUCT_FOLLOW, 7.4);
  assert.equal(PRODUCT_HEIGHT, 1.92);
  assert.equal(PRODUCT_PIXEL_RATIO, 1);
  assert.equal(PRODUCT_PRESERVE, false);
  assert.equal(PRODUCT_STENCIL, false);
  assert.equal(PRODUCT_REVERSED, false);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(PSR_LAYERS, ['preserve', 'stencil', 'reversed', 'env', 'both', 'pack']);
  assert.deepEqual([...CAPTURE_LAYERS], ['preserve', 'stencil', 'reversed', 'env', 'both', 'pack']);
  assert.deepEqual([...PRESERVE_IDS], ['preserve']);
  assert.deepEqual([...STENCIL_IDS], ['stencil']);
  assert.deepEqual([...REVERSED_IDS], ['reversed']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.deepEqual([...BOTH_IDS], ['both']);
  assert.deepEqual([...PACK_IDS], ['pack']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-psr-browser.mjs'), 'utf8');
  assert.match(src, /SphereGeometry/);
  assert.match(src, /radius, 8200/);
  assert.match(src, /hideMeshes\(leftoverOf\(\)\)/);
  assert.match(src, /remainingOf\(\)/);
  assert.match(src, /membership\.ramps, \.\.\.membership\.buildings, \.\.\.membership\.instanced, \.\.\.membership\.ground, \.\.\.remainingOf\(\)/);
  assert.match(src, /membership\.water, \.\.\.membership\.glass, \.\.\.membership\.road, \.\.\.membership\.sky, \.\.\.membership\.piers, \.\.\.membership\.extras/);
  assert.match(src, /leftoverWorld\(\), \.\.\.outside/);
  assert.match(src, /setPreserve\(\)/);
  assert.match(src, /setStencil\(\)/);
  assert.match(src, /setReversed\(\)/);
  assert.match(src, /preserveDrawingBuffer = true/);
  assert.match(src, /stencil = true/);
  assert.match(src, /stencil = true/);
  assert.match(src, /reversedDepthBuffer = true/);
  assert.match(src, /preserve\(\) \{/);
  assert.match(src, /isInstancedMesh/);
  assert.match(src, /\.\.\.hideMeshes\(leftoverOf\(\)\), \.\.\.swapEnv\(gray\)/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.doesNotMatch(src, /lookAt\(p\.x, p\.y \+ 20, p\.z\)/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), bothIsCombined: true }), /psr isolation still combined with hemi/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), preserveClears: false }), /preserve isolation did not force preserveDrawingBuffer on/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), preserveHidesLeftover: false }), /preserve isolation did not hide leftover empty-scene meshes/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), bothSetsGray: false }), /both isolation did not swap gray cubemap/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), bothClearsPreserve: false }), /both isolation did not force preserveDrawingBuffer on/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), stencilClears: false }), /stencil isolation did not force stencil on/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), reversedClears: false }), /reversed isolation did not force reversedDepthBuffer on/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), packClearsPreserve: false }), /pack isolation did not force preserveDrawingBuffer on/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), envHidesLeftover: false }), /env isolation did not hide leftover empty-scene meshes/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), fovStays58: false }), /product fov retuned during psr probe/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), nearStaysProduct: false }), /product near retuned during psr probe/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), farStaysProduct: false }), /product far retuned during psr probe/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), intensityClearsIbl: true }), /psr isolation clears scene.environment via sun/);
  assert.throws(() => worldPsrResults({ ...worldPsrFixture(), psrDeltasUseEmptyBaseline: false }), /leftover g07 still uses world.group leftover as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked psr poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(PSR_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(PSR_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(PSR_FRAMES[3].night, true);
  assert.equal(dominantPsr(worldPsrFixture().frames[0].layers), 'preserve');
});

test('psr-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldPsrResults(worldPsrFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-psr evidence fails closed: ${name}`, () => {
  const r = worldPsrFixture();
  mutate(r);
  assert.throws(() => worldPsrResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldPsrFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldPsrResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldPsrFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldPsrResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during psr sampling', () => {
  const r = worldPsrFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldPsrResults(r));
});

test('invalid world-psr report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-psr-invalid-'));
  try {
    const r = worldPsrFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldPsr(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi hex off env eint back hterm nfill upper renv gleft wgi uleft nmesh ogrp tmap cam chas px fx aa sfs acm pcl psr and lcc probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldPsr \} from '\.\/world-psr-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldLcc \} from '\.\/world-lcc-browser\.mjs';/);
  assert.match(src, /verifyWorldPsr\(browser, url\)/);
  assert.match(src, /verifyWorldLcc\(browser, url\)/);
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
