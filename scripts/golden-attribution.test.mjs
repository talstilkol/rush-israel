import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fromRoot } from './project-root.mjs';
import {
  ATTRIBUTION_FRAMES, CAMERA_EPS, HISTORICAL_COLLIDERS, HISTORICAL_RAMPS, LOCKED_FOV,
  R68_CAMERA_DY, R68_CAMERA_DZ, SCENE_LIT_MIN, attributionFixture, goldenAttributionResults,
  hudOnBlackIsNotSceneComparison, r68CameraDeltaIsNotPostRestoreAttribution, restCameraMatchesLock,
  restOffset, retainGoldenAttribution,
} from './golden-attribution-browser.mjs';
import {
  GOLDEN_ATTRIBUTION_CAMERA_DY, GOLDEN_ATTRIBUTION_CAMERA_DZ,
  LOCKED_CHASE_FOLLOW_BASE, LOCKED_CHASE_HEIGHT,
} from './rsh036-overlay.mjs';
import { RSH035_BASELINE_SHA256, ORIGINAL_GOLDEN_FILES } from './original-golden-browser.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

test('r6.8 0.36/1.8 camera delta is not post-r6.21 attribution', () => {
  assert.equal(R68_CAMERA_DY, 0.36);
  assert.equal(R68_CAMERA_DZ, -1.8);
  assert.equal(GOLDEN_ATTRIBUTION_CAMERA_DY, 0.36);
  assert.equal(GOLDEN_ATTRIBUTION_CAMERA_DZ, -1.8);
  assert.equal(r68CameraDeltaIsNotPostRestoreAttribution({ delta_camera_y: 0.36, delta_camera_z: -1.8 }), true);
  assert.equal(r68CameraDeltaIsNotPostRestoreAttribution({ deltaY: 0, deltaZ: 0 }), false);
  assert.equal(r68CameraDeltaIsNotPostRestoreAttribution({ deltaY: 0.01, deltaZ: -0.02 }), false);
});

test('HUD-on-black capture is not scene comparison', () => {
  assert.equal(hudOnBlackIsNotSceneComparison({ nonBlackFraction: 0.02 }), true);
  assert.equal(hudOnBlackIsNotSceneComparison({ nonBlackFraction: 0 }), true);
  assert.equal(hudOnBlackIsNotSceneComparison({}), true);
  assert.equal(hudOnBlackIsNotSceneComparison({ nonBlackFraction: 0.42 }), false);
  assert.ok(SCENE_LIT_MIN <= 0.15);
});

test('historical rest offset is 7.4 follow and 1.92 height', () => {
  const player = [1061.4374999999397, 1.2085515392881334, -1048.6344000000424];
  const camera = [1061.4374999999397, 3.128551539288133, -1056.0344000000425];
  const offset = restOffset(player, camera);
  assert.ok(Math.abs(offset.follow - LOCKED_CHASE_FOLLOW_BASE) < 1e-9);
  assert.ok(Math.abs(offset.height - LOCKED_CHASE_HEIGHT) < 1e-9);
  assert.equal(LOCKED_FOV, 58);
});

test('drifted 9.2/2.28 rest offset is the r6.8 0.36/1.8 pair', () => {
  const player = [1061.4374999999397, 1.2085515392881334, -1048.6344000000424];
  const drifted = [1061.4374999999397, 3.4885515392881334, -1057.8344000000425];
  const offset = restOffset(player, drifted);
  assert.ok(Math.abs(offset.follow - 9.2) < 1e-9);
  assert.ok(Math.abs(offset.height - 2.28) < 1e-9);
  assert.ok(Math.abs(offset.dy - 0.36 - LOCKED_CHASE_HEIGHT) < 1e-9 || Math.abs(offset.height - LOCKED_CHASE_HEIGHT - 0.36) < 1e-9);
  assert.ok(Math.abs(offset.follow - LOCKED_CHASE_FOLLOW_BASE - 1.8) < 1e-9);
});

test('matched rest camera is not the drifted r6.8 pair', () => {
  const row = { follow: 7.4, height: 1.92, fov: 58, deltaY: 0, deltaZ: 0 };
  assert.equal(restCameraMatchesLock(row), true);
  assert.equal(r68CameraDeltaIsNotPostRestoreAttribution(row), false);
  assert.equal(restCameraMatchesLock({ follow: 9.2, height: 2.28, fov: 58 }), false);
});

