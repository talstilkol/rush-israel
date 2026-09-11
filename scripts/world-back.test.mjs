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
  BACK_BLUE_MIN, BACK_FRAMES, BACK_L2_MIN, BACK_LAYERS, BACK_LUMA_MIN, BAND_PIXELS, BG_IDS, BOTH_IDS,
  CAPTURE_LAYERS, FAILURE_LIMIT, HEMI_IDS, IBL_IDS, LUMA_IDS,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  backBufferIsNotOriginalGolden, dominantBack, envIsNotBackMismatch, retainWorldBack,
  worldBackFixture, worldBackResults,
} from './world-back-browser.mjs';
import { worldEintFixture } from './world-eint-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px eint report without bg vs env vs both is not back mismatch', () => {
  assert.equal(envIsNotBackMismatch({ frames: [] }), true);
  assert.equal(envIsNotBackMismatch(worldEintFixture()), true);
  assert.equal(envIsNotBackMismatch(worldBackFixture()), false);
  assert.throws(() => worldBackResults(worldEintFixture()), /combined remaining bakeEnv 0x3a9ae0 hue is not scene.background vs scene.environment vs both mismatch/);
});

test('back buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(backBufferIsNotOriginalGolden(worldBackFixture()), false);
  assert.equal(backBufferIsNotOriginalGolden({
    ...worldBackFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(BACK_L2_MIN, 8);
  assert.equal(BACK_LUMA_MIN, 8);
  assert.equal(BACK_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(BACK_LAYERS, ['bg', 'env', 'both', 'hemi', 'intensity', 'fill']);
  assert.deepEqual([...CAPTURE_LAYERS], ['bg', 'env', 'both', 'hemi', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...BG_IDS], ['bg']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.deepEqual([...BOTH_IDS], ['both']);
  assert.deepEqual([...HEMI_IDS], ['hemi']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-back-browser.mjs'), 'utf8');
  assert.match(src, /engine\.scene\.background = new THREE\.Color\(0x808080\)/);
  assert.match(src, /swapEnv\(gray\)/);
  assert.match(src, /light\.color\.setHex\(0x808080\)/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.doesNotMatch(src, /engine\.scene\.environmentIntensity = 0/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), bgSetsGray: false }), /scene.background isolation did not set 0x808080/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), bgKeepsEnv: false }), /scene.background isolation clears scene.environment/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), bgKeepsEint: false }), /environmentIntensity left product during scene.background isolation/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), bgKeepsHemi: false }), /hemi.color left product during scene.background isolation/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), envKeepsBg: false }), /scene.environment isolation changes scene.background/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), envKeepsEint: false }), /environmentIntensity left product during scene.environment isolation/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), envKeepsHemi: false }), /hemi.color left product during scene.environment isolation/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), envClearsHue: true }), /scene.environment isolation uses product sky hue bake/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), bothSetsBg: false }), /both isolation did not set background 0x808080/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), bothSetsEnv: false }), /both isolation did not swap gray cubemap/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), bothKeepsEint: false }), /environmentIntensity left product during both isolation/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), bothKeepsHemi: false }), /hemi.color left product during both isolation/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), hemiSetsGray: false }), /hemi.color isolation did not set 0x808080/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), hemiKeepsBg: false }), /hemi.color isolation changes scene.background/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), hemiKeepsEnv: false }), /hemi.color isolation clears scene.environment/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), backDeltasUseProductBaseline: false }), /bg vs env vs both still uses hgray as baseline/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), hgndKeepsGround: false }), /HemisphereLight groundColor left product during back probe/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), ambKeepsAmbient: false }), /AmbientLight intensity left product during back probe/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), rectKeepsRectArea: false }), /RectAreaLight intensity left product during back probe/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), colorManagementStaysEnabled: false }), /ColorManagement disabled during back probe/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), outputColorSpaceStaysSRGB: false }), /outputColorSpace left product sRGB during back probe/);
  assert.throws(() => worldBackResults({ ...worldBackFixture(), toneMappingStaysACES: false }), /toneMapping left product ACES during back probe/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked back poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(BACK_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(BACK_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(BACK_FRAMES[3].night, true);
  assert.equal(dominantBack(worldBackFixture().frames[0].layers), 'hemi');
});

test('back-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldBackResults(worldBackFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-back evidence fails closed: ${name}`, () => {
  const r = worldBackFixture();
  mutate(r);
  assert.throws(() => worldBackResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldBackFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldBackResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldBackFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldBackResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during back sampling', () => {
  const r = worldBackFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldBackResults(r));
});

test('invalid world-back report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-back-invalid-'));
  try {
    const r = worldBackFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldBack(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi hex off env eint and back probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldEint \} from '\.\/world-eint-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldBack \} from '\.\/world-back-browser\.mjs';/);
  assert.match(src, /verifyWorldEint\(browser, url\)/);
  assert.match(src, /verifyWorldBack\(browser, url\)/);
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
