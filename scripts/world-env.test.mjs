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
  BAND_PIXELS, BOTH_IDS, CAPTURE_LAYERS, ENV_BLUE_MIN, ENV_FRAMES, ENV_L2_MIN, ENV_LAYERS, ENV_LUMA_MIN,
  FAILURE_LIMIT, HGRAY_BASELINE_IDS, HUE_IDS, IBL_IDS, LUMA_IDS, MAT_IDS,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantEnv, envBufferIsNotOriginalGolden, retainWorldEnv,
  offIsNotEnvMismatch, worldEnvFixture, worldEnvResults,
} from './world-env-browser.mjs';
import { worldOffFixture } from './world-off-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px off report without env vs mat vs both is not env mismatch', () => {
  assert.equal(offIsNotEnvMismatch({ frames: [] }), true);
  assert.equal(offIsNotEnvMismatch(worldOffFixture()), true);
  assert.equal(offIsNotEnvMismatch(worldEnvFixture()), false);
  assert.throws(() => worldEnvResults(worldOffFixture()), /combined remaining cubemap vs IBL-off with gray hemi is not scene.environment vs material.envMap vs both mismatch/);
});

test('env buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(envBufferIsNotOriginalGolden(worldEnvFixture()), false);
  assert.equal(envBufferIsNotOriginalGolden({
    ...worldEnvFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(ENV_L2_MIN, 8);
  assert.equal(ENV_LUMA_MIN, 8);
  assert.equal(ENV_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(ENV_LAYERS, ['env', 'mat', 'both', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...CAPTURE_LAYERS], ['env', 'mat', 'both', 'hgray', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.deepEqual([...MAT_IDS], ['mat']);
  assert.deepEqual([...BOTH_IDS], ['both']);
  assert.deepEqual([...HUE_IDS], ['hue']);
  assert.deepEqual([...HGRAY_BASELINE_IDS], ['env', 'mat', 'both']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-env-browser.mjs'), 'utf8');
  assert.match(src, /engine\.scene\.environment = null/);
  assert.match(src, /mat\.envMap = null/);
  assert.match(src, /light\.color\.setHex\(0x808080\)/);
  assert.match(src, /isHemisphereLight/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), envClearsEnv: false }), /scene.environment isolation did not clear scene.environment/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), envSetsGray: false }), /hemi.color stays product during scene.environment isolation/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), envKeepsMaps: false }), /material.envMap left product during scene.environment isolation/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), envClearsHue: true }), /scene.environment isolation uses gray cubemap hue/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), matClearsMaps: false }), /material.envMap isolation did not clear material.envMap/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), matSetsGray: false }), /hemi.color stays product during material.envMap isolation/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), matKeepsEnv: false }), /material.envMap isolation clears scene.environment/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), bothClearsEnv: false }), /both isolation did not clear scene.environment/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), bothClearsMaps: false }), /both isolation did not clear material.envMap/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), bothSetsGray: false }), /hemi.color stays product during both isolation/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), hueClearsOff: true }), /hue isolation clears IBL-off/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), envDeltasUseHgrayBaseline: false }), /env vs mat vs both still uses product present as baseline/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), hgndKeepsGround: false }), /HemisphereLight groundColor left product during env probe/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), ambKeepsAmbient: false }), /AmbientLight intensity left product during env probe/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), rectKeepsRectArea: false }), /RectAreaLight intensity left product during env probe/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), colorManagementStaysEnabled: false }), /ColorManagement disabled during env probe/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), outputColorSpaceStaysSRGB: false }), /outputColorSpace left product sRGB during env probe/);
  assert.throws(() => worldEnvResults({ ...worldEnvFixture(), toneMappingStaysACES: false }), /toneMapping left product ACES during env probe/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked env poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(ENV_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(ENV_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(ENV_FRAMES[3].night, true);
  assert.equal(dominantEnv(worldEnvFixture().frames[0].layers), 'hue');
});

test('env-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldEnvResults(worldEnvFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-env evidence fails closed: ${name}`, () => {
  const r = worldEnvFixture();
  mutate(r);
  assert.throws(() => worldEnvResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldEnvFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldEnvResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldEnvFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldEnvResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during env sampling', () => {
  const r = worldEnvFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldEnvResults(r));
});

test('invalid world-env report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-env-invalid-'));
  try {
    const r = worldEnvFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldEnv(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi hex off and env probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldOff \} from '\.\/world-off-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldEnv \} from '\.\/world-env-browser\.mjs';/);
  assert.match(src, /verifyWorldOff\(browser, url\)/);
  assert.match(src, /verifyWorldEnv\(browser, url\)/);
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
