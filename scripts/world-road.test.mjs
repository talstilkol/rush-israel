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
  BAND_PIXELS, CAR_IDS, FAILURE_LIMIT, GRAY_BASELINE_IDS, HUE_IDS, IBL_IDS, STD_IDS, LUMA_IDS,
  ROAD_BLUE_MIN, ROAD_FRAMES, ROAD_L2_MIN, ROAD_LAYERS, ROAD_LUMA_MIN,
  NEUTRAL_SKY_HEX, PIXEL_THRESHOLD, PRODUCT_EXPOSURE, PRODUCT_PMREM_SIZE, PRODUCT_SKY_HEX,
  dominantRoad, luma, roadBufferIsNotOriginalGolden, retainWorldRoad,
  lodIsNotRoadMismatch, worldRoadFixture, worldRoadResults,
} from './world-road-browser.mjs';
import { worldLodFixture } from './world-lod-browser.mjs';
import { GROUND_ALBEDO } from './world-rgb-browser.mjs';
import { REGION_BANDS, bandPixelmatch } from './world-region-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('dominant 200px lod report without road vs std vs car is not road mismatch', () => {
  assert.equal(lodIsNotRoadMismatch({ frames: [] }), true);
  assert.equal(lodIsNotRoadMismatch(worldLodFixture()), true);
  assert.equal(lodIsNotRoadMismatch(worldRoadFixture()), false);
  assert.throws(() => worldRoadResults(worldLodFixture()), /combined leftover gray cubemap vs IBL-off is not road vs all-standard vs car envMapIntensity mismatch/);
});

test('road buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(roadBufferIsNotOriginalGolden(worldRoadFixture()), false);
  assert.equal(roadBufferIsNotOriginalGolden({
    ...worldRoadFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(ROAD_L2_MIN, 8);
  assert.equal(ROAD_LUMA_MIN, 8);
  assert.equal(ROAD_BLUE_MIN, 8);
  assert.equal(PRODUCT_EXPOSURE, 0.56);
  assert.equal(PRODUCT_SKY_HEX, 0x3a9ae0);
  assert.equal(NEUTRAL_SKY_HEX, 0x808080);
  assert.equal(PRODUCT_PMREM_SIZE, 256);
  assert.equal(BAND_PIXELS, 1280 * 200);
  assert.deepEqual(ROAD_LAYERS, ['road', 'std', 'car', 'hue', 'intensity', 'fill']);
  assert.deepEqual([...LUMA_IDS], ['intensity', 'fill']);
  assert.deepEqual([...IBL_IDS], ['road']);
  assert.deepEqual([...STD_IDS], ['std']);
  assert.deepEqual([...CAR_IDS], ['car']);
  assert.deepEqual([...HUE_IDS], ['hue']);
  assert.deepEqual([...GRAY_BASELINE_IDS], ['road', 'std', 'car']);
  assert.equal(GROUND_ALBEDO.hex, 0xd0d4d8);
  assert.equal(luma({ r: 0, g: 0, b: 0 }), 0);
  const src = readFileSync(fromRoot('scripts', 'world-road-browser.mjs'), 'utf8');
  assert.match(src, /fromScene\(tmp, 0\.04\)/);
  assert.match(src, /isRoadMaterial/);
  assert.match(src, /isMeshStandardMaterial/);
  assert.match(src, /engine\.visuals\?\.\[0\]\?\.group/);
  assert.match(src, /mat\.envMapIntensity = 0/);
  assert.match(src, /skyHex: 0x808080/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), productGroundHex: 0 }), /product ground color retuned/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), productExposure: 1 }), /product exposure retuned/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), lumaTermsIncludeHemi: true }), /luma terms include hemi/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), roadIsCombined: true }), /road isolation still combined/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), roadClearsOff: true }), /road isolation clears IBL-off/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), roadClearsHue: true }), /road isolation clears gray cubemap hue/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), stdClearsRoad: true }), /std isolation uses road-only envMapIntensity/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), hueClearsOff: true }), /hue isolation clears IBL-off/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), intensityClearsIbl: true }), /intensity isolation clears scene.environment/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), roadDeltasUseGrayBaseline: false }), /road vs std vs car still uses product present as baseline/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), roadZerosRoadEnvMapIntensity: false }), /road envMapIntensity stays product during road isolation/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), stdZerosAllEnvMapIntensity: false }), /all-standard envMapIntensity stays product during std isolation/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), carZerosHeroEnvMapIntensity: false }), /hero envMapIntensity stays product during car isolation/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), sizeStaysProductPmrem: false }), /PMREM size left product 256 during road probe/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), lodKeepsGroundRoughness: false }), /ground roughness left product during road probe/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), envKeepsGroundEnvMapIntensity: false }), /ground envMapIntensity left product during road probe/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), colorManagementStaysEnabled: false }), /ColorManagement disabled during road probe/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), outputColorSpaceStaysSRGB: false }), /outputColorSpace left product sRGB during road probe/);
  assert.throws(() => worldRoadResults({ ...worldRoadFixture(), toneMappingStaysACES: false }), /toneMapping left product ACES during road probe/);
});

test('identical PNG band pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = bandPixelmatch(png, png, REGION_BANDS[3]);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.id, 'bottom');
});

test('locked road poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(ROAD_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(ROAD_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(ROAD_FRAMES[3].night, true);
  assert.equal(dominantRoad(worldRoadFixture().frames[0].layers), 'hue');
});

test('road-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldRoadResults(worldRoadFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-road evidence fails closed: ${name}`, () => {
  const r = worldRoadFixture();
  mutate(r);
  assert.throws(() => worldRoadResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldRoadFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldRoadResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldRoadFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0 };
  const row = worldRoadResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during road sampling', () => {
  const r = worldRoadFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldRoadResults(r));
});

test('invalid world-road report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-road-invalid-'));
  try {
    const r = worldRoadFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldRoad(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region column slice extra material factor rgb shade tone term beam ray ibl gain cube probe bake sky gray bare flat conv sigma mgmt lod and road probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldLod \} from '\.\/world-lod-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldRoad \} from '\.\/world-road-browser\.mjs';/);
  assert.match(src, /verifyWorldLod\(browser, url\)/);
  assert.match(src, /verifyWorldRoad\(browser, url\)/);
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
