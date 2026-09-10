import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fromRoot } from './project-root.mjs';
import {
  BIAS_FRAMES, BIAS_KINDS, CHANNEL_EPS, SAMPLE_TOTAL, classifyBiasKind, classifyResidual,
  pngSampleGrid, pngSampleGridUnflipped, retainWorldBias, sampleChannelBias, sampleMismatchCount,
  saturationCountIsNotChannelBias, unpackRgb, worldBiasFixture, worldBiasResults,
} from './world-bias-browser.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('7x7 saturation without channel stats is not bias attribution', () => {
  assert.equal(saturationCountIsNotChannelBias({ frames: [] }), true);
  assert.equal(saturationCountIsNotChannelBias({
    frames: [{ id: 'g01', flippedMismatch: 49 }],
  }), true);
  assert.equal(saturationCountIsNotChannelBias(worldBiasFixture()), false);
  const countOnly = worldBiasFixture();
  countOnly.frames = countOnly.frames.map(frame => ({
    id: frame.id, flippedMismatch: 49, unflippedMismatch: 49,
  }));
  assert.equal(saturationCountIsNotChannelBias(countOnly), true);
  assert.throws(() => worldBiasResults(countOnly), /7x7 saturation is not channel-bias/);
});

test('png 7x7 flipped grid mismatches the unflipped grid and matches itself', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const flipped = pngSampleGrid(buf);
  const unflipped = pngSampleGridUnflipped(buf);
  assert.equal(flipped.length, SAMPLE_TOTAL);
  assert.equal(unflipped.length, SAMPLE_TOTAL);
  assert.equal(sampleMismatchCount(flipped, flipped), 0);
  assert.equal(sampleMismatchCount(unflipped, unflipped), 0);
  assert.equal(sampleMismatchCount(flipped, unflipped) >= 1, true);
  assert.equal(CHANNEL_EPS, 8);
  assert.deepEqual(unpackRgb(0x010203), { r: 3, g: 2, b: 1 });
});

test('channel bias of identical samples is zero and uniform', () => {
  const buf = readFileSync(fromRoot('golden-baseline', 'ayalon-day-g01.png'));
  const grid = pngSampleGrid(buf);
  const bias = sampleChannelBias(grid, grid);
  assert.equal(bias.mismatch, 0);
  assert.equal(bias.meanDr, 0);
  assert.equal(bias.meanDg, 0);
  assert.equal(bias.meanDb, 0);
  assert.equal(bias.meanDluma, 0);
  assert.equal(bias.lumaVariance, 0);
  assert.equal(bias.signAgreement, 1);
  const brighter = grid.map(value => {
    const rgb = unpackRgb(value);
    return Math.min(255, rgb.r + 20) | (Math.min(255, rgb.g + 20) << 8) | (Math.min(255, rgb.b + 20) << 16);
  });
  const lift = sampleChannelBias(brighter, grid);
  assert.equal(lift.meanDr > 10, true);
  assert.equal(lift.signAgreement >= 0.8, true);
  assert.equal(classifyBiasKind(lift, lift), 'uniform-bias');
  const worseFlip = { ...lift, mismatch: 40 };
  const betterUnflip = { ...lift, mismatch: 10 };
  assert.equal(classifyBiasKind(worseFlip, betterUnflip), 'y-flip-artifact');
  assert.deepEqual(BIAS_KINDS, ['uniform-bias', 'structured', 'y-flip-artifact']);
});

test('locked bias poses match original-golden cameras and PNG hashes', () => {
  assert.deepEqual(BIAS_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(BIAS_FRAMES.map(row => row.file), ORIGINAL_GOLDEN_FILES);
  assert.equal(BIAS_FRAMES[3].night, true);
  const ramps = [{ x: 0, z: 0, half: 10.2, len: 46 }];
  assert.equal(classifyResidual({
    isMesh: true,
    geometry: { type: 'BoxGeometry', parameters: { width: 8, height: 12, depth: 8 } },
    material: { type: 'MeshPhysicalMaterial', ior: 1.5, transparent: false },
  }, ramps), 'glass');
});

test('bias-attribution evidence yields five protocol passes', () => {
  assert.deepEqual(worldBiasResults(worldBiasFixture()).map(row => row.status), Array(5).fill('passed'));
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
  ['missing kind', r => { r.frames[0] = { ...r.frames[0], kind: 'whole-frame' }; }],
]) test(`world-bias evidence fails closed: ${name}`, () => {
  const r = worldBiasFixture();
  mutate(r);
  assert.throws(() => worldBiasResults(r));
});

test('baseline PNG hash drift fails closed', () => {
  const r = worldBiasFixture();
  r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64);
  assert.throws(() => worldBiasResults(r), /baseline hash drift/);
});

test('zero mismatch on both Y-orientations remains failed', () => {
  const r = worldBiasFixture();
  r.frames[0] = { ...r.frames[0], flippedMismatch: 0, unflippedMismatch: 0 };
  const row = worldBiasResults(r).find(item => item.case.includes('still mismatch'));
  assert.equal(row.status, 'failed');
  assert.equal(row.failures, 1);
});

test('a rest-camera miss remains failed during bias measurement', () => {
  const r = worldBiasFixture();
  r.frames[1] = { ...r.frames[1], follow: 9.2, height: 2.28 };
  assert.throws(() => worldBiasResults(r));
});

test('invalid world-bias report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'world-bias-invalid-'));
  try {
    const r = worldBiasFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainWorldBias(r, out));
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

test('smoke keeps world-layer residual mismatch and bias probes', () => {
  const src = readFileSync(fromRoot('scripts', 'runtime-recovery-smoke.mjs'), 'utf8');
  assert.match(src, /import \{ verifyWorldLayers \} from '\.\/world-layer-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldResidual \} from '\.\/world-residual-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldMismatch \} from '\.\/world-mismatch-browser\.mjs';/);
  assert.match(src, /import \{ verifyWorldBias \} from '\.\/world-bias-browser\.mjs';/);
  assert.match(src, /verifyWorldLayers\(browser, url\)/);
  assert.match(src, /verifyWorldResidual\(browser, url\)/);
  assert.match(src, /verifyWorldMismatch\(browser, url\)/);
  assert.match(src, /verifyWorldBias\(browser, url\)/);
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
