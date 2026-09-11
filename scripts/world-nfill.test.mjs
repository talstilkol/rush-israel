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
  BAND_PIXELS, BOTH_IDS, CAPTURE_LAYERS, FAILURE_LIMIT, FILL_IDS, HCOL_IDS, HINT_IDS, IBL_IDS, LUMA_IDS,
  NFILL_BLUE_MIN, NFILL_FRAMES, NFILL_L2_MIN, NFILL_LAYERS, NFILL_LUMA_MIN, SUN_IDS,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantNfill, envIsNotNfillMismatch, nfillBufferIsNotOriginalGolden, retainWorldNfill,
  worldNfillFixture, worldNfillResults,
} from './world-nfill-browser.mjs';
import { worldHtermFixture } from './world-hterm-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px hterm report without fill vs sun vs both is not nfill mismatch', () => {
  assert.equal(envIsNotNfillMismatch({ frames: [] }), true);
  assert.equal(envIsNotNfillMismatch(worldHtermFixture()), true);
  assert.equal(envIsNotNfillMismatch(worldNfillFixture()), false);
  assert.throws(() => worldNfillResults(worldHtermFixture()), /combined remaining g08 night fill vs sun intensity is not fill vs sun vs both mismatch/);
});

test('nfill buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(nfillBufferIsNotOriginalGolden(worldNfillFixture()), false);
  assert.equal(nfillBufferIsNotOriginalGolden({
    ...worldNfillFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(NFILL_L2_MIN, 8);
  assert.equal(NFILL_LUMA_MIN, 8);
  assert.equal(NFILL_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(NFILL_LAYERS, ['fill', 'sun', 'both', 'hcol', 'env', 'hint']);
  assert.deepEqual([...CAPTURE_LAYERS], ['fill', 'sun', 'both', 'hcol', 'env', 'hint']);
  assert.deepEqual([...LUMA_IDS], ['fill', 'sun', 'both']);
  assert.deepEqual([...FILL_IDS], ['fill']);
  assert.deepEqual([...SUN_IDS], ['sun']);
  assert.deepEqual([...BOTH_IDS], ['both']);
  assert.deepEqual([...HCOL_IDS], ['hcol']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.deepEqual([...HINT_IDS], ['hint']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-nfill-browser.mjs'), 'utf8');
  assert.match(src, /object === sun/);
  assert.match(src, /object !== sun && object !== sunNear/);
  assert.match(src, /light\.color\.setHex\(0x808080\)/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), bothIsCombined: true }), /fill plus sun isolation still combined with hemi/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), fillZerosFill: false }), /fill isolation did not zero fill lights/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), fillKeepsSun: false }), /sun intensity left product during fill isolation/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), fillKeepsHemi: false }), /hemi.color left product during fill isolation/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), fillKeepsEnv: false }), /fill isolation clears scene.environment/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), sunZerosSun: false }), /sun isolation did not zero sun intensity/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), sunKeepsFill: false }), /fill lights left product during sun isolation/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), sunKeepsHemi: false }), /hemi.color left product during sun isolation/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), sunKeepsEnv: false }), /sun isolation clears scene.environment/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), bothZerosFill: false }), /both isolation did not zero fill lights/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), bothZerosSun: false }), /both isolation did not zero sun intensity/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), bothKeepsHemi: false }), /hemi.color left product during both isolation/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), bothKeepsEnv: false }), /both isolation clears scene.environment/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), hcolSetsGray: false }), /hemi.color isolation did not set 0x808080/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), hintZerosIntensity: false }), /hemi.intensity isolation did not zero intensity/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), intensityClearsIbl: true }), /sun isolation clears scene.environment/);
  assert.throws(() => worldNfillResults({ ...worldNfillFixture(), nfillDeltasUseProductBaseline: false }), /fill vs sun vs both still uses hgray as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked nfill poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(NFILL_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(NFILL_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(NFILL_FRAMES[3].night, true);
  assert.equal(dominantNfill(worldNfillFixture().frames[0].layers), 'both');
});

test('nfill-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldNfillResults(worldNfillFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-nfill evidence fails closed: ${name}`, () => {
  const r = worldNfillFixture();
  mutate(r);
  assert.throws(() => worldNfillResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldNfillFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldNfillResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldNfillFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldNfillResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during nfill sampling', () => {
  const r = worldNfillFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldNfillResults(r));
});

test('invalid world-nfill report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-nfill-invalid-'));
  try {
    const r = worldNfillFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldNfill(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi hex off env eint back hterm and nfill probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldHterm \} from '\.\/world-hterm-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldNfill \} from '\.\/world-nfill-browser\.mjs';/);
  assert.match(src, /verifyWorldHterm\(browser, url\)/);
  assert.match(src, /verifyWorldNfill\(browser, url\)/);
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
