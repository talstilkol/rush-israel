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
  BAND_PIXELS, BLOB_IDS, BOTH_IDS, CAPTURE_LAYERS, FAILURE_LIMIT, FX_IDS, HERO_IDS, IBL_IDS, OUTSIDE_IDS,
  OGRP_BAND_MIN, OGRP_BLUE_MIN, OGRP_FRAMES, OGRP_L2_MIN, OGRP_LAYERS, OGRP_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantOgrp, leftoverIsNotOgrpMismatch, ogrpBufferIsNotOriginalGolden, retainWorldOgrp,
  worldOgrpFixture, worldOgrpResults,
} from './world-ogrp-browser.mjs';
import { worldNmeshFixture } from './world-nmesh-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px leftover report without remaining occupancy outside world.group vs env is not ogrp mismatch', () => {
  assert.equal(leftoverIsNotOgrpMismatch({ frames: [] }), true);
  assert.equal(leftoverIsNotOgrpMismatch(worldNmeshFixture()), true);
  assert.equal(leftoverIsNotOgrpMismatch(worldOgrpFixture()), false);
  assert.throws(() => worldOgrpResults(worldNmeshFixture()), /leftover g07 after all world.group meshes is not remaining occupancy outside world.group vs env mismatch/);
});

test('ogrp buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(ogrpBufferIsNotOriginalGolden(worldOgrpFixture()), false);
  assert.equal(ogrpBufferIsNotOriginalGolden({
    ...worldOgrpFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(OGRP_L2_MIN, 8);
  assert.equal(OGRP_LUMA_MIN, 8);
  assert.equal(OGRP_BLUE_MIN, 8);
  assert.equal(OGRP_BAND_MIN, 0.02);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(OGRP_LAYERS, ['outside', 'env', 'both', 'hero', 'fx', 'blob']);
  assert.deepEqual([...CAPTURE_LAYERS], ['outside', 'env', 'both', 'hero', 'fx', 'blob']);
  assert.deepEqual([...OUTSIDE_IDS], ['outside']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.deepEqual([...BOTH_IDS], ['both']);
  assert.deepEqual([...HERO_IDS], ['hero']);
  assert.deepEqual([...FX_IDS], ['fx']);
  assert.deepEqual([...BLOB_IDS], ['blob']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-ogrp-browser.mjs'), 'utf8');
  assert.match(src, /SphereGeometry/);
  assert.match(src, /radius, 8200/);
  assert.match(src, /hideMeshes\(leftoverOf\(\)\)/);
  assert.match(src, /remainingOf\(\)/);
  assert.match(src, /membership\.ramps, \.\.\.membership\.buildings, \.\.\.membership\.instanced, \.\.\.membership\.ground, \.\.\.remainingOf\(\)/);
  assert.match(src, /membership\.water, \.\.\.membership\.glass, \.\.\.membership\.road, \.\.\.membership\.sky, \.\.\.membership\.piers, \.\.\.membership\.extras/);
  assert.match(src, /hideMeshes\(outside\)/);
  assert.match(src, /hideMeshes\(hero\)/);
  assert.match(src, /hideMeshes\(fx\)/);
  assert.match(src, /hideMeshes\(blob\)/);
  assert.match(src, /engine\.visuals\?\.\[0\]\?\.group/);
  assert.match(src, /outside\(\) \{/);
  assert.match(src, /isInstancedMesh/);
  assert.match(src, /\.\.\.hideMeshes\(leftoverOf\(\)\), \.\.\.swapEnv\(gray\)/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), bothIsCombined: true }), /ogrp isolation still combined with hemi/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), outsideHidesOutside: false }), /outside isolation did not hide meshes outside world.group/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), outsideHidesLeftover: false }), /outside isolation did not hide leftover world.group meshes/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), bothHidesOutside: false }), /both isolation did not hide meshes outside world.group/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), bothSetsGray: false }), /both isolation did not swap gray cubemap/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), heroHidesHero: false }), /hero isolation did not hide hero-car meshes/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), fxHidesFx: false }), /fx isolation did not hide fx meshes/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), blobHidesBlob: false }), /blob isolation did not hide blob meshes/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), envHidesLeftover: false }), /env isolation did not hide leftover world.group meshes/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), intensityClearsIbl: true }), /ogrp isolation clears scene.environment via sun/);
  assert.throws(() => worldOgrpResults({ ...worldOgrpFixture(), ogrpDeltasUseEmptyBaseline: false }), /leftover g07 still uses ramps\+buildings\+instanced\+ground leftover as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked ogrp poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(OGRP_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(OGRP_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(OGRP_FRAMES[3].night, true);
  assert.equal(dominantOgrp(worldOgrpFixture().frames[0].layers), 'outside');
});

test('ogrp-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldOgrpResults(worldOgrpFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-ogrp evidence fails closed: ${name}`, () => {
  const r = worldOgrpFixture();
  mutate(r);
  assert.throws(() => worldOgrpResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldOgrpFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldOgrpResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldOgrpFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldOgrpResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during ogrp sampling', () => {
  const r = worldOgrpFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldOgrpResults(r));
});

test('invalid world-ogrp report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-ogrp-invalid-'));
  try {
    const r = worldOgrpFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldOgrp(r, out));
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
  assert.match(src, /import \{ verifyWorldNmesh \} from '\.\/world-nmesh-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldOgrp \} from '\.\/world-ogrp-browser\.mjs';/);
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
