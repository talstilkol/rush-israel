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
  BAND_PIXELS, ENC_IDS, BOTH_IDS, CAPTURE_LAYERS, FAILURE_LIMIT, MGMT_IDS, SPACE_IDS, IBL_IDS, TONE_IDS,
  TMAP_BAND_MIN, TMAP_BLUE_MIN, TMAP_FRAMES, TMAP_L2_MIN, TMAP_LAYERS, TMAP_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantTmap, leftoverIsNotTmapMismatch, tmapBufferIsNotOriginalGolden, retainWorldTmap,
  worldTmapFixture, worldTmapResults,
} from './world-tmap-browser.mjs';
import { worldOgrpFixture } from './world-ogrp-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px leftover report without remaining empty-scene vs golden independently of toneMapping vs outputColorSpace vs ColorManagement is not tmap mismatch', () => {
  assert.equal(leftoverIsNotTmapMismatch({ frames: [] }), true);
  assert.equal(leftoverIsNotTmapMismatch(worldOgrpFixture()), true);
  assert.equal(leftoverIsNotTmapMismatch(worldTmapFixture()), false);
  assert.throws(() => worldTmapResults(worldOgrpFixture()), /leftover g07 after world.group\+outside is not remaining empty-scene vs golden independently of toneMapping vs outputColorSpace vs ColorManagement mismatch/);
});

test('tmap buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(tmapBufferIsNotOriginalGolden(worldTmapFixture()), false);
  assert.equal(tmapBufferIsNotOriginalGolden({
    ...worldTmapFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(TMAP_L2_MIN, 8);
  assert.equal(TMAP_LUMA_MIN, 8);
  assert.equal(TMAP_BLUE_MIN, 8);
  assert.equal(TMAP_BAND_MIN, 0.02);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(TMAP_LAYERS, ['tone', 'space', 'mgmt', 'env', 'both', 'enc']);
  assert.deepEqual([...CAPTURE_LAYERS], ['tone', 'space', 'mgmt', 'env', 'both', 'enc']);
  assert.deepEqual([...TONE_IDS], ['tone']);
  assert.deepEqual([...SPACE_IDS], ['space']);
  assert.deepEqual([...MGMT_IDS], ['mgmt']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.deepEqual([...BOTH_IDS], ['both']);
  assert.deepEqual([...ENC_IDS], ['enc']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-tmap-browser.mjs'), 'utf8');
  assert.match(src, /SphereGeometry/);
  assert.match(src, /radius, 8200/);
  assert.match(src, /hideMeshes\(leftoverOf\(\)\)/);
  assert.match(src, /remainingOf\(\)/);
  assert.match(src, /membership\.ramps, \.\.\.membership\.buildings, \.\.\.membership\.instanced, \.\.\.membership\.ground, \.\.\.remainingOf\(\)/);
  assert.match(src, /membership\.water, \.\.\.membership\.glass, \.\.\.membership\.road, \.\.\.membership\.sky, \.\.\.membership\.piers, \.\.\.membership\.extras/);
  assert.match(src, /leftoverWorld\(\), \.\.\.outside/);
  assert.match(src, /THREE\.NoToneMapping/);
  assert.match(src, /THREE\.LinearSRGBColorSpace/);
  assert.match(src, /setMgmt\(false\)/);
  assert.match(src, /THREE\.ColorManagement\.enabled = value/);
  assert.match(src, /tone\(\) \{/);
  assert.match(src, /isInstancedMesh/);
  assert.match(src, /\.\.\.hideMeshes\(leftoverOf\(\)\), \.\.\.swapEnv\(gray\)/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), bothIsCombined: true }), /tmap isolation still combined with hemi/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), toneSetsNoToneMapping: false }), /tone isolation did not set NoToneMapping/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), toneHidesLeftover: false }), /tone isolation did not hide leftover empty-scene meshes/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), bothSetsGray: false }), /both isolation did not swap gray cubemap/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), bothSetsNoToneMapping: false }), /both isolation did not set NoToneMapping/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), spaceSetsLinear: false }), /space isolation did not set LinearSRGBColorSpace/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), mgmtDisablesColorManagement: false }), /mgmt isolation did not disable ColorManagement/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), encSetsNoToneMapping: false }), /enc isolation did not set NoToneMapping/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), envHidesLeftover: false }), /env isolation did not hide leftover empty-scene meshes/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), intensityClearsIbl: true }), /tmap isolation clears scene.environment via sun/);
  assert.throws(() => worldTmapResults({ ...worldTmapFixture(), tmapDeltasUseEmptyBaseline: false }), /leftover g07 still uses world.group leftover as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked tmap poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(TMAP_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(TMAP_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(TMAP_FRAMES[3].night, true);
  assert.equal(dominantTmap(worldTmapFixture().frames[0].layers), 'tone');
});

test('tmap-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldTmapResults(worldTmapFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-tmap evidence fails closed: ${name}`, () => {
  const r = worldTmapFixture();
  mutate(r);
  assert.throws(() => worldTmapResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldTmapFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldTmapResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldTmapFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldTmapResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during tmap sampling', () => {
  const r = worldTmapFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldTmapResults(r));
});

test('invalid world-tmap report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-tmap-invalid-'));
  try {
    const r = worldTmapFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldTmap(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi hex off env eint back hterm nfill upper renv gleft wgi uleft nmesh ogrp tmap cam and chas probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldOgrp \} from '\.\/world-ogrp-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldTmap \} from '\.\/world-tmap-browser\.mjs';/);
  assert.match(src, /verifyWorldOgrp\(browser, url\)/);
  assert.match(src, /verifyWorldTmap\(browser, url\)/);
  assert.match(src, /verifyWorldCam\(browser, url\)/);
  assert.match(src, /verifyWorldChas\(browser, url\)/);
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
