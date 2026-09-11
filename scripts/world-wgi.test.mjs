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
  BAND_PIXELS, CAPTURE_LAYERS, FAILURE_LIMIT, GLASS_IDS, GROUND_IDS, IBL_IDS, INSTANCED_IDS, ROAD_IDS, WATER_IDS,
  WATER_IOR, WGI_BAND_MIN, WGI_BLUE_MIN, WGI_FRAMES, WGI_L2_MIN, WGI_LAYERS, WGI_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantWgi, leftoverIsNotWgiMismatch, retainWorldWgi, wgiBufferIsNotOriginalGolden,
  worldWgiFixture, worldWgiResults,
} from './world-wgi-browser.mjs';
import { worldGleftFixture } from './world-gleft-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px leftover report without water vs glass vs instanced is not wgi mismatch', () => {
  assert.equal(leftoverIsNotWgiMismatch({ frames: [] }), true);
  assert.equal(leftoverIsNotWgiMismatch(worldGleftFixture()), true);
  assert.equal(leftoverIsNotWgiMismatch(worldWgiFixture()), false);
  assert.throws(() => worldWgiResults(worldGleftFixture()), /leftover g07 after ramps\+buildings is not water vs glass vs instanced mismatch/);
});

test('wgi buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(wgiBufferIsNotOriginalGolden(worldWgiFixture()), false);
  assert.equal(wgiBufferIsNotOriginalGolden({
    ...worldWgiFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(WGI_L2_MIN, 8);
  assert.equal(WGI_LUMA_MIN, 8);
  assert.equal(WGI_BLUE_MIN, 8);
  assert.equal(WGI_BAND_MIN, 0.02);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(WATER_IOR, 1.33);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(WGI_LAYERS, ['water', 'glass', 'instanced', 'ground', 'road', 'env']);
  assert.deepEqual([...CAPTURE_LAYERS], ['water', 'glass', 'instanced', 'ground', 'road', 'env']);
  assert.deepEqual([...WATER_IDS], ['water']);
  assert.deepEqual([...GLASS_IDS], ['glass']);
  assert.deepEqual([...INSTANCED_IDS], ['instanced']);
  assert.deepEqual([...GROUND_IDS], ['ground']);
  assert.deepEqual([...ROAD_IDS], ['road']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-wgi-browser.mjs'), 'utf8');
  assert.match(src, /SphereGeometry/);
  assert.match(src, /radius, 8200/);
  assert.match(src, /hideMeshes\(leftoverOf\(\)\)/);
  assert.match(src, /hideMeshes\(membership\.water\)/);
  assert.match(src, /hideMeshes\(membership\.glass\)/);
  assert.match(src, /hideMeshes\(membership\.instanced\)/);
  assert.match(src, /hideMeshes\(membership\.ground\)/);
  assert.match(src, /hideMeshes\(membership\.road\)/);
  assert.match(src, /\.\.\.hideMeshes\(leftoverOf\(\)\), \.\.\.swapEnv\(gray\)/);
  assert.match(src, /water\(\) \{/);
  assert.match(src, /isInstancedMesh/);
  assert.match(src, /isIorWater/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), bothIsCombined: true }), /wgi isolation still combined with hemi/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), waterHidesWater: false }), /water isolation did not hide water meshes/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), waterHidesLeftover: false }), /water isolation did not hide leftover ramps\+buildings/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), glassHidesGlass: false }), /glass isolation did not hide glass meshes/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), instancedHidesInstanced: false }), /instanced isolation did not hide instanced meshes/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), groundHidesGround: false }), /ground isolation did not hide ground mesh/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), groundHidesLeftover: false }), /ground isolation did not hide leftover ramps\+buildings/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), roadHidesRoad: false }), /road isolation did not hide road meshes/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), envHidesLeftover: false }), /env isolation did not hide leftover ramps\+buildings/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), intensityClearsIbl: true }), /wgi isolation clears scene.environment via sun/);
  assert.throws(() => worldWgiResults({ ...worldWgiFixture(), wgiDeltasUseBuildingsBaseline: false }), /leftover g07 still uses ramps-only leftover as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked wgi poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(WGI_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(WGI_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(WGI_FRAMES[3].night, true);
  assert.equal(dominantWgi(worldWgiFixture().frames[0].layers), 'water');
});

test('wgi-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldWgiResults(worldWgiFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-wgi evidence fails closed: ${name}`, () => {
  const r = worldWgiFixture();
  mutate(r);
  assert.throws(() => worldWgiResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldWgiFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldWgiResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldWgiFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldWgiResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during wgi sampling', () => {
  const r = worldWgiFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldWgiResults(r));
});

test('invalid world-wgi report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-wgi-invalid-'));
  try {
    const r = worldWgiFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldWgi(r, out));
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
  assert.match(src, /import \{ verifyWorldGleft \} from '\.\/world-gleft-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldWgi \} from '\.\/world-wgi-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldUleft \} from '\.\/world-uleft-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldNmesh \} from '\.\/world-nmesh-browser\.mjs';/);
  assert.match(src, /verifyWorldGleft\(browser, url\)/);
  assert.match(src, /verifyWorldWgi\(browser, url\)/);
  assert.match(src, /verifyWorldUleft\(browser, url\)/);
  assert.match(src, /verifyWorldNmesh\(browser, url\)/);
  assert.match(src, /verifyWorldOgrp\(browser, url\)/);
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
