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
  BAND_PIXELS, ENCODE_IDS, FAILURE_LIMIT, GRAY_BASELINE_IDS, HUE_IDS, IBL_IDS, LUMA_IDS,
  MGMT_BLUE_MIN, MGMT_FRAMES, MGMT_L2_MIN, MGMT_LAYERS, MGMT_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_SKY_HEX, TONE_IDS,
  dominantMgmt, luma, mgmtBufferIsNotOriginalGolden, retainWorldMgmt,
  sigmaIsNotMgmtMismatch, worldMgmtFixture, worldMgmtResults,
} from './world-mgmt-browser.mjs';
import { worldSigmaFixture } from './world-sigma-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px sigma report without mgmt vs encode vs tone is not mgmt mismatch', () => {
  assert.equal(sigmaIsNotMgmtMismatch({ frames: [] }), true);
  assert.equal(sigmaIsNotMgmtMismatch(worldSigmaFixture()), true);
  assert.equal(sigmaIsNotMgmtMismatch(worldMgmtFixture()), false);
  assert.throws(() => worldMgmtResults(worldSigmaFixture()), /combined leftover sRGB fromScene vs linear bake is not ColorManagement vs outputColorSpace vs toneMapping mismatch/);
});

test('mgmt buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(mgmtBufferIsNotOriginalGolden(worldMgmtFixture()), false);
  assert.equal(mgmtBufferIsNotOriginalGolden({
    ...worldMgmtFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(MGMT_L2_MIN, 8);
  assert.equal(MGMT_LUMA_MIN, 8);
  assert.equal(MGMT_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(MGMT_LAYERS, ['mgmt', 'encode', 'tone', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...IBL_IDS], ['mgmt']);
  assert.deepEqual([...ENCODE_IDS], ['encode']);
  assert.deepEqual([...TONE_IDS], ['tone']);
  assert.deepEqual([...HUE_IDS], ['hue']);
  assert.deepEqual([...GRAY_BASELINE_IDS], ['mgmt', 'encode', 'tone']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  assert.equal(luma({ r: 0, g: 0, b: 0 }), 0);
  const src = readFileSync(fromRoot('scripts', 'world-mgmt-browser.mjs'), 'utf8');
  assert.match(src, /ColorManagement\.enabled = false/);
  assert.match(src, /outputColorSpace = THREE\.LinearSRGBColorSpace/);
  assert.match(src, /toneMapping = THREE\.NoToneMapping/);
  assert.match(src, /skyHex: 0x808080/);
  assert.throws(() => worldMgmtResults({ ...worldMgmtFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldMgmtResults({ ...worldMgmtFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldMgmtResults({ ...worldMgmtFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldMgmtResults({ ...worldMgmtFixture(), mgmtIsCombined: true }), /mgmt isolation still combined/);
  assert.throws(() => worldMgmtResults({ ...worldMgmtFixture(), mgmtClearsOff: true }), /mgmt isolation clears IBL-off/);
  assert.throws(() => worldMgmtResults({ ...worldMgmtFixture(), mgmtClearsHue: true }), /mgmt isolation clears gray cubemap hue/);
  assert.throws(() => worldMgmtResults({ ...worldMgmtFixture(), encodeClearsMgmt: true }), /encode isolation uses ColorManagement bake/);
  assert.throws(() => worldMgmtResults({ ...worldMgmtFixture(), hueClearsOff: true }), /hue isolation clears IBL-off/);
  assert.throws(() => worldMgmtResults({ ...worldMgmtFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldMgmtResults({ ...worldMgmtFixture(), mgmtDeltasUseGrayBaseline: false }), /mgmt vs encode vs tone still uses product present as baseline/);
  assert.throws(() => worldMgmtResults({ ...worldMgmtFixture(), mgmtDisablesColorManagement: false }), /ColorManagement stays enabled during mgmt bake/);
  assert.throws(() => worldMgmtResults({ ...worldMgmtFixture(), encodeSetsLinearOutput: false }), /outputColorSpace stays product sRGB during encode bake/);
  assert.throws(() => worldMgmtResults({ ...worldMgmtFixture(), toneSetsNoToneMapping: false }), /toneMapping stays product ACES during tone bake/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked mgmt poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(MGMT_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(MGMT_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(MGMT_FRAMES[3].night, true);
  assert.equal(dominantMgmt(worldMgmtFixture().frames[0].layers), 'hue');
});

test('mgmt-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldMgmtResults(worldMgmtFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-mgmt evidence fails closed: ${name}`, () => {
  const r = worldMgmtFixture();
  mutate(r);
  assert.throws(() => worldMgmtResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldMgmtFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldMgmtResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldMgmtFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldMgmtResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during mgmt sampling', () => {
  const r = worldMgmtFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldMgmtResults(r));
});

test('invalid world-mgmt report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-mgmt-invalid-'));
  try {
    const r = worldMgmtFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldMgmt(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt and lod probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldSigma \} from '\.\/world-sigma-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldMgmt \} from '\.\/world-mgmt-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldLod \} from '\.\/world-lod-browser\.mjs';/);
  assert.match(src, /verifyWorldSigma\(browser, url\)/);
  assert.match(src, /verifyWorldMgmt\(browser, url\)/);
  assert.match(src, /verifyWorldLod\(browser, url\)/);
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
