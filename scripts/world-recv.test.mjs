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
  BAND_PIXELS, BASIC_IDS, FAILURE_LIMIT, GRAY_BASELINE_IDS, HUE_IDS, IBL_IDS, SHADER_IDS, LUMA_IDS,
  RECV_BLUE_MIN, RECV_FRAMES, RECV_L2_MIN, RECV_LAYERS, RECV_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantRecv, luma, recvBufferIsNotOriginalGolden, retainWorldRecv,
  roadIsNotRecvMismatch, worldRecvFixture, worldRecvResults,
} from './world-recv-browser.mjs';
import { worldRoadFixture } from './world-road-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px road report without probe vs basic vs shader is not recv mismatch', () => {
  assert.equal(roadIsNotRecvMismatch({ frames: [] }), true);
  assert.equal(roadIsNotRecvMismatch(worldRoadFixture()), true);
  assert.equal(roadIsNotRecvMismatch(worldRecvFixture()), false);
  assert.throws(() => worldRecvResults(worldRoadFixture()), /combined leftover gray cubemap vs IBL-off is not LightProbe vs MeshBasic envMap vs custom road-shader env mismatch/);
});

test('recv buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(recvBufferIsNotOriginalGolden(worldRecvFixture()), false);
  assert.equal(recvBufferIsNotOriginalGolden({
    ...worldRecvFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(RECV_L2_MIN, 8);
  assert.equal(RECV_LUMA_MIN, 8);
  assert.equal(RECV_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(RECV_LAYERS, ['probe', 'basic', 'shader', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...IBL_IDS], ['probe']);
  assert.deepEqual([...BASIC_IDS], ['basic']);
  assert.deepEqual([...SHADER_IDS], ['shader']);
  assert.deepEqual([...HUE_IDS], ['hue']);
  assert.deepEqual([...GRAY_BASELINE_IDS], ['probe', 'basic', 'shader']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  assert.equal(luma({ r: 0, g: 0, b: 0 }), 0);
  const src = readFileSync(fromRoot('scripts', 'world-recv-browser.mjs'), 'utf8');
  assert.match(src, /isLightProbe/);
  assert.match(src, /isMeshBasicMaterial/);
  assert.match(src, /recv-unbind/);
  assert.match(src, /mat\.onBeforeCompile = \(\) => \{\}/);
  assert.match(src, /mat\.envMap = null/);
  assert.match(src, /skyHex: 0x808080/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), probeIsCombined: true }), /probe isolation still combined/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), probeClearsOff: true }), /probe isolation clears IBL-off/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), probeClearsHue: true }), /probe isolation clears gray cubemap hue/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), basicClearsProbe: true }), /basic isolation uses LightProbe intensity/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), hueClearsOff: true }), /hue isolation clears IBL-off/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), recvDeltasUseGrayBaseline: false }), /probe vs basic vs shader still uses product present as baseline/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), probeIsolationRan: false }), /LightProbe traverse did not run/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), basicIsolationRan: false }), /MeshBasic envMap traverse did not run/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), shaderUnbindsRoadCompile: false }), /road-shader onBeforeCompile stays bound during shader isolation/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), roadKeepsEnvMapIntensity: false }), /road envMapIntensity left product during recv probe/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), stdKeepsAllEnvMapIntensity: false }), /all-standard envMapIntensity left product during recv probe/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), carKeepsHeroEnvMapIntensity: false }), /hero envMapIntensity left product during recv probe/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), colorManagementStaysEnabled: false }), /ColorManagement disabled during recv probe/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), outputColorSpaceStaysSRGB: false }), /outputColorSpace left product sRGB during recv probe/);
  assert.throws(() => worldRecvResults({ ...worldRecvFixture(), toneMappingStaysACES: false }), /toneMapping left product ACES during recv probe/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked recv poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(RECV_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(RECV_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(RECV_FRAMES[3].night, true);
  assert.equal(dominantRecv(worldRecvFixture().frames[0].layers), 'hue');
});

test('recv-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldRecvResults(worldRecvFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-recv evidence fails closed: ${name}`, () => {
  const r = worldRecvFixture();
  mutate(r);
  assert.throws(() => worldRecvResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldRecvFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldRecvResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldRecvFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldRecvResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during recv sampling', () => {
  const r = worldRecvFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldRecvResults(r));
});

test('invalid world-recv report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-recv-invalid-'));
  try {
    const r = worldRecvFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldRecv(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road and recv probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldRoad \} from '\.\/world-road-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldRecv \} from '\.\/world-recv-browser\.mjs';/);
  assert.match(src, /verifyWorldRoad\(browser, url\)/);
  assert.match(src, /verifyWorldRecv\(browser, url\)/);
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
