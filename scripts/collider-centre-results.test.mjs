import assert from 'node:assert/strict';
import { test } from 'node:test';
import { colliderCentreResults } from './collider-centre-browser.mjs';
const report = () => ({ colliderCount: 546, rampCount: 50, routeSamples: 781, checkpointCount: 8, pageErrors: [], glError: 0,
  circularIndices: [0], rows: [
    { index: 0, moving: false, radius: 2, kind: 'barrier', distance: 2, x: 2, y: 3, z: 0, expectedX: 2, expectedZ: 0, velocityInto: 0, lastHit: '', finite: true },
    { index: 0, moving: true, radius: 2, kind: 'barrier', distance: 2, x: -1.2, y: 3, z: -1.6, expectedX: -1.2, expectedZ: -1.6, velocityInto: 1, lastHit: 'barrier', finite: true },
  ] });
test('complete stationary and moving contact evidence yields two scoped passes', () => {
  assert.deepEqual(colliderCentreResults(report()).map(r => r.status), ['passed', 'passed']);
});
test('a skipped centre is a failed collision, not a successful finite-state check', () => {
  const r = report(); Object.assign(r.rows[0], { x: 0, z: 0, distance: 0 });
  assert.equal(colliderCentreResults(r)[0].status, 'failed');
});
test('nonfinite contact coordinates fail closed even with a forged finite flag', () => {
  const r = report(); r.rows[0].x = NaN; assert.throws(() => colliderCentreResults(r));
});
test('omitted circular catalogue indices cannot produce a partial pass', () => {
  const r = report(); r.circularIndices.push(7); assert.throws(() => colliderCentreResults(r), /all circular/);
});
test('duplicated contact rows are rejected', () => {
  const r = report(); r.rows.push(...structuredClone(r.rows)); assert.throws(() => colliderCentreResults(r));
});
test('missing moving observations are rejected', () => {
  const r = report(); r.rows.pop(); assert.throws(() => colliderCentreResults(r));
});
test('inward post-contact velocity fails the moving contract', () => {
  const r = report(); r.rows[1].velocityInto = -1; assert.equal(colliderCentreResults(r)[1].status, 'failed');
});
test('contact cannot modify vertical support', () => {
  const r = report(); r.rows[0].y = 4; assert.equal(colliderCentreResults(r)[0].status, 'failed');
});
test('page and GL errors invalidate the measurements', () => {
  const a = report(); a.pageErrors.push('error'); assert.throws(() => colliderCentreResults(a));
  const b = report(); b.glError = 1282; assert.throws(() => colliderCentreResults(b));
});
test('changed catalogue counts fail rather than silently accepting lost obstacles', () => {
  const r = report(); r.colliderCount = 545; assert.throws(() => colliderCentreResults(r));
});
