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
  BAND_PIXELS, FAILURE_LIMIT, GRAY_BASELINE_IDS, HUE_IDS, IBL_IDS, LUMA_IDS, MESH_IDS,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_SKY_HEX,
  SIGMA_BLUE_MIN, SIGMA_FRAMES, SIGMA_L2_MIN, SIGMA_LAYERS, SIGMA_LUMA_MIN, SPACE_IDS,
  convIsNotSigmaMismatch, dominantSigma, luma, retainWorldSigma, sigmaBufferIsNotOriginalGolden,
  worldSigmaFixture, worldSigmaResults,
} from './world-sigma-browser.mjs';
import { worldConvFixture } from './world-conv-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px conv report without sigma vs mesh vs space is not sigma mismatch', () => {
  assert.equal(convIsNotSigmaMismatch({ frames: [] }), true);
  assert.equal(convIsNotSigmaMismatch(worldConvFixture()), true);
  assert.equal(convIsNotSigmaMismatch(worldSigmaFixture()), false);
  assert.throws(() => worldSigmaResults(worldConvFixture()), /combined leftover fromScene 0x808080 is not sigma vs mesh sky vs bake color space mismatch/);
});

test('sigma buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(sigmaBufferIsNotOriginalGolden(worldSigmaFixture()), false);
  assert.equal(sigmaBufferIsNotOriginalGolden({
    ...worldSigmaFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(SIGMA_L2_MIN, 8);
  assert.equal(SIGMA_LUMA_MIN, 8);
  assert.equal(SIGMA_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(SIGMA_LAYERS, ['sigma', 'mesh', 'space', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...IBL_IDS], ['sigma']);
  assert.deepEqual([...MESH_IDS], ['mesh']);
  assert.deepEqual([...SPACE_IDS], ['space']);
  assert.deepEqual([...HUE_IDS], ['hue']);
  assert.deepEqual([...GRAY_BASELINE_IDS], ['sigma', 'mesh', 'space']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  assert.equal(luma({ r: 0, g: 0, b: 0 }), 0);
  const src = readFileSync(fromRoot('scripts', 'world-sigma-browser.mjs'), 'utf8');
  assert.match(src, /fromScene\(tmp, omit\.sigma \?\? 0\.04\)/);
  assert.match(src, /sigma: 0/);
  assert.match(src, /BackSide/);
  assert.match(src, /convertSRGBToLinear/);
  assert.throws(() => worldSigmaResults({ ...worldSigmaFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldSigmaResults({ ...worldSigmaFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldSigmaResults({ ...worldSigmaFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldSigmaResults({ ...worldSigmaFixture(), sigmaIsCombined: true }), /sigma isolation still combined/);
  assert.throws(() => worldSigmaResults({ ...worldSigmaFixture(), sigmaClearsOff: true }), /sigma isolation clears IBL-off/);
  assert.throws(() => worldSigmaResults({ ...worldSigmaFixture(), sigmaClearsHue: true }), /sigma isolation clears gray cubemap hue/);
  assert.throws(() => worldSigmaResults({ ...worldSigmaFixture(), meshClearsSigma: true }), /mesh isolation uses Color background/);
  assert.throws(() => worldSigmaResults({ ...worldSigmaFixture(), hueClearsOff: true }), /hue isolation clears IBL-off/);
  assert.throws(() => worldSigmaResults({ ...worldSigmaFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldSigmaResults({ ...worldSigmaFixture(), sigmaDeltasUseGrayBaseline: false }), /sigma vs mesh vs space still uses product present as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked sigma poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(SIGMA_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(SIGMA_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(SIGMA_FRAMES[3].night, true);
  assert.equal(dominantSigma(worldSigmaFixture().frames[0].layers), 'hue');
});

test('sigma-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldSigmaResults(worldSigmaFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-sigma evidence fails closed: ${name}`, () => {
  const r = worldSigmaFixture();
  mutate(r);
  assert.throws(() => worldSigmaResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldSigmaFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldSigmaResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldSigmaFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldSigmaResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during sigma sampling', () => {
  const r = worldSigmaFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldSigmaResults(r));
});

test('invalid world-sigma report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-sigma-invalid-'));
  try {
    const r = worldSigmaFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldSigma(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv and sigma probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldConv \} from '\.\/world-conv-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldSigma \} from '\.\/world-sigma-browser\.mjs';/);
  assert.match(src, /verifyWorldConv\(browser, url\)/);
  assert.match(src, /verifyWorldSigma\(browser, url\)/);
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
