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
  BAND_PIXELS, FAILURE_LIMIT, FLAT_BLUE_MIN, FLAT_FRAMES, FLAT_IDS, FLAT_L2_MIN, FLAT_LAYERS, FLAT_LUMA_MIN,
  GRAY_BASELINE_IDS, HUE_IDS, IBL_IDS, LUMA_IDS, OFF_IDS,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_SKY_HEX,
  bareIsNotFlatMismatch, dominantFlat, flatBufferIsNotOriginalGolden, luma, retainWorldFlat,
  worldFlatFixture, worldFlatResults,
} from './world-flat-browser.mjs';
import { worldBareFixture } from './world-bare-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px bare report without PMREM vs constant gray cubemap is not flat mismatch', () => {
  assert.equal(bareIsNotFlatMismatch({ frames: [] }), true);
  assert.equal(bareIsNotFlatMismatch(worldBareFixture()), true);
  assert.equal(bareIsNotFlatMismatch(worldFlatFixture()), false);
  assert.throws(() => worldFlatResults(worldBareFixture()), /combined leftover 0x808080 background IBL is not PMREM convolution vs a constant gray cubemap mismatch/);
});

test('flat buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(flatBufferIsNotOriginalGolden(worldFlatFixture()), false);
  assert.equal(flatBufferIsNotOriginalGolden({
    ...worldFlatFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(FLAT_L2_MIN, 8);
  assert.equal(FLAT_LUMA_MIN, 8);
  assert.equal(FLAT_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(FLAT_LAYERS, ['pmrem', 'flat', 'off', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...IBL_IDS], ['pmrem']);
  assert.deepEqual([...FLAT_IDS], ['flat']);
  assert.deepEqual([...OFF_IDS], ['off']);
  assert.deepEqual([...HUE_IDS], ['hue']);
  assert.deepEqual([...GRAY_BASELINE_IDS], ['pmrem', 'flat', 'off']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  assert.equal(luma({ r: 0, g: 0, b: 0 }), 0);
  const src = readFileSync(fromRoot('scripts', 'world-flat-browser.mjs'), 'utf8');
  assert.match(src, /bakeVariant\(\{ skyHex: 0x808080, hemi: true, disc: true \}\)/);
  assert.match(src, /new THREE\.CubeTexture/);
  assert.match(src, /flatCube\(0x808080\)/);
  assert.throws(() => worldFlatResults({ ...worldFlatFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldFlatResults({ ...worldFlatFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldFlatResults({ ...worldFlatFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldFlatResults({ ...worldFlatFixture(), pmremIsCombined: true }), /pmrem isolation still combined/);
  assert.throws(() => worldFlatResults({ ...worldFlatFixture(), pmremClearsOff: true }), /pmrem isolation clears IBL-off/);
  assert.throws(() => worldFlatResults({ ...worldFlatFixture(), pmremClearsHue: true }), /pmrem isolation clears gray cubemap hue/);
  assert.throws(() => worldFlatResults({ ...worldFlatFixture(), flatClearsPmrem: true }), /flat isolation uses PMREM convolution/);
  assert.throws(() => worldFlatResults({ ...worldFlatFixture(), hueClearsOff: true }), /hue isolation clears IBL-off/);
  assert.throws(() => worldFlatResults({ ...worldFlatFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldFlatResults({ ...worldFlatFixture(), pmremDeltasUseGrayBaseline: false }), /pmrem vs flat vs off still uses product present as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked flat poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(FLAT_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(FLAT_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(FLAT_FRAMES[3].night, true);
  assert.equal(dominantFlat(worldFlatFixture().frames[0].layers), 'hue');
});

test('flat-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldFlatResults(worldFlatFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-flat evidence fails closed: ${name}`, () => {
  const r = worldFlatFixture();
  mutate(r);
  assert.throws(() => worldFlatResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldFlatFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldFlatResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldFlatFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldFlatResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during flat sampling', () => {
  const r = worldFlatFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldFlatResults(r));
});

test('invalid world-flat report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-flat-invalid-'));
  try {
    const r = worldFlatFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldFlat(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare and flat probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldBare \} from '\.\/world-bare-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldFlat \} from '\.\/world-flat-browser\.mjs';/);
  assert.match(src, /verifyWorldBare\(browser, url\)/);
  assert.match(src, /verifyWorldFlat\(browser, url\)/);
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
