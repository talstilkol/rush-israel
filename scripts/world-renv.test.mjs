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
  BAND_PIXELS, BOTH_IDS, CAPTURE_LAYERS, FAILURE_LIMIT, IBL_IDS, LEFT_IDS, PIER_IDS, RAMP_IDS, SKY_IDS,
  RENV_BAND_MIN, RENV_BLUE_MIN, RENV_FRAMES, RENV_L2_MIN, RENV_LAYERS, RENV_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantRenv, envIsNotRenvMismatch, retainWorldRenv, renvBufferIsNotOriginalGolden,
  worldRenvFixture, worldRenvResults,
} from './world-renv-browser.mjs';
import { worldUpperFixture } from './world-upper-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px upper report without env vs leftover is not renv mismatch', () => {
  assert.equal(envIsNotRenvMismatch({ frames: [] }), true);
  assert.equal(envIsNotRenvMismatch(worldUpperFixture()), true);
  assert.equal(envIsNotRenvMismatch(worldRenvFixture()), false);
  assert.throws(() => worldRenvResults(worldUpperFixture()), /combined remaining g07 after ramps is not env vs leftover mismatch/);
});

test('renv buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(renvBufferIsNotOriginalGolden(worldRenvFixture()), false);
  assert.equal(renvBufferIsNotOriginalGolden({
    ...worldRenvFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(RENV_L2_MIN, 8);
  assert.equal(RENV_LUMA_MIN, 8);
  assert.equal(RENV_BLUE_MIN, 8);
  assert.equal(RENV_BAND_MIN, 0.02);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(RENV_LAYERS, ['ramps', 'env', 'both', 'left', 'sky', 'piers']);
  assert.deepEqual([...CAPTURE_LAYERS], ['ramps', 'env', 'both', 'left', 'sky', 'piers']);
  assert.deepEqual([...RAMP_IDS], ['ramps']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.deepEqual([...BOTH_IDS], ['both']);
  assert.deepEqual([...LEFT_IDS], ['left']);
  assert.deepEqual([...SKY_IDS], ['sky']);
  assert.deepEqual([...PIER_IDS], ['piers']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-renv-browser.mjs'), 'utf8');
  assert.match(src, /SphereGeometry/);
  assert.match(src, /radius, 8200/);
  assert.match(src, /hideMeshes\(membership\.ramps\)/);
  assert.match(src, /hideMeshes\(membership\.sky\)/);
  assert.match(src, /hideMeshes\(membership\.piers\)/);
  assert.match(src, /\.\.\.hideMeshes\(membership\.ramps\), \.\.\.swapEnv\(gray\)/);
  assert.match(src, /left\(\) \{/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), bothIsCombined: true }), /ramps plus env isolation still combined with hemi/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), rampsHidesRamps: false }), /ramps isolation did not hide ramp meshes/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), rampsKeepsEnv: false }), /ramps isolation clears scene.environment/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), envKeepsRamps: false }), /ramp meshes left product during scene.environment isolation/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), bothHidesRamps: false }), /both isolation did not hide ramp meshes/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), bothSetsGray: false }), /both isolation did not swap gray cubemap/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), leftHidesRamps: false }), /leftover isolation did not hide ramp meshes/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), leftSetsGray: false }), /leftover isolation did not swap gray cubemap/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), leftHidesSky: false }), /leftover isolation did not hide sky dome/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), leftHidesPiers: false }), /leftover isolation did not hide pier meshes/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), skyHidesSky: false }), /sky isolation did not hide sky dome/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), piersHidesPiers: false }), /piers isolation did not hide pier meshes/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), intensityClearsIbl: true }), /renv isolation clears scene.environment via sun/);
  assert.throws(() => worldRenvResults({ ...worldRenvFixture(), renvDeltasUseProductBaseline: false }), /env vs leftover still uses hgray as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked renv poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(RENV_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(RENV_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(RENV_FRAMES[3].night, true);
  assert.equal(dominantRenv(worldRenvFixture().frames[0].layers), 'both');
});

test('renv-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldRenvResults(worldRenvFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-renv evidence fails closed: ${name}`, () => {
  const r = worldRenvFixture();
  mutate(r);
  assert.throws(() => worldRenvResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldRenvFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldRenvResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldRenvFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldRenvResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during renv sampling', () => {
  const r = worldRenvFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldRenvResults(r));
});

test('invalid world-renv report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-renv-invalid-'));
  try {
    const r = worldRenvFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldRenv(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi hex off env eint back hterm nfill upper renv and gleft probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldRenv \} from '\.\/world-renv-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldGleft \} from '\.\/world-gleft-browser\.mjs';/);
  assert.match(src, /verifyWorldRenv\(browser, url\)/);
  assert.match(src, /verifyWorldGleft\(browser, url\)/);
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
