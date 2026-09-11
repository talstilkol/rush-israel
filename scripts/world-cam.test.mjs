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
  BAND_PIXELS, CLIP_IDS, BOTH_IDS, CAPTURE_LAYERS, FAILURE_LIMIT, FAR_IDS, NEAR_IDS, IBL_IDS, FOV_IDS,
  CAM_BAND_MIN, CAM_BLUE_MIN, CAM_FRAMES, CAM_L2_MIN, CAM_LAYERS, CAM_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_FOV, PRODUCT_NEAR, PRODUCT_FAR_MIN,
  PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX, WIDE_FOV, CLIP_NEAR, CLIP_FAR,
  dominantCam, leftoverIsNotCamMismatch, camBufferIsNotOriginalGolden, retainWorldCam,
  worldCamFixture, worldCamResults,
} from './world-cam-browser.mjs';
import { worldTmapFixture } from './world-tmap-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px leftover report without remaining empty-scene vs golden independently of camera fov vs near vs far is not cam mismatch', () => {
  assert.equal(leftoverIsNotCamMismatch({ frames: [] }), true);
  assert.equal(leftoverIsNotCamMismatch(worldTmapFixture()), true);
  assert.equal(leftoverIsNotCamMismatch(worldCamFixture()), false);
  assert.throws(() => worldCamResults(worldTmapFixture()), /leftover g07 after world.group\+outside is not remaining empty-scene vs golden independently of camera fov vs near vs far mismatch/);
});

test('cam buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(camBufferIsNotOriginalGolden(worldCamFixture()), false);
  assert.equal(camBufferIsNotOriginalGolden({
    ...worldCamFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(CAM_L2_MIN, 8);
  assert.equal(CAM_LUMA_MIN, 8);
  assert.equal(CAM_BLUE_MIN, 8);
  assert.equal(CAM_BAND_MIN, 0.02);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(PRODUCT_FOV, 58);
  assert.equal(PRODUCT_NEAR, 0.28);
  assert.equal(PRODUCT_FAR_MIN, 10000);
  assert.equal(WIDE_FOV, 90);
  assert.equal(CLIP_NEAR, 8);
  assert.equal(CLIP_FAR, 80);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(CAM_LAYERS, ['fov', 'near', 'far', 'env', 'both', 'clip']);
  assert.deepEqual([...CAPTURE_LAYERS], ['fov', 'near', 'far', 'env', 'both', 'clip']);
  assert.deepEqual([...FOV_IDS], ['fov']);
  assert.deepEqual([...NEAR_IDS], ['near']);
  assert.deepEqual([...FAR_IDS], ['far']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.deepEqual([...BOTH_IDS], ['both']);
  assert.deepEqual([...CLIP_IDS], ['clip']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-cam-browser.mjs'), 'utf8');
  assert.match(src, /SphereGeometry/);
  assert.match(src, /radius, 8200/);
  assert.match(src, /hideMeshes\(leftoverOf\(\)\)/);
  assert.match(src, /remainingOf\(\)/);
  assert.match(src, /membership\.ramps, \.\.\.membership\.buildings, \.\.\.membership\.instanced, \.\.\.membership\.ground, \.\.\.remainingOf\(\)/);
  assert.match(src, /membership\.water, \.\.\.membership\.glass, \.\.\.membership\.road, \.\.\.membership\.sky, \.\.\.membership\.piers, \.\.\.membership\.extras/);
  assert.match(src, /leftoverWorld\(\), \.\.\.outside/);
  assert.match(src, /setFov\(90\)/);
  assert.match(src, /setNear\(8\)/);
  assert.match(src, /setFar\(80\)/);
  assert.match(src, /updateProjectionMatrix\(\)/);
  assert.match(src, /fov\(\) \{/);
  assert.match(src, /isInstancedMesh/);
  assert.match(src, /\.\.\.hideMeshes\(leftoverOf\(\)\), \.\.\.swapEnv\(gray\)/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), bothIsCombined: true }), /cam isolation still combined with hemi/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), fovSetsWide: false }), /fov isolation did not set wide fov/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), fovHidesLeftover: false }), /fov isolation did not hide leftover empty-scene meshes/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), bothSetsGray: false }), /both isolation did not swap gray cubemap/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), bothSetsWide: false }), /both isolation did not set wide fov/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), nearSetsClip: false }), /near isolation did not set clip near/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), farSetsClip: false }), /far isolation did not set clip far/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), clipSetsWide: false }), /clip isolation did not set wide fov/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), envHidesLeftover: false }), /env isolation did not hide leftover empty-scene meshes/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), fovStays58: false }), /product fov retuned during cam probe/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), nearStaysProduct: false }), /product near retuned during cam probe/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), farStaysProduct: false }), /product far retuned during cam probe/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), intensityClearsIbl: true }), /cam isolation clears scene.environment via sun/);
  assert.throws(() => worldCamResults({ ...worldCamFixture(), camDeltasUseEmptyBaseline: false }), /leftover g07 still uses world.group leftover as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked cam poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(CAM_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(CAM_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(CAM_FRAMES[3].night, true);
  assert.equal(dominantCam(worldCamFixture().frames[0].layers), 'fov');
});

test('cam-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldCamResults(worldCamFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-cam evidence fails closed: ${name}`, () => {
  const r = worldCamFixture();
  mutate(r);
  assert.throws(() => worldCamResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldCamFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldCamResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldCamFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldCamResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during cam sampling', () => {
  const r = worldCamFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldCamResults(r));
});

test('invalid world-cam report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-cam-invalid-'));
  try {
    const r = worldCamFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldCam(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi hex off env eint back hterm nfill upper renv gleft wgi uleft nmesh ogrp tmap and cam probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldTmap \} from '\.\/world-tmap-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldCam \} from '\.\/world-cam-browser\.mjs';/);
  assert.match(src, /verifyWorldTmap\(browser, url\)/);
  assert.match(src, /verifyWorldCam\(browser, url\)/);
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
