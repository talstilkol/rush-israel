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
  BAND_PIXELS, CAPTURE_LAYERS, FAILURE_LIMIT, HCOL_IDS, HGND_IDS, HINT_IDS, HTERM_BLUE_MIN,
  HTERM_FRAMES, HTERM_L2_MIN, HTERM_LAYERS, HTERM_LUMA_MIN, IBL_IDS, LUMA_IDS,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantHterm, envIsNotHtermMismatch, htermBufferIsNotOriginalGolden, retainWorldHterm,
  worldHtermFixture, worldHtermResults,
} from './world-hterm-browser.mjs';
import { worldBackFixture } from './world-back-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px back report without hcol vs hint vs hgnd is not hterm mismatch', () => {
  assert.equal(envIsNotHtermMismatch({ frames: [] }), true);
  assert.equal(envIsNotHtermMismatch(worldBackFixture()), true);
  assert.equal(envIsNotHtermMismatch(worldHtermFixture()), false);
  assert.throws(() => worldHtermResults(worldBackFixture()), /combined remaining hemi.color 0xa8c8e8 vs 0x808080 is not HemisphereLight.color vs intensity vs groundColor mismatch/);
});

test('hterm buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(htermBufferIsNotOriginalGolden(worldHtermFixture()), false);
  assert.equal(htermBufferIsNotOriginalGolden({
    ...worldHtermFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(HTERM_L2_MIN, 8);
  assert.equal(HTERM_LUMA_MIN, 8);
  assert.equal(HTERM_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(HTERM_LAYERS, ['hcol', 'hint', 'hgnd', 'env', 'intensity', 'fill']);
  assert.deepEqual([...CAPTURE_LAYERS], ['hcol', 'hint', 'hgnd', 'env', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...HCOL_IDS], ['hcol']);
  assert.deepEqual([...HINT_IDS], ['hint']);
  assert.deepEqual([...HGND_IDS], ['hgnd']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-hterm-browser.mjs'), 'utf8');
  assert.match(src, /light\.color\.setHex\(0x808080\)/);
  assert.match(src, /light\.intensity = 0/);
  assert.match(src, /light\.groundColor\.setHex\(0x808080\)/);
  assert.doesNotMatch(src, /engine\.scene\.environment = null/);
  assert.doesNotMatch(src, /engine\.scene\.environmentIntensity = 0/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hcolSetsGray: false }), /hemi.color isolation did not set 0x808080/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hcolKeepsHint: false }), /hemi.intensity left product during hemi.color isolation/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hcolKeepsGnd: false }), /groundColor left product during hemi.color isolation/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hcolKeepsEnv: false }), /hemi.color isolation clears scene.environment/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hcolKeepsBg: false }), /hemi.color isolation changes scene.background/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hintZerosIntensity: false }), /hemi.intensity isolation did not zero intensity/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hintKeepsColor: false }), /hemi.color left product during hemi.intensity isolation/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hintKeepsGnd: false }), /groundColor left product during hemi.intensity isolation/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hintKeepsEnv: false }), /hemi.intensity isolation clears scene.environment/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hintKeepsBg: false }), /hemi.intensity isolation changes scene.background/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hgndSetsGray: false }), /groundColor isolation did not set 0x808080/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hgndKeepsColor: false }), /hemi.color left product during groundColor isolation/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hgndKeepsHint: false }), /hemi.intensity left product during groundColor isolation/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hgndKeepsEnv: false }), /groundColor isolation clears scene.environment/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hgndKeepsBg: false }), /groundColor isolation changes scene.background/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), envSetsGray: false }), /scene.environment isolation did not swap gray cubemap/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), envKeepsHemi: false }), /hemi.color left product during scene.environment isolation/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), envKeepsBg: false }), /scene.environment isolation changes scene.background/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), envClearsHue: true }), /scene.environment isolation uses product sky hue bake/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), htermDeltasUseProductBaseline: false }), /hcol vs hint vs hgnd still uses hgray as baseline/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), hgndKeepsGround: false }), /HemisphereLight groundColor left product after hterm restorers/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), ambKeepsAmbient: false }), /AmbientLight intensity left product during hterm probe/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), rectKeepsRectArea: false }), /RectAreaLight intensity left product during hterm probe/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), colorManagementStaysEnabled: false }), /ColorManagement disabled during hterm probe/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), outputColorSpaceStaysSRGB: false }), /outputColorSpace left product sRGB during hterm probe/);
  assert.throws(() => worldHtermResults({ ...worldHtermFixture(), toneMappingStaysACES: false }), /toneMapping left product ACES during hterm probe/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked hterm poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(HTERM_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(HTERM_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(HTERM_FRAMES[3].night, true);
  assert.equal(dominantHterm(worldHtermFixture().frames[0].layers), 'hcol');
});

test('hterm-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldHtermResults(worldHtermFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-hterm evidence fails closed: ${name}`, () => {
  const r = worldHtermFixture();
  mutate(r);
  assert.throws(() => worldHtermResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldHtermFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldHtermResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldHtermFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldHtermResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during hterm sampling', () => {
  const r = worldHtermFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldHtermResults(r));
});

test('invalid world-hterm report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-hterm-invalid-'));
  try {
    const r = worldHtermFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldHterm(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi hex off env eint back and hterm probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldBack \} from '\.\/world-back-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldHterm \} from '\.\/world-hterm-browser\.mjs';/);
  assert.match(src, /verifyWorldBack\(browser, url\)/);
  assert.match(src, /verifyWorldHterm\(browser, url\)/);
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