test('live rest-camera evidence yields six protocol passes', () => {
  assert.deepEqual(goldenAttributionResults(attributionFixture()).map(row => row.status), Array(6).fill('passed'));
});

for (const [name, mutate] of [
  ['lost collider', r => { r.colliderCount = 721; }],
  ['lost pier', r => { r.pierCount = 175; }],
  ['lost ramp', r => { r.rampCount = 49; }],
  ['lost checkpoint', r => { r.checkpointCount = 7; }],
  ['page error', r => r.pageErrors.push('error')],
  ['gl error', r => { r.glError = 1; }],
  ['missing frames', r => { r.frames = r.frames.slice(0, 2); }],
  ['PNG refresh', r => { r.updateGolden = true; }],
  ['baseline rewrite', r => { r.baselineUpdates = 1; }],
  ['authority claim', r => { r.authority = true; }],
  ['original-golden comparisons', r => { r.originalGoldenComparisons = 4; }],
]) test(`golden-attribution evidence fails closed: ${name}`, () => {
  const r = attributionFixture();
  mutate(r);
  assert.throws(() => goldenAttributionResults(r));
});

test('stale r6.8 camera deltas fail closed as post-restore attribution', () => {
  const r = attributionFixture();
  r.frames = r.frames.map(frame => ({ ...frame, delta_camera_y: 0.36, delta_camera_z: -1.8, follow: 9.2, height: 2.28 }));
  assert.throws(() => goldenAttributionResults(r), /r6\.8 0\.36\/1\.8/);
});

test('HUD-on-black labelled as world-divergence fails closed', () => {
  const r = attributionFixture();
  r.frames[0] = { ...r.frames[0], nonBlackFraction: 0.01, litSamples: 0, attribution: 'world' };
  assert.throws(() => goldenAttributionResults(r), /HUD-on-black/);
});

test('a rest-camera miss remains failed and cannot be relabelled a pass', () => {
  const r = attributionFixture();
  r.frames[0] = { ...r.frames[0], follow: 9.2, height: 2.28, attribution: 'camera' };
  const camera = goldenAttributionResults(r).find(row => row.case.includes('7.4/1.92'));
  assert.equal(camera.status, 'failed');
  assert.equal(camera.failures, 1);
});

test('an unlit scene buffer remains failed', () => {
  const r = attributionFixture();
  r.frames[2] = { ...r.frames[2], nonBlackFraction: 0.04, litSamples: 2, attribution: 'empty-canvas' };
  const scene = goldenAttributionResults(r).find(row => row.case.includes('lit'));
  assert.equal(scene.status, 'failed');
  assert.equal(scene.failures, 1);
});

test('invalid attribution report is retained before validation throws', async () => {
  const out = await mkdtemp(join(tmpdir(), 'golden-attribution-invalid-'));
  try {
    const r = attributionFixture({ originalGoldenComparisons: 4 });
    await assert.rejects(retainGoldenAttribution(r, out));
    assert.equal(JSON.parse(await readFile(join(out, 'results.json'), 'utf8')).originalGoldenComparisons, 4);
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});

test('r6.24 0/4 mismatch cannot be attributed to the restored rest chase', () => {
  const r = attributionFixture();
  const results = goldenAttributionResults(r);
  assert.equal(results.find(row => row.case.includes('7.4/1.92')).status, 'passed');
  assert.equal(r.rampCount - HISTORICAL_RAMPS, 18);
  assert.equal(r.colliderCount - HISTORICAL_COLLIDERS, 181);
  assert.equal(r.originalGoldenComparisons, 0);
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

test('four attribution poses match the original golden cameras', () => {
  assert.deepEqual(ATTRIBUTION_FRAMES.map(row => row.id), ['g01', 'g05', 'g07', 'g08']);
  assert.deepEqual(ATTRIBUTION_FRAMES.map(row => row.t), [0.04, 0.46, 0.62, 0.48]);
  assert.equal(ATTRIBUTION_FRAMES[3].night, true);
  assert.equal(CAMERA_EPS, 0.05);
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
