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
  FAILURE_LIMIT, PIXEL_THRESHOLD, SCENE_FRAMES, SCENE_PIXELS, classifyResidual,
  retainWorldScene, sceneBufferIsNotOriginalGolden, scenePixelmatch,
  structuredKindIsNotSceneMismatch, worldSceneFixture, worldSceneResults,
} from './world-scene-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES, VIEWPORT } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('raw renderer.render without presentPct is not product present mismatch', () => {
  assert.equal(structuredKindIsNotSceneMismatch({ frames: [] }), true);
  assert.equal(structuredKindIsNotSceneMismatch({
    frames: [{ id: 'g01', kind: 'structured', rawPct: 0.52, flippedMismatch: 49 }],
  }), true);
  assert.equal(structuredKindIsNotSceneMismatch(worldSceneFixture()), false);
  const rawOnly = worldSceneFixture();
  rawOnly.frames = rawOnly.frames.map(frame => ({
    id: frame.id, kind: 'structured', rawPct: 0.52, rawMismatched: frame.rawMismatched,
    flippedMismatch: 49, pixelThreshold: PIXEL_THRESHOLD,
  }));
  assert.equal(structuredKindIsNotSceneMismatch(rawOnly), true);
  assert.throws(() => worldSceneResults(rawOnly), /raw renderer.render is not present-path mismatch/);
});

test('scene buffer without original-golden protocol identity is not original-golden', () => {
  assert.equal(sceneBufferIsNotOriginalGolden(worldSceneFixture()), false);
  assert.equal(sceneBufferIsNotOriginalGolden({
    ...worldSceneFixture(), originalGoldenComparisons: 4, protocol: 'original-golden',
  }), true);
  assert.equal(PIXEL_THRESHOLD, 0.12);
  assert.equal(FAILURE_LIMIT, 0.08);
  assert.equal(SCENE_PIXELS, VIEWPORT.width * VIEWPORT.height);
});

test('identical PNG pixelmatch is zero at threshold 0.12', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const png = PNG.sync.read(buf);
  const match = scenePixelmatch(png, png);
  assert.equal(match.mismatched, 0);
  assert.equal(match.pct, 0);
  assert.equal(match.threshold, PIXEL_THRESHOLD);
  const other = PNG.sync.read(readFileSync(fromRoot('golden-baseline', 'ayalon-day-g05.png')));
  assert.equal(scenePixelmatch(png, other).mismatched > 0, true);
});

test('locked scene poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(SCENE_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(SCENE_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(SCENE_FRAMES[3].night, true);
  const ramps = [{ x: 0, z: 0, half: 10.2, len: 46 }];
  assert.equal(classifyResidual({
    isMesh: true,
    geometry: { type: 'BoxGeometry', parameters: { width: 8, height: 12, depth: 8 } },
    material: { type: 'MeshPhysicalMaterial', ior: 1.5, transparent: false },
  }, ramps), 'glass');
});

test('scene-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldSceneResults(worldSceneFixture()).map(row => row.status), Array(5).fill('passed'));
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
]) test(`world-scene evidence fails closed: ${name}`, () => {
  const r = worldSceneFixture();
  mutate(r);
  assert.throws(() => worldSceneResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldSceneFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldSceneResults(r), /baseline hash drift/);
});

test('zero full-frame present mismatch remains failed', () => {
  const r = worldSceneFixture();
  r.frames[0] = { ...r.frames[0], presentPct: 0, presentMismatched: 0, scenePct: 0, mismatched: 0 };
  const row = worldSceneResults(r).find(item => item.case.includes('still mismatches'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during scene matching', () => {
  const r = worldSceneFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldSceneResults(r));
});

test('invalid world-scene report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-scene-invalid-'));
  try {
    const r = worldSceneFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldScene(r, out));
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

test('smoke keeps world-layer residual mismatch bias scene region and column probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldLayers \} from '\.\/world-layer-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldResidual \} from '\.\/world-residual-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldMismatch \} from '\.\/world-mismatch-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldBias \} from '\.\/world-bias-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldScene \} from '\.\/world-scene-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldRegion \} from '\.\/world-region-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldColumn \} from '\.\/world-column-browser\.mjs';/);
  assert.match(src, /verifyWorldLayers\(browser, url\)/);
  assert.match(src, /verifyWorldResidual\(browser, url\)/);
  assert.match(src, /verifyWorldMismatch\(browser, url\)/);
  assert.match(src, /verifyWorldBias\(browser, url\)/);
  assert.match(src, /verifyWorldScene\(browser, url\)/);
  assert.match(src, /verifyWorldRegion\(browser, url\)/);
  assert.match(src, /verifyWorldColumn\(browser, url\)/);
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
