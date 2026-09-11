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
  BAND_PIXELS, FAILURE_LIMIT, GRAY_BASELINE_IDS, HEMI_IDS, HUE_IDS, IBL_IDS, RECT_IDS, LUMA_IDS,
  AMB_BLUE_MIN, AMB_FRAMES, AMB_L2_MIN, AMB_LAYERS, AMB_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantAmb, luma, ambBufferIsNotOriginalGolden, retainWorldAmb,
  recvIsNotAmbMismatch, worldAmbFixture, worldAmbResults,
} from './world-amb-browser.mjs';
import { worldRecvFixture } from './world-recv-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px recv report without amb vs hemi vs rect is not amb mismatch', () => {
  assert.equal(recvIsNotAmbMismatch({ frames: [] }), true);
  assert.equal(recvIsNotAmbMismatch(worldRecvFixture()), true);
  assert.equal(recvIsNotAmbMismatch(worldAmbFixture()), false);
  assert.throws(() => worldAmbResults(worldRecvFixture()), /combined leftover gray cubemap vs IBL-off is not AmbientLight vs HemisphereLight vs RectAreaLight mismatch/);
});

test('amb buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(ambBufferIsNotOriginalGolden(worldAmbFixture()), false);
  assert.equal(ambBufferIsNotOriginalGolden({
    ...worldAmbFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(AMB_L2_MIN, 8);
  assert.equal(AMB_LUMA_MIN, 8);
  assert.equal(AMB_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(AMB_LAYERS, ['amb', 'hemi', 'rect', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...IBL_IDS], ['amb']);
  assert.deepEqual([...HEMI_IDS], ['hemi']);
  assert.deepEqual([...RECT_IDS], ['rect']);
  assert.deepEqual([...HUE_IDS], ['hue']);
  assert.deepEqual([...GRAY_BASELINE_IDS], ['amb', 'hemi', 'rect']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  assert.equal(luma({ r: 0, g: 0, b: 0 }), 0);
  const src = readFileSync(fromRoot('scripts', 'world-amb-browser.mjs'), 'utf8');
  assert.match(src, /isAmbientLight/);
  assert.match(src, /isHemisphereLight/);
  assert.match(src, /isRectAreaLight/);
  assert.match(src, /object\.intensity = 0/);
  assert.match(src, /skyHex: 0x808080/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), ambIsCombined: true }), /amb isolation still combined/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), ambClearsOff: true }), /amb isolation clears IBL-off/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), ambClearsHue: true }), /amb isolation clears gray cubemap hue/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), hemiClearsAmb: true }), /hemi isolation uses AmbientLight intensity/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), hueClearsOff: true }), /hue isolation clears IBL-off/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), ambDeltasUseGrayBaseline: false }), /amb vs hemi vs rect still uses product present as baseline/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), ambZerosAmbient: false }), /AmbientLight intensity stays product during amb isolation/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), hemiZerosHemi: false }), /HemisphereLight intensity stays product during hemi isolation/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), rectIsolationRan: false }), /RectAreaLight traverse did not run/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), probeKeepsLightProbe: false }), /LightProbe intensity left product during amb probe/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), basicKeepsBasicEnvMap: false }), /MeshBasic envMap left product during amb probe/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), shaderKeepsRoadCompile: false }), /road-shader onBeforeCompile left bound during amb probe/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), colorManagementStaysEnabled: false }), /ColorManagement disabled during amb probe/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), outputColorSpaceStaysSRGB: false }), /outputColorSpace left product sRGB during amb probe/);
  assert.throws(() => worldAmbResults({ ...worldAmbFixture(), toneMappingStaysACES: false }), /toneMapping left product ACES during amb probe/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked amb poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(AMB_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(AMB_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(AMB_FRAMES[3].night, true);
  assert.equal(dominantAmb(worldAmbFixture().frames[0].layers), 'hue');
});

test('amb-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldAmbResults(worldAmbFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-amb evidence fails closed: ${name}`, () => {
  const r = worldAmbFixture();
  mutate(r);
  assert.throws(() => worldAmbResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldAmbFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldAmbResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldAmbFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldAmbResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during amb sampling', () => {
  const r = worldAmbFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldAmbResults(r));
});

test('invalid world-amb report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-amb-invalid-'));
  try {
    const r = worldAmbFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldAmb(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv and amb probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldRecv \} from '\.\/world-recv-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldAmb \} from '\.\/world-amb-browser\.mjs';/);
  assert.match(src, /verifyWorldRecv\(browser, url\)/);
  assert.match(src, /verifyWorldAmb\(browser, url\)/);
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
