import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rampContactResults } from './ramp-contact-browser.mjs';

// These are report-validator fixtures only, not simulated driving evidence.
const report = () => ({ rampCount: 50, colliderCount: 546, checkpointCount: 8, pageErrors: [], glError: 0,
  route: Array.from({ length: 781 }, (_, index) => ({ index, fromY: 2, toY: 2, rise: 0, overhead: 1 })),
  onDeck: Array.from({ length: 250 }, () => ({ error: 0, airborne: false })),
  trajectories: Array.from({ length: 7 }, (_, i) => ({ index: 479 + i, frames: Array.from({ length: 240 }, (_, tick) => ({ tick, x: 0, y: 2, z: tick / 12, vy: 0, change: 0 })) })),
});
test('complete consistent contact evidence retains all four checks', () => assert.ok(rampContactResults(report()).every(r => r.status === 'passed')));
test('a downward snap cannot hide behind a passing upward check', () => {
  const r = report(); Object.assign(r.route[479], { toY: 0.3, rise: -1.7 }); const result = rampContactResults(r);
  assert.equal(result[0].status, 'passed'); assert.equal(result[2].status, 'failed'); assert.equal(result[2].downwardSnaps, 1);
});
test('a smaller drift of a regressed road surface is also rejected', () => {
  const r = report(); Object.assign(r.route[480], { toY: 1.5, rise: -0.5 }); assert.equal(rampContactResults(r)[2].status, 'failed');
});
test('upward capture remains rejected', () => {
  const r = report(); Object.assign(r.route[10], { toY: 4, rise: 2 }); assert.equal(rampContactResults(r)[0].status, 'failed');
});
test('a downward jump later in a moving trajectory fails', () => {
  const r = report(); r.trajectories[0].frames[100].change = -1.7; assert.equal(rampContactResults(r)[3].status, 'failed');
});
test('a later upward jump also fails', () => {
  const r = report(); r.trajectories[6].frames[239].change = 2; assert.equal(rampContactResults(r)[3].status, 'failed');
});
test('NaN route evidence cannot be reported as zero jumps', () => {
  const r = report(); r.route[12].rise = NaN; assert.throws(() => rampContactResults(r), /nonfinite/);
});
test('missing or repeated route starts are rejected', () => {
  const r = report(); r.route[1].index = 0; assert.throws(() => rampContactResults(r), /route starts/);
});
test('claimed route delta must match measured endpoint heights', () => {
  const r = report(); r.route[10].toY = 0; assert.throws(() => rampContactResults(r), /inconsistent/);
});
test('shortened motion coverage is rejected', () => {
  const r = report(); r.trajectories[0].frames.pop(); assert.throws(() => rampContactResults(r), /trajectory frames/);
});
test('NaN motion evidence and unordered ticks are rejected', () => {
  const r = report(); r.trajectories[0].frames[1].change = NaN; assert.throws(() => rampContactResults(r), /nonfinite/);
  const ordered = report(); ordered.trajectories[0].frames[1].tick = 2; assert.throws(() => rampContactResults(ordered), /unordered/);
});
