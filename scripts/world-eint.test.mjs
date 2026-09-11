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
  BAND_PIXELS, BOTH_IDS, CAPTURE_LAYERS, EINT_BLUE_MIN, EINT_FRAMES, EINT_IDS, EINT_L2_MIN, EINT_LAYERS, EINT_LUMA_MIN,
  FAILURE_LIMIT, HGRAY_BASELINE_IDS, HUE_IDS, IBL_IDS, LUMA_IDS,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_HEMI_SKY_HEX, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantEint, eintBufferIsNotOriginalGolden, retainWorldEint,
  envIsNotEintMismatch, worldEintFixture, worldEintResults,
} from './world-eint-browser.mjs';
import { worldEnvFixture } from './world-env-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px env report without env vs eint vs both is not eint mismatch', () => {
  assert.equal(envIsNotEintMismatch({ frames: [] }), true);
  assert.equal(envIsNotEintMismatch(worldEnvFixture()), true);
  assert.equal(envIsNotEintMismatch(worldEintFixture()), false);
  assert.throws(() => worldEintResults(worldEnvFixture()), /combined remaining scene.environment with gray hemi is not environment=null vs environmentIntensity=0 vs both mismatch/);
});

test('eint buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(eintBufferIsNotOriginalGolden(worldEintFixture()), false);
  assert.equal(eintBufferIsNotOriginalGolden({
    ...worldEintFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(EINT_L2_MIN, 8);
  assert.equal(EINT_LUMA_MIN, 8);
  assert.equal(EINT_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(PRODUCT_HEMI_SKY_HEX, 0xa8c8e8);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(EINT_LAYERS, ['env', 'eint', 'both', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...CAPTURE_LAYERS], ['env', 'eint', 'both', 'hgray', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...IBL_IDS], ['env']);
  assert.deepEqual([...EINT_IDS], ['eint']);
  assert.deepEqual([...BOTH_IDS], ['both']);
  assert.deepEqual([...HUE_IDS], ['hue']);
  assert.deepEqual([...HGRAY_BASELINE_IDS], ['env', 'eint', 'both']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  const src = readFileSync(fromRoot('scripts', 'world-eint-browser.mjs'), 'utf8');
  assert.match(src, /engine\.scene\.environment = null/);
  assert.match(src, /engine\.scene\.environmentIntensity = 0/);
  assert.match(src, /light\.color\.setHex\(0x808080\)/);
  assert.match(src, /isHemisphereLight/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), envIsCombined: true }), /env isolation still combined/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), envClearsEnv: false }), /scene.environment isolation did not clear scene.environment/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), envSetsGray: false }), /hemi.color stays product during scene.environment isolation/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), envKeepsMaps: false }), /material.envMap left product during scene.environment isolation/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), envKeepsEint: false }), /environmentIntensity left product during scene.environment isolation/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), envClearsHue: true }), /scene.environment isolation uses gray cubemap hue/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), eintZerosIntensity: false }), /environmentIntensity isolation did not zero environmentIntensity/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), eintSetsGray: false }), /hemi.color stays product during environmentIntensity isolation/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), eintKeepsEnv: false }), /environmentIntensity isolation clears scene.environment/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), eintKeepsMaps: false }), /material.envMap left product during environmentIntensity isolation/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), bothClearsEnv: false }), /both isolation did not clear scene.environment/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), bothZerosIntensity: false }), /both isolation did not zero environmentIntensity/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), bothSetsGray: false }), /hemi.color stays product during both isolation/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), bothKeepsMaps: false }), /material.envMap left product during both isolation/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), hueClearsOff: true }), /hue isolation clears IBL-off/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), eintDeltasUseHgrayBaseline: false }), /env vs eint vs both still uses product present as baseline/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), hgndKeepsGround: false }), /HemisphereLight groundColor left product during eint probe/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), ambKeepsAmbient: false }), /AmbientLight intensity left product during eint probe/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), rectKeepsRectArea: false }), /RectAreaLight intensity left product during eint probe/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), colorManagementStaysEnabled: false }), /ColorManagement disabled during eint probe/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), outputColorSpaceStaysSRGB: false }), /outputColorSpace left product sRGB during eint probe/);
  assert.throws(() => worldEintResults({ ...worldEintFixture(), toneMappingStaysACES: false }), /toneMapping left product ACES during eint probe/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked eint poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(EINT_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(EINT_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(EINT_FRAMES[3].night, true);
  assert.equal(dominantEint(worldEintFixture().frames[0].layers), 'hue');
});

test('eint-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldEintResults(worldEintFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-eint evidence fails closed: ${name}`, () => {
  const r = worldEintFixture();
  mutate(r);
  assert.throws(() => worldEintResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldEintFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldEintResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldEintFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldEintResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during eint sampling', () => {
  const r = worldEintFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldEintResults(r));
});

test('invalid world-eint report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-eint-invalid-'));
  try {
    const r = worldEintFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldEint(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod road recv amb hemi hex off env and eint probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldEnv \} from '\.\/world-env-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldEint \} from '\.\/world-eint-browser\.mjs';/);
  assert.match(src, /verifyWorldEnv\(browser, url\)/);
  assert.match(src, /verifyWorldEint\(browser, url\)/);
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
