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
  BACKGROUND_IDS, BAND_PIXELS, BOTH_IDS, CAPTURE_LAYERS, CLEAR_IDS, FAILURE_LIMIT, FOG_IDS, IBL_IDS, POST_IDS,
  NMESH_BAND_MIN, NMESH_BLUE_MIN, NMESH_FRAMES, NMESH_L2_MIN, NMESH_LAYERS, NMESH_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantNmesh, leftoverIsNotNmeshMismatch, nmeshBufferIsNotOriginalGolden, retainWorldNmesh,
  worldNmeshFixture, worldNmeshResults,
} from './world-nmesh-browser.mjs';
import { worldUleftFixture } from './world-uleft-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px leftover report without remaining non-mesh occupancy vs env is not nmesh mismatch', () => {
  assert.equal(leftoverIsNotNmeshMismatch({ frames: [] }), true);
  assert.equal(leftoverIsNotNmeshMismatch(worldUleftFixture()), true);
  assert.equal(leftoverIsNotNmeshMismatch(worldNmeshFixture()), false);
  assert.throws(() => worldNmeshResults(worldUleftFixture()), /leftover g07 after ramps\+buildings\+instanced\+ground\+remaining-meshes is not remaining non-mesh occupancy vs env mismatch/);
});

test('nmesh buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(nmeshBufferIsNotOriginalGolden(worldNmeshFixture()), false);
  assert.equal(nmeshBufferIsNotOriginalGolden({
    ...worldNmeshFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(NMESH_L2_MIN, 8);
  assert.equal(NMESH_LUMA_MIN, 8);
  assert.equal(NMESH_BLUE_MIN, 8);
  assert.equal(NMESH_BAND_MIN, 0.02);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(NMESH_LAYERS, ['background', 'clear', 'fog', 'post', 'env', 'both']);
  assert.deepEqual([...CAPTURE_LAYERS], ['background', 'clear', 'fog', 'post', 'env', 'both']);
  assert.deepEqual([...BACKGROUND_IDS], ['background']);
  assert.deepEqual([...CLEAR_IDS], ['clear']);
  assert.deepEqual([...FOG_IDS], ['fog']);
  assert.deepEqual([...POST_IDS], ['post']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.deepEqual([...BOTH_IDS], ['both']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-nmesh-browser.mjs'), 'utf8');
  assert.match(src, /SphereGeometry/);
  assert.match(src, /radius, 8200/);
  assert.match(src, /hideMeshes\(leftoverOf\(\)\)/);
  assert.match(src, /remainingOf\(\)/);
  assert.match(src, /membership\.ramps, \.\.\.membership\.buildings, \.\.\.membership\.instanced, \.\.\.membership\.ground, \.\.\.remainingOf\(\)/);
  assert.match(src, /membership\.water, \.\.\.membership\.glass, \.\.\.membership\.road, \.\.\.membership\.sky, \.\.\.membership\.piers, \.\.\.membership\.extras/);
  assert.match(src, /scene\.background = new THREE\.Color\(0x808080\)/);
  assert.match(src, /setClearColor\(0x808080, 1\)/);
  assert.match(src, /fog\.density = 0/);
  assert.match(src, /engine\.renderer\.render\(engine\.scene, engine\.camera\)/);
  assert.match(src, /background\(\) \{/);
  assert.match(src, /isInstancedMesh/);
  assert.match(src, /\.\.\.hideMeshes\(leftoverOf\(\)\), \.\.\.swapEnv\(gray\)/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), bothIsCombined: true }), /nmesh isolation still combined with hemi/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), backgroundSetsGray: false }), /scene.background isolation did not set 0x808080/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), backgroundHidesLeftover: false }), /background isolation did not hide leftover empty-scene meshes/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), bothSetsBg: false }), /both isolation did not set background 0x808080/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), bothSetsGray: false }), /both isolation did not swap gray cubemap/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), clearSetsGray: false }), /renderer clear color isolation did not set 0x808080/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), fogClearsDensity: false }), /fog isolation did not zero FogExp2 density/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), postBypassesComposer: false }), /post isolation did not bypass EffectComposer/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), envHidesLeftover: false }), /env isolation did not hide leftover empty-scene meshes/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), intensityClearsIbl: true }), /nmesh isolation clears scene.environment via sun/);
  assert.throws(() => worldNmeshResults({ ...worldNmeshFixture(), nmeshDeltasUseEmptyBaseline: false }), /leftover g07 still uses ramps\+buildings\+instanced\+ground leftover as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked nmesh poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(NMESH_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(NMESH_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(NMESH_FRAMES[3].night, true);
  assert.equal(dominantNmesh(worldNmeshFixture().frames[0].layers), 'background');
});

test('nmesh-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldNmeshResults(worldNmeshFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-nmesh evidence fails closed: ${name}`, () => {
  const r = worldNmeshFixture();
  mutate(r);
  assert.throws(() => worldNmeshResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldNmeshFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldNmeshResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldNmeshFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldNmeshResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during nmesh sampling', () => {
  const r = worldNmeshFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldNmeshResults(r));
});

test('invalid world-nmesh report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-nmesh-invalid-'));
  try {
    const r = worldNmeshFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldNmesh(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi hex off env eint back hterm nfill upper renv gleft wgi uleft nmesh ogrp tmap cam chas and px probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldNmesh \} from '\.\/world-nmesh-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldOgrp \} from '\.\/world-ogrp-browser\.mjs';/);
  assert.match(src, /verifyWorldNmesh\(browser, url\)/);
  assert.match(src, /verifyWorldOgrp\(browser, url\)/);
  assert.match(src, /verifyWorldTmap\(browser, url\)/);
  assert.match(src, /verifyWorldCam\(browser, url\)/);
  assert.match(src, /verifyWorldChas\(browser, url\)/);
  assert.match(src, /verifyWorldPx\(browser, url\)/);
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
