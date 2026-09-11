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
  BAND_PIXELS, CAPTURE_LAYERS, FAILURE_LIMIT, FILL_IDS, IBL_IDS, LUMA_IDS, PIER_IDS, RAMP_IDS, SKY_IDS, SUN_IDS,
  UPPER_BAND_MIN, UPPER_BLUE_MIN, UPPER_FRAMES, UPPER_L2_MIN, UPPER_LAYERS, UPPER_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantUpper, envIsNotUpperMismatch, retainWorldUpper, upperBufferIsNotOriginalGolden,
  worldUpperFixture, worldUpperResults,
} from './world-upper-browser.mjs';
import { worldNfillFixture } from './world-nfill-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px nfill report without ramps vs sky vs piers is not upper mismatch', () => {
  assert.equal(envIsNotUpperMismatch({ frames: [] }), true);
  assert.equal(envIsNotUpperMismatch(worldNfillFixture()), true);
  assert.equal(envIsNotUpperMismatch(worldUpperFixture()), false);
  assert.throws(() => worldUpperResults(worldNfillFixture()), /combined remaining g07 upper ramps is not ramps vs sky vs piers mismatch/);
});

test('upper buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(upperBufferIsNotOriginalGolden(worldUpperFixture()), false);
  assert.equal(upperBufferIsNotOriginalGolden({
    ...worldUpperFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(UPPER_L2_MIN, 8);
  assert.equal(UPPER_LUMA_MIN, 8);
  assert.equal(UPPER_BLUE_MIN, 8);
  assert.equal(UPPER_BAND_MIN, 0.02);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(UPPER_LAYERS, ['ramps', 'sky', 'piers', 'fill', 'sun', 'env']);
  assert.deepEqual([...CAPTURE_LAYERS], ['ramps', 'sky', 'piers', 'fill', 'sun', 'env']);
  assert.deepEqual([...LUMA_IDS], ['fill', 'sun']);
  assert.deepEqual([...RAMP_IDS], ['ramps']);
  assert.deepEqual([...SKY_IDS], ['sky']);
  assert.deepEqual([...PIER_IDS], ['piers']);
  assert.deepEqual([...FILL_IDS], ['fill']);
  assert.deepEqual([...SUN_IDS], ['sun']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-upper-browser.mjs'), 'utf8');
  assert.match(src, /SphereGeometry/);
  assert.match(src, /radius, 8200/);
  assert.match(src, /hideMeshes\(membership\.ramps\)/);
  assert.match(src, /hideMeshes\(membership\.sky\)/);
  assert.match(src, /hideMeshes\(membership\.piers\)/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), rampsHidesRamps: false }), /ramps isolation did not hide ramp meshes/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), rampsKeepsSky: false }), /sky dome left product during ramps isolation/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), rampsKeepsPiers: false }), /pier meshes left product during ramps isolation/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), rampsKeepsFill: false }), /fill lights left product during ramps isolation/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), rampsKeepsSun: false }), /sun intensity left product during ramps isolation/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), rampsKeepsHemi: false }), /hemi.color left product during ramps isolation/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), rampsKeepsEnv: false }), /ramps isolation clears scene.environment/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), skyHidesSky: false }), /sky isolation did not hide sky dome/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), piersHidesPiers: false }), /piers isolation did not hide pier meshes/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), fillZerosFill: false }), /fill isolation did not zero fill lights/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), sunZerosSun: false }), /sun isolation did not zero sun intensity/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), intensityClearsIbl: true }), /sun isolation clears scene.environment/);
  assert.throws(() => worldUpperResults({ ...worldUpperFixture(), upperDeltasUseProductBaseline: false }), /ramps vs sky vs piers still uses hgray as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked upper poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(UPPER_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(UPPER_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(UPPER_FRAMES[3].night, true);
  assert.equal(dominantUpper(worldUpperFixture().frames[0].layers), 'ramps');
});

test('upper-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldUpperResults(worldUpperFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-upper evidence fails closed: ${name}`, () => {
  const r = worldUpperFixture();
  mutate(r);
  assert.throws(() => worldUpperResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldUpperFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldUpperResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldUpperFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldUpperResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during upper sampling', () => {
  const r = worldUpperFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldUpperResults(r));
});

test('invalid world-upper report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-upper-invalid-'));
  try {
    const r = worldUpperFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldUpper(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi hex off env eint back hterm nfill and upper probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldNfill \} from '\.\/world-nfill-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldUpper \} from '\.\/world-upper-browser\.mjs';/);
  assert.match(src, /verifyWorldNfill\(browser, url\)/);
  assert.match(src, /verifyWorldUpper\(browser, url\)/);
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
