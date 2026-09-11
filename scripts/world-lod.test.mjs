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
  BAND_PIXELS, ENV_IDS, FAILURE_LIMIT, GRAY_BASELINE_IDS, HUE_IDS, IBL_IDS, LOD_IDS, LUMA_IDS,
  LOD_BLUE_MIN, LOD_FRAMES, LOD_L2_MIN, LOD_LAYERS, LOD_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  SMALL_PMREM_SIZE, dominantLod, luma, lodBufferIsNotOriginalGolden, retainWorldLod,
  mgmtIsNotLodMismatch, worldLodFixture, worldLodResults,
} from './world-lod-browser.mjs';
import { worldMgmtFixture } from './world-mgmt-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px mgmt report without size vs lod vs env is not lod mismatch', () => {
  assert.equal(mgmtIsNotLodMismatch({ frames: [] }), true);
  assert.equal(mgmtIsNotLodMismatch(worldMgmtFixture()), true);
  assert.equal(mgmtIsNotLodMismatch(worldLodFixture()), false);
  assert.throws(() => worldLodResults(worldMgmtFixture()), /combined leftover gray cubemap vs IBL-off is not PMREM size vs CubeUV lod vs ground envMapIntensity mismatch/);
});

test('lod buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(lodBufferIsNotOriginalGolden(worldLodFixture()), false);
  assert.equal(lodBufferIsNotOriginalGolden({
    ...worldLodFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(LOD_L2_MIN, 8);
  assert.equal(LOD_LUMA_MIN, 8);
  assert.equal(LOD_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(SMALL_PMREM_SIZE, 16);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(LOD_LAYERS, ['size', 'lod', 'env', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...IBL_IDS], ['size']);
  assert.deepEqual([...LOD_IDS], ['lod']);
  assert.deepEqual([...ENV_IDS], ['env']);
  assert.deepEqual([...HUE_IDS], ['hue']);
  assert.deepEqual([...GRAY_BASELINE_IDS], ['size', 'lod', 'env']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  assert.equal(luma({ r: 0, g: 0, b: 0 }), 0);
  const src = readFileSync(fromRoot('scripts', 'world-lod-browser.mjs'), 'utf8');
  assert.match(src, /fromScene\(tmp, 0\.04, 0\.1, 100, \{ size:/);
  assert.match(src, /size: smallSize/);
  assert.match(src, /mat\.roughness = 0/);
  assert.match(src, /mat\.envMapIntensity = 0/);
  assert.match(src, /skyHex: 0x808080/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), sizeIsCombined: true }), /size isolation still combined/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), sizeClearsOff: true }), /size isolation clears IBL-off/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), sizeClearsHue: true }), /size isolation clears gray cubemap hue/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), lodClearsSize: true }), /lod isolation uses size-16 bake/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), hueClearsOff: true }), /hue isolation clears IBL-off/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), sizeDeltasUseGrayBaseline: false }), /size vs lod vs env still uses product present as baseline/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), sizeSetsSmallPmrem: false }), /PMREM size stays product 256 during size bake/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), lodZerosGroundRoughness: false }), /ground roughness stays product during lod isolation/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), envZerosGroundEnvMapIntensity: false }), /ground envMapIntensity stays product during env isolation/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), colorManagementStaysEnabled: false }), /ColorManagement disabled during lod probe/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), outputColorSpaceStaysSRGB: false }), /outputColorSpace left product sRGB during lod probe/);
  assert.throws(() => worldLodResults({ ...worldLodFixture(), toneMappingStaysACES: false }), /toneMapping left product ACES during lod probe/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked lod poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(LOD_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(LOD_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(LOD_FRAMES[3].night, true);
  assert.equal(dominantLod(worldLodFixture().frames[0].layers), 'hue');
});

test('lod-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldLodResults(worldLodFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-lod evidence fails closed: ${name}`, () => {
  const r = worldLodFixture();
  mutate(r);
  assert.throws(() => worldLodResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldLodFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldLodResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldLodFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldLodResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during lod sampling', () => {
  const r = worldLodFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldLodResults(r));
});

test('invalid world-lod report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-lod-invalid-'));
  try {
    const r = worldLodFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldLod(r, out));
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
  assert.match(src, /import \{ verifyWorldMgmt \} from '\.\/world-mgmt-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldLod \} from '\.\/world-lod-browser\.mjs';/);
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
