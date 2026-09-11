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
  BAND_PIXELS, CONV_BLUE_MIN, CONV_FRAMES, CONV_L2_MIN, CONV_LAYERS, CONV_LUMA_MIN, CUBE_IDS,
  FAILURE_LIMIT, GAIN_IDS, GRAY_BASELINE_IDS, HUE_IDS, IBL_IDS, LUMA_IDS,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_SKY_HEX,
  convBufferIsNotOriginalGolden, dominantConv, flatIsNotConvMismatch, luma, retainWorldConv,
  worldConvFixture, worldConvResults,
} from './world-conv-browser.mjs';
import { worldFlatFixture } from './world-flat-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px flat report without fromScene vs fromCubemap vs gain is not conv mismatch', () => {
  assert.equal(flatIsNotConvMismatch({ frames: [] }), true);
  assert.equal(flatIsNotConvMismatch(worldFlatFixture()), true);
  assert.equal(flatIsNotConvMismatch(worldConvFixture()), false);
  assert.throws(() => worldConvResults(worldFlatFixture()), /combined leftover PMREM-filtered 0x808080 is not fromScene vs fromCubemap vs environmentIntensity mismatch/);
});

test('conv buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(convBufferIsNotOriginalGolden(worldConvFixture()), false);
  assert.equal(convBufferIsNotOriginalGolden({
    ...worldConvFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(CONV_L2_MIN, 8);
  assert.equal(CONV_LUMA_MIN, 8);
  assert.equal(CONV_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(CONV_LAYERS, ['scene', 'cube', 'gain', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...IBL_IDS], ['scene']);
  assert.deepEqual([...CUBE_IDS], ['cube']);
  assert.deepEqual([...GAIN_IDS], ['gain']);
  assert.deepEqual([...HUE_IDS], ['hue']);
  assert.deepEqual([...GRAY_BASELINE_IDS], ['scene', 'cube', 'gain']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  assert.equal(luma({ r: 0, g: 0, b: 0 }), 0);
  const src = readFileSync(fromRoot('scripts', 'world-conv-browser.mjs'), 'utf8');
  assert.match(src, /bakeVariant\(\{ skyHex: 0x808080, hemi: true, disc: true \}\)/);
  assert.match(src, /fromCubemap\(/);
  assert.match(src, /environmentIntensity = 0/);
  assert.throws(() => worldConvResults({ ...worldConvFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldConvResults({ ...worldConvFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldConvResults({ ...worldConvFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldConvResults({ ...worldConvFixture(), sceneIsCombined: true }), /scene isolation still combined/);
  assert.throws(() => worldConvResults({ ...worldConvFixture(), sceneClearsOff: true }), /scene isolation clears IBL-off/);
  assert.throws(() => worldConvResults({ ...worldConvFixture(), sceneClearsHue: true }), /scene isolation clears gray cubemap hue/);
  assert.throws(() => worldConvResults({ ...worldConvFixture(), cubeClearsScene: true }), /cube isolation uses unfiltered CubeTexture/);
  assert.throws(() => worldConvResults({ ...worldConvFixture(), hueClearsOff: true }), /hue isolation clears IBL-off/);
  assert.throws(() => worldConvResults({ ...worldConvFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldConvResults({ ...worldConvFixture(), sceneDeltasUseGrayBaseline: false }), /scene vs cube vs gain still uses product present as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked conv poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(CONV_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(CONV_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(CONV_FRAMES[3].night, true);
  assert.equal(dominantConv(worldConvFixture().frames[0].layers), 'hue');
});

test('conv-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldConvResults(worldConvFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-conv evidence fails closed: ${name}`, () => {
  const r = worldConvFixture();
  mutate(r);
  assert.throws(() => worldConvResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldConvFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldConvResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldConvFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldConvResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during conv sampling', () => {
  const r = worldConvFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldConvResults(r));
});

test('invalid world-conv report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-conv-invalid-'));
  try {
    const r = worldConvFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldConv(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat and conv probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldFlat \} from '\.\/world-flat-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldConv \} from '\.\/world-conv-browser\.mjs';/);
  assert.match(src, /verifyWorldFlat\(browser, url\)/);
  assert.match(src, /verifyWorldConv\(browser, url\)/);
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
