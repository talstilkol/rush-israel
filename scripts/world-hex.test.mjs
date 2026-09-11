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
  BAND_PIXELS, FAILURE_LIMIT, GRAY_BASELINE_IDS, HBLACK_IDS, HINT_IDS, HUE_IDS, IBL_IDS, LUMA_IDS,
  HEX_BLUE_MIN, HEX_FRAMES, HEX_L2_MIN, HEX_LAYERS, HEX_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantHex, luma, hexBufferIsNotOriginalGolden, retainWorldHex,
  hemIsNotHexMismatch, worldHexFixture, worldHexResults,
} from './world-hex-browser.mjs';
import { worldHemiFixture } from './world-hemi-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px amb report without hgray vs hblack vs hint is not hemi mismatch', () => {
  assert.equal(hemIsNotHexMismatch({ frames: [] }), true);
  assert.equal(hemIsNotHexMismatch(worldHemiFixture()), true);
  assert.equal(hemIsNotHexMismatch(worldHexFixture()), false);
  assert.throws(() => worldHexResults(worldHemiFixture()), /combined leftover-occupying hemi.color is not 0xa8c8e8 vs 0x808080 vs 0x000000 mismatch/);
});

test('hemi buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(hexBufferIsNotOriginalGolden(worldHexFixture()), false);
  assert.equal(hexBufferIsNotOriginalGolden({
    ...worldHexFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(HEX_L2_MIN, 8);
  assert.equal(HEX_LUMA_MIN, 8);
  assert.equal(HEX_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(HEX_LAYERS, ['hgray', 'hblack', 'hint', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...IBL_IDS], ['hgray']);
  assert.deepEqual([...HBLACK_IDS], ['hblack']);
  assert.deepEqual([...HINT_IDS], ['hint']);
  assert.deepEqual([...HUE_IDS], ['hue']);
  assert.deepEqual([...GRAY_BASELINE_IDS], ['hgray', 'hblack', 'hint']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  assert.equal(luma({ r: 0, g: 0, b: 0 }), 0);
  const src = readFileSync(fromRoot('scripts', 'world-hex-browser.mjs'), 'utf8');
  assert.match(src, /light\.color\.setHex\(0x808080\)/);
  assert.match(src, /light\.color\.setHex\(0x000000\)/);
  assert.match(src, /light\.intensity = 0/);
  assert.match(src, /isHemisphereLight/);
  assert.match(src, /skyHex: 0x808080/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), hgrayIsCombined: true }), /hgray isolation still combined/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), hgrayClearsOff: true }), /hgray isolation clears IBL-off/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), hgrayClearsHue: true }), /hgray isolation clears gray cubemap hue/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), hblackClearsHgray: true }), /hblack isolation uses HemisphereLight intensity/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), hueClearsOff: true }), /hue isolation clears IBL-off/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), hexDeltasUseGrayBaseline: false }), /hgray vs hblack vs hint still uses product present as baseline/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), hgraySetsGray: false }), /HemisphereLight color stays product during hgray isolation/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), hblackSetsBlack: false }), /HemisphereLight color stays product during hblack isolation/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), hintZerosIntensity: false }), /HemisphereLight intensity stays product during hint isolation/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), hgndKeepsGround: false }), /HemisphereLight groundColor left product during hex probe/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), ambKeepsAmbient: false }), /AmbientLight intensity left product during hex probe/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), rectKeepsRectArea: false }), /RectAreaLight intensity left product during hex probe/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), colorManagementStaysEnabled: false }), /ColorManagement disabled during hex probe/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), outputColorSpaceStaysSRGB: false }), /outputColorSpace left product sRGB during hex probe/);
  assert.throws(() => worldHexResults({ ...worldHexFixture(), toneMappingStaysACES: false }), /toneMapping left product ACES during hex probe/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked hemi poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(HEX_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(HEX_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(HEX_FRAMES[3].night, true);
  assert.equal(dominantHex(worldHexFixture().frames[0].layers), 'hue');
});

test('hemi-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldHexResults(worldHexFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-hex evidence fails closed: ${name}`, () => {
  const r = worldHexFixture();
  mutate(r);
  assert.throws(() => worldHexResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldHexFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldHexResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldHexFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldHexResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during hex sampling', () => {
  const r = worldHexFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldHexResults(r));
});

test('invalid world-hex report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-hex-invalid-'));
  try {
    const r = worldHexFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldHex(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi and hex probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldHemi \} from '\.\/world-hemi-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldHex \} from '\.\/world-hex-browser\.mjs';/);
  assert.match(src, /verifyWorldHemi\(browser, url\)/);
  assert.match(src, /verifyWorldHex\(browser, url\)/);
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
