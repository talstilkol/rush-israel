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
  BAND_PIXELS, BARE_BLUE_MIN, BARE_FRAMES, BARE_L2_MIN, BARE_LAYERS, BARE_LUMA_MIN,
  DISC_IDS, FAILURE_LIMIT, GRAY_BASELINE_IDS, GRAY_IDS, HEMI_IDS, HUE_IDS, IBL_IDS, LUMA_IDS,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_SKY_HEX,
  bareBufferIsNotOriginalGolden, dominantBare, grayIsNotBareMismatch, luma, retainWorldBare,
  worldBareFixture, worldBareResults,
} from './world-bare-browser.mjs';
import { worldGrayFixture } from './world-gray-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px gray report without bare 0x808080 vs hemi vs disc is not bare mismatch', () => {
  assert.equal(grayIsNotBareMismatch({ frames: [] }), true);
  assert.equal(grayIsNotBareMismatch(worldGrayFixture()), true);
  assert.equal(grayIsNotBareMismatch(worldBareFixture()), false);
  assert.throws(() => worldBareResults(worldGrayFixture()), /combined leftover gray IBL is not bare 0x808080 background vs baked hemi vs baked disc mismatch/);
});

test('bare buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(bareBufferIsNotOriginalGolden(worldBareFixture()), false);
  assert.equal(bareBufferIsNotOriginalGolden({
    ...worldBareFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(BARE_L2_MIN, 8);
  assert.equal(BARE_LUMA_MIN, 8);
  assert.equal(BARE_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(BARE_LAYERS, ['background', 'hemi', 'disc', 'gray', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...IBL_IDS], ['background']);
  assert.deepEqual([...GRAY_IDS], ['gray']);
  assert.deepEqual([...HUE_IDS], ['hue']);
  assert.deepEqual([...HEMI_IDS], ['hemi']);
  assert.deepEqual([...DISC_IDS], ['disc']);
  assert.deepEqual([...GRAY_BASELINE_IDS], ['background', 'hemi', 'disc', 'gray']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  assert.equal(luma({ r: 0, g: 0, b: 0 }), 0);
  const src = readFileSync(fromRoot('scripts', 'world-bare-browser.mjs'), 'utf8');
  assert.match(src, /bakeVariant\(\{ skyHex: 0x808080, background: true \}\)/);
  assert.match(src, /bakeVariant\(\{ skyHex: 0x808080, hemi: true \}\)/);
  assert.match(src, /bakeVariant\(\{ skyHex: 0x808080, disc: true \}\)/);
  assert.throws(() => worldBareResults({ ...worldBareFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldBareResults({ ...worldBareFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldBareResults({ ...worldBareFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldBareResults({ ...worldBareFixture(), backgroundIsCombined: true }), /background isolation still combined/);
  assert.throws(() => worldBareResults({ ...worldBareFixture(), backgroundClearsGray: true }), /background isolation clears IBL-off/);
  assert.throws(() => worldBareResults({ ...worldBareFixture(), backgroundClearsHue: true }), /background isolation clears gray cubemap hue/);
  assert.throws(() => worldBareResults({ ...worldBareFixture(), hemiClearsBackground: true }), /hemi isolation clears bare 0x808080 background/);
  assert.throws(() => worldBareResults({ ...worldBareFixture(), hueClearsGray: true }), /hue isolation clears IBL-off/);
  assert.throws(() => worldBareResults({ ...worldBareFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldBareResults({ ...worldBareFixture(), backgroundDeltasUseGrayBaseline: false }), /background vs hemi vs disc still uses product present as baseline/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked bare poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(BARE_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(BARE_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(BARE_FRAMES[3].night, true);
  assert.equal(dominantBare(worldBareFixture().frames[0].layers), 'hue');
});

test('bare-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldBareResults(worldBareFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-bare evidence fails closed: ${name}`, () => {
  const r = worldBareFixture();
  mutate(r);
  assert.throws(() => worldBareResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldBareFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldBareResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldBareFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldBareResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during bare sampling', () => {
  const r = worldBareFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldBareResults(r));
});

test('invalid world-bare report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-bare-invalid-'));
  try {
    const r = worldBareFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldBare(r, out));
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
  assert.match(src, /import \{ verifyWorldGain \} from '\.\/world-gain-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldCube \} from '\.\/world-cube-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldProbe \} from '\.\/world-probe-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldBake \} from '\.\/world-bake-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldSky \} from '\.\/world-sky-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldGray \} from '\.\/world-gray-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldBare \} from '\.\/world-bare-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldFlat \} from '\.\/world-flat-browser\.mjs';/);
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
  assert.match(src, /verifyWorldGain\(browser, url\)/);
  assert.match(src, /verifyWorldCube\(browser, url\)/);
  assert.match(src, /verifyWorldProbe\(browser, url\)/);
  assert.match(src, /verifyWorldBake\(browser, url\)/);
  assert.match(src, /verifyWorldSky\(browser, url\)/);
  assert.match(src, /verifyWorldGray\(browser, url\)/);
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
