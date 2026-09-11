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
  BAND_PIXELS, PACK_IDS, BOTH_IDS, CAPTURE_LAYERS, FAILURE_LIMIT, INTERSECT_IDS, SHADOWS_IDS, IBL_IDS, LOCAL_IDS,
  LCC_BAND_MIN, LCC_BLUE_MIN, LCC_FRAMES, LCC_L2_MIN, LCC_LAYERS, LCC_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_FOV, PRODUCT_NEAR, PRODUCT_FAR_MIN,
  PRODUCT_FOLLOW, PRODUCT_HEIGHT, PRODUCT_PIXEL_RATIO, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  PRODUCT_LOCAL, PRODUCT_SHADOWS, PRODUCT_INTERSECT,
  dominantLcc, leftoverIsNotLccMismatch, lccBufferIsNotOriginalGolden, retainWorldLcc,
  worldLccFixture, worldLccResults,
} from './world-lcc-browser.mjs';
import { worldPsrFixture } from './world-psr-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px leftover report without remaining empty-scene vs golden independently of localClippingEnabled vs clipShadows vs clipIntersection is not lcc mismatch', () => {
  assert.equal(leftoverIsNotLccMismatch({ frames: [] }), true);
  assert.equal(leftoverIsNotLccMismatch(worldPsrFixture()), true);
  assert.equal(leftoverIsNotLccMismatch(worldLccFixture()), false);
  assert.throws(() => worldLccResults(worldPsrFixture()), /leftover g07 after world.group\+outside is not remaining empty-scene vs golden independently of localClippingEnabled vs clipShadows vs clipIntersection mismatch/);
});

test('lcc buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(lccBufferIsNotOriginalGolden(worldLccFixture()), false);
  assert.equal(lccBufferIsNotOriginalGolden({
    ...worldLccFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(LCC_L2_MIN, 8);
  assert.equal(LCC_LUMA_MIN, 8);
  assert.equal(LCC_BLUE_MIN, 8);
  assert.equal(LCC_BAND_MIN, 0.02);
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
  assert.equal(PRODUCT_LOCAL, false);
  assert.equal(PRODUCT_SHADOWS, false);
  assert.equal(PRODUCT_INTERSECT, false);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(LCC_LAYERS, ['local', 'shadows', 'intersect', 'env', 'both', 'pack']);
  assert.deepEqual([...CAPTURE_LAYERS], ['local', 'shadows', 'intersect', 'env', 'both', 'pack']);
  assert.deepEqual([...LOCAL_IDS], ['local']);
  assert.deepEqual([...SHADOWS_IDS], ['shadows']);
  assert.deepEqual([...INTERSECT_IDS], ['intersect']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.deepEqual([...BOTH_IDS], ['both']);
  assert.deepEqual([...PACK_IDS], ['pack']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-lcc-browser.mjs'), 'utf8');
  assert.match(src, /SphereGeometry/);
  assert.match(src, /radius, 8200/);
  assert.match(src, /hideMeshes\(leftoverOf\(\)\)/);
  assert.match(src, /remainingOf\(\)/);
  assert.match(src, /membership\.ramps, \.\.\.membership\.buildings, \.\.\.membership\.instanced, \.\.\.membership\.ground, \.\.\.remainingOf\(\)/);
  assert.match(src, /membership\.water, \.\.\.membership\.glass, \.\.\.membership\.road, \.\.\.membership\.sky, \.\.\.membership\.piers, \.\.\.membership\.extras/);
  assert.match(src, /leftoverWorld\(\), \.\.\.outside/);
  assert.match(src, /setLocal\(\)/);
  assert.match(src, /setShadows\(\)/);
  assert.match(src, /setIntersect\(\)/);
  assert.match(src, /localClippingEnabled = true/);
  assert.match(src, /clipShadows = true/);
  assert.match(src, /clipShadows = true/);
  assert.match(src, /clipIntersection = true/);
  assert.match(src, /local\(\) \{/);
  assert.match(src, /isInstancedMesh/);
  assert.match(src, /\.\.\.hideMeshes\(leftoverOf\(\)\), \.\.\.swapEnv\(gray\)/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.doesNotMatch(src, /lookAt\(p\.x, p\.y \+ 20, p\.z\)/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), bothIsCombined: true }), /lcc isolation still combined with hemi/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), localClears: false }), /local isolation did not force localClippingEnabled on/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), localHidesLeftover: false }), /local isolation did not hide leftover empty-scene meshes/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), bothSetsGray: false }), /both isolation did not swap gray cubemap/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), bothClearsLocal: false }), /both isolation did not force localClippingEnabled on/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), shadowsClears: false }), /shadows isolation did not force clipShadows on/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), intersectClears: false }), /intersect isolation did not force clipIntersection on/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), packClearsLocal: false }), /pack isolation did not force localClippingEnabled on/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), envHidesLeftover: false }), /env isolation did not hide leftover empty-scene meshes/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), fovStays58: false }), /product fov retuned during lcc probe/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), nearStaysProduct: false }), /product near retuned during lcc probe/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), farStaysProduct: false }), /product far retuned during lcc probe/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), intensityClearsIbl: true }), /lcc isolation clears scene.environment via sun/);
  assert.throws(() => worldLccResults({ ...worldLccFixture(), lccDeltasUseEmptyBaseline: false }), /leftover g07 still uses world.group leftover as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked lcc poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(LCC_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(LCC_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(LCC_FRAMES[3].night, true);
  assert.equal(dominantLcc(worldLccFixture().frames[0].layers), 'local');
});

test('lcc-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldLccResults(worldLccFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-lcc evidence fails closed: ${name}`, () => {
  const r = worldLccFixture();
  mutate(r);
  assert.throws(() => worldLccResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldLccFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldLccResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldLccFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldLccResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during lcc sampling', () => {
  const r = worldLccFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldLccResults(r));
});

test('invalid world-lcc report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-lcc-invalid-'));
  try {
    const r = worldLccFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldLcc(r, out));
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
