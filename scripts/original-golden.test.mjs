import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fromRoot } from './project-root.mjs';
import {
  FAILURE_LIMIT, HISTORICAL_ZERO_OF_FOUR_RUN, LOCK_GENERATION, ORIGINAL_GOLDEN_FILES,
  PIXEL_THRESHOLD, RSH035_BASELINE_SHA256, VIEWPORT, historicalZeroOfFourIsNotPostChaseEvidence,
  originalGoldenResults, retainOriginalGolden, steeringCaptureIsNotOriginalGolden,
} from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

function frame(file, extra = {}) {
  return { file, pct: 0.01, mismatched: 100, night: file.includes('night'), ...extra };
}

function fixture(extra = {}) {
  return {
    status: 'compared',
    protocol: 'original-pixel-golden',
    updateGolden: false,
    baselineUpdates: 0,
    authority: false,
    freezeGranted: false,
    comparisons: 4,
    pixelThreshold: PIXEL_THRESHOLD,
    failureLimit: FAILURE_LIMIT,
    viewport: { ...VIEWPORT, dpr: 1 },
    lockGeneration: LOCK_GENERATION,
    photo: false,
    webgpuOk: false,
    pageErrors: [],
    glError: 0,
    baselineHashes: { ...RSH035_BASELINE_SHA256 },
    frames: ORIGINAL_GOLDEN_FILES.map(file => frame(file)),
    ...extra,
  };
}

test('non-authority capture is not original-golden comparison', () => {
  assert.equal(steeringCaptureIsNotOriginalGolden({
    status: 'captured_and_steering_checked_not_compared',
    authority: false,
    comparisons: 0,
  }), true);
  assert.equal(steeringCaptureIsNotOriginalGolden({
    status: 'captured_not_compared',
    comparisons: 0,
  }), true);
  assert.equal(steeringCaptureIsNotOriginalGolden({ status: 'compared', comparisons: 4 }), false);
});

test('historical 0/4 from preparation 34324754353 is not post-r6.21 evidence', () => {
  assert.equal(historicalZeroOfFourIsNotPostChaseEvidence({ runId: HISTORICAL_ZERO_OF_FOUR_RUN }), true);
  assert.equal(historicalZeroOfFourIsNotPostChaseEvidence({ golden_source: 'preparation 34324754353' }), true);
  assert.equal(historicalZeroOfFourIsNotPostChaseEvidence({ runId: '34449950487' }), false);
});

test('compared original-golden evidence yields three protocol passes', () => {
  const rows = originalGoldenResults(fixture());
  assert.deepEqual(rows.filter(row => row.blocking !== false).map(row => row.status), ['passed', 'passed', 'passed']);
  assert.equal(rows.find(row => row.blocking === false).status, 'passed');
});

for (const [name, mutate] of [
  ['skipped comparison', r => { r.comparisons = 0; r.status = 'captured_not_compared'; }],
  ['missing frames', r => { r.frames = r.frames.slice(0, 2); }],
  ['threshold drift', r => { r.pixelThreshold = 0.2; }],
  ['failure-limit drift', r => { r.failureLimit = 0.2; }],
  ['viewport width', r => { r.viewport.width = 1920; }],
  ['viewport height', r => { r.viewport.height = 1080; }],
  ['photo camera', r => { r.photo = true; }],
  ['baseline hash drift', r => { r.baselineHashes['ayalon-day-g01.png'] = '0'.repeat(64); }],
  ['lock generation', r => { r.lockGeneration = 12; }],
  ['page error', r => r.pageErrors.push('boom')],
  ['UPDATE_GOLDEN', r => { r.updateGolden = true; }],
  ['baseline rewrite', r => { r.baselineUpdates = 1; }],
]) test(`original-golden evidence fails closed: ${name}`, () => {
  const r = fixture();
  mutate(r);
  assert.throws(() => originalGoldenResults(r));
});

test('pixel mismatch remains failed and cannot be relabelled a pass', () => {
  const r = fixture({ frames: ORIGINAL_GOLDEN_FILES.map(file => frame(file, { pct: 0.42, mismatched: 430080 })) });
  const pixel = originalGoldenResults(r).find(row => row.blocking === false);
  assert.equal(pixel.status, 'failed');
  assert.equal(pixel.failures, 4);
});

test('a mixed 1/4 mismatch still fails the pixel gate', () => {
  const r = fixture();
  r.frames[0] = frame('ayalon-day-g01.png', { pct: 0.09, mismatched: 92160 });
  const pixel = originalGoldenResults(r).find(row => row.blocking === false);
  assert.equal(pixel.status, 'failed');
  assert.equal(pixel.failures, 1);
});

test('invalid original-golden report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'original-golden-invalid-'));
  try {
    const r = fixture({ comparisons: 0, status: 'captured_not_compared' });
    await assert.rejects(retainOriginalGolden(r, out));
    assert.equal(JSON.parse(await readFile(join(out, 'results.json'), 'utf8')).comparisons, 0);
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});

test('pixel-golden.mjs still pins the original protocol tokens', () => {
  const src = readFileSync(fromRoot('scripts', 'pixel-golden.mjs'), 'utf8');
  assert.match(src, /threshold: 0\.12/);
  assert.match(src, /failureLimit: 0\.08/);
  assert.match(src, /width: 1280, height: 800/);
  assert.match(src, /Automatic golden baseline updates are forbidden/);
  assert.match(src, /gotoGolden\(gid\)/);
  assert.match(src, /setNight\(true\)/);
  assert.match(src, /ayalon-night-g08\.png/);
});

test('capture-golden.mjs remains a non-authority capture', () => {
  const src = readFileSync(fromRoot('scripts', 'capture-golden.mjs'), 'utf8');
  assert.match(src, /Not a golden comparison/);
  assert.match(src, /authority: false, comparisons: 0/);
});

test('RSH-035 original PNG bytes are unchanged on disk', () => {
  for (const name of ORIGINAL_GOLDEN_FILES) {
    const bytes = readFileSync(fromRoot('golden-baseline', name));
    assert.equal(sha256(bytes), RSH035_BASELINE_SHA256[name], name);
  }
});

test('rest chase remains the 26 August 7.4/1.92 lock', () => {
  const src = readFileSync(fromRoot('src', 'game', 'engine', 'rendering-adapter.ts'), 'utf8');
  assert.match(src, /let follow = 7\.4 \+ clamp\(Math\.abs\(p\.speed\) \/ 22, 0, 2\.2\);/);
  assert.match(src, /let height = 1\.92;/);
});

test('ayalon.lock generation 11 and freeze PNG-change count stay', () => {
  const lock = JSON.parse(readFileSync(fromRoot('golden-baseline', 'ayalon.lock'), 'utf8'));
  assert.equal(lock.lock, LOCK_GENERATION);
  const freeze = JSON.parse(readFileSync(fromRoot('AYALON-FREEZE-MANIFEST.json'), 'utf8'));
  assert.equal(freeze.lock.ayalon_lock_generation, LOCK_GENERATION);
  assert.equal(freeze.lock.pixel_threshold, PIXEL_THRESHOLD);
  assert.equal(freeze.lock.pixel_fail_percent, 8);
  assert.equal(freeze.preservation.golden_png_changes, 0);
});
