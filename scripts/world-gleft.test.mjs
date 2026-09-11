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
  BAND_PIXELS, BUILDING_IDS, CAPTURE_LAYERS, FAILURE_LIMIT, GROUND_IDS, IBL_IDS, PIER_IDS, ROAD_IDS, SKY_IDS,
  GLEFT_BAND_MIN, GLEFT_BLUE_MIN, GLEFT_FRAMES, GLEFT_L2_MIN, GLEFT_LAYERS, GLEFT_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantGleft, leftoverIsNotGleftMismatch, retainWorldGleft, gleftBufferIsNotOriginalGolden,
  worldGleftFixture, worldGleftResults,
} from './world-gleft-browser.mjs';
import { worldRenvFixture } from './world-renv-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px leftover report without road vs buildings vs ground is not gleft mismatch', () => {
  assert.equal(leftoverIsNotGleftMismatch({ frames: [] }), true);
  assert.equal(leftoverIsNotGleftMismatch(worldRenvFixture()), true);
  assert.equal(leftoverIsNotGleftMismatch(worldGleftFixture()), false);
  assert.throws(() => worldGleftResults(worldRenvFixture()), /leftover g07 after ramps is not road vs buildings vs ground mismatch/);
});

test('gleft buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(gleftBufferIsNotOriginalGolden(worldGleftFixture()), false);
  assert.equal(gleftBufferIsNotOriginalGolden({
    ...worldGleftFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(GLEFT_L2_MIN, 8);
  assert.equal(GLEFT_LUMA_MIN, 8);
  assert.equal(GLEFT_BLUE_MIN, 8);
  assert.equal(GLEFT_BAND_MIN, 0.02);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(GLEFT_LAYERS, ['road', 'buildings', 'ground', 'env', 'sky', 'piers']);
  assert.deepEqual([...CAPTURE_LAYERS], ['road', 'buildings', 'ground', 'env', 'sky', 'piers']);
  assert.deepEqual([...ROAD_IDS], ['road']);
  assert.deepEqual([...BUILDING_IDS], ['buildings']);
  assert.deepEqual([...GROUND_IDS], ['ground']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.deepEqual([...SKY_IDS], ['sky']);
  assert.deepEqual([...PIER_IDS], ['piers']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-gleft-browser.mjs'), 'utf8');
  assert.match(src, /SphereGeometry/);
  assert.match(src, /radius, 8200/);
  assert.match(src, /hideMeshes\(membership\.ramps\)/);
  assert.match(src, /hideMeshes\(membership\.road\)/);
  assert.match(src, /hideMeshes\(membership\.buildings\)/);
  assert.match(src, /hideMeshes\(membership\.ground\)/);
  assert.match(src, /hideMeshes\(membership\.sky\)/);
  assert.match(src, /hideMeshes\(membership\.piers\)/);
  assert.match(src, /\.\.\.hideMeshes\(membership\.ramps\), \.\.\.swapEnv\(gray\)/);
  assert.match(src, /buildings\(\) \{/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), bothIsCombined: true }), /gleft isolation still combined with hemi/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), roadHidesRoad: false }), /road isolation did not hide road meshes/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), roadHidesRamps: false }), /road isolation did not hide ramp meshes/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), buildingsHidesBuildings: false }), /buildings isolation did not hide building meshes/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), buildingsHidesRamps: false }), /buildings isolation did not hide ramp meshes/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), groundHidesGround: false }), /ground isolation did not hide ground mesh/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), groundHidesRamps: false }), /ground isolation did not hide ramp meshes/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), envHidesRamps: false }), /env isolation did not hide ramp meshes/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), skyHidesSky: false }), /sky isolation did not hide sky dome/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), piersHidesPiers: false }), /piers isolation did not hide pier meshes/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), intensityClearsIbl: true }), /gleft isolation clears scene.environment via sun/);
  assert.throws(() => worldGleftResults({ ...worldGleftFixture(), gleftDeltasUseRampsBaseline: false }), /leftover g07 still uses product present as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked gleft poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(GLEFT_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(GLEFT_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(GLEFT_FRAMES[3].night, true);
  assert.equal(dominantGleft(worldGleftFixture().frames[0].layers), 'buildings');
});

test('gleft-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldGleftResults(worldGleftFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-gleft evidence fails closed: ${name}`, () => {
  const r = worldGleftFixture();
  mutate(r);
  assert.throws(() => worldGleftResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldGleftFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldGleftResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldGleftFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldGleftResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during gleft sampling', () => {
  const r = worldGleftFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldGleftResults(r));
});

test('invalid world-gleft report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-gleft-invalid-'));
  try {
    const r = worldGleftFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldGleft(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi hex off env eint back hterm nfill upper renv gleft wgi uleft nmesh ogrp and tmap probes', () => {
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
