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
  BAND_PIXELS, PROBE_IDS, IBL_BLUE_MIN, IBL_FRAMES, IBL_L2_MIN, IBL_LAYERS, IBL_LUMA_MIN,
  FAILURE_LIMIT, IBL_IDS, LUMA_IDS, PIXEL_THRESHOLD, PRODUCT_EXPOSURE,
  iblBufferIsNotOriginalGolden, dominantIbl, luma, retainWorldIbl,
  rayIsNotIblMismatch, worldIblFixture, worldIblResults,
} from './world-ibl-browser.mjs';
import { worldRayFixture } from './world-ray-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px ray report without background vs sky vs envMap is not ibl mismatch', () => {
  assert.equal(rayIsNotIblMismatch({ frames: [] }), true);
  assert.equal(rayIsNotIblMismatch(worldRayFixture()), true);
  assert.equal(rayIsNotIblMismatch(worldIblFixture()), false);
  assert.throws(() => worldIblResults(worldRayFixture()), /combined scene.environment blue is not background vs sky vs material envMap mismatch/);
});

test('ibl buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(iblBufferIsNotOriginalGolden(worldIblFixture()), false);
  assert.equal(iblBufferIsNotOriginalGolden({
    ...worldIblFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(IBL_L2_MIN, 8);
  assert.equal(IBL_LUMA_MIN, 8);
  assert.equal(IBL_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(IBL_LAYERS, ['environment', 'background', 'sky', 'envMap', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...IBL_IDS], ['environment', 'background', 'sky', 'envMap']);
  assert.deepEqual([...PROBE_IDS], ['environment', 'background', 'sky', 'envMap']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  assert.equal(luma({ r: 0, g: 0, b: 0 }), 0);
  assert.throws(() => worldIblResults({ ...worldIblFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldIblResults({ ...worldIblFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldIblResults({ ...worldIblFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldIblResults({ ...worldIblFixture(), iblIsCombined: true }), /environment isolation still combined/);
  assert.throws(() => worldIblResults({ ...worldIblFixture(), envMapClearsEnvironment: true }), /envMap isolation clears scene.environment/);
  assert.throws(() => worldIblResults({ ...worldIblFixture(), backgroundClearsEnvironment: true }), /background isolation clears scene.environment/);
  assert.throws(() => worldIblResults({ ...worldIblFixture(), intensityClearsEnvironment: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldIblResults({ ...worldIblFixture(), environmentClearsIntensity: true }), /environment isolation clears intensity/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked ibl poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(IBL_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(IBL_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(IBL_FRAMES[3].night, true);
  assert.equal(dominantIbl(worldIblFixture().frames[0].layers), 'environment');
});

test('ibl-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldIblResults(worldIblFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-ibl evidence fails closed: ${name}`, () => {
  const r = worldIblFixture();
  mutate(r);
  assert.throws(() => worldIblResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldIblFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldIblResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldIblFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldIblResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during ibl sampling', () => {
  const r = worldIblFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldIblResults(r));
});

test('invalid world-ibl report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-ibl-invalid-'));
  try {
    const r = worldIblFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldIbl(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray and ibl probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldLayers \} from '\.\/world-layer-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldResidual \} from '\.\/world-residual-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldMismatch \} from '\.\/world-mismatch-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldBias \} from '\.\/world-bias-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldScene \} from '\.\/world-scene-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldRegion \} from '\.\/world-region-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldColumn \} from '\.\/world-column-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldSlice \} from '\.\/world-slice-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldExtra \} from '\.\/world-extra-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldMaterial \} from '\.\/world-material-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldFactor \} from '\.\/world-factor-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldRgb \} from '\.\/world-rgb-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldShade \} from '\.\/world-shade-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldTone \} from '\.\/world-tone-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldTerm \} from '\.\/world-term-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldBeam \} from '\.\/world-beam-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldRay \} from '\.\/world-ray-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldIbl \} from '\.\/world-ibl-browser\.mjs';/);
  assert.match(src, /verifyWorldLayers\(browser, url\)/);
  assert.match(src, /verifyWorldResidual\(browser, url\)/);
  assert.match(src, /verifyWorldMismatch\(browser, url\)/);
  assert.match(src, /verifyWorldBias\(browser, url\)/);
  assert.match(src, /verifyWorldScene\(browser, url\)/);
  assert.match(src, /verifyWorldRegion\(browser, url\)/);
  assert.match(src, /verifyWorldColumn\(browser, url\)/);
  assert.match(src, /verifyWorldSlice\(browser, url\)/);
  assert.match(src, /verifyWorldExtra\(browser, url\)/);
  assert.match(src, /verifyWorldMaterial\(browser, url\)/);
  assert.match(src, /verifyWorldFactor\(browser, url\)/);
  assert.match(src, /verifyWorldRgb\(browser, url\)/);
  assert.match(src, /verifyWorldShade\(browser, url\)/);
  assert.match(src, /verifyWorldTone\(browser, url\)/);
  assert.match(src, /verifyWorldTerm\(browser, url\)/);
  assert.match(src, /verifyWorldBeam\(browser, url\)/);
  assert.match(src, /verifyWorldRay\(browser, url\)/);
  assert.match(src, /verifyWorldIbl\(browser, url\)/);
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
