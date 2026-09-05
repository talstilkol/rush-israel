import assert from "node:assert/strict";
import { test } from "node:test";
import { drawMinimapRoute, minimapPreviewIndices, sampleMinimapPolyline } from "../src/game/minimap-route.ts";
function context() {
  const calls = [];
  return { calls, beginPath() { calls.push(["begin"]); }, moveTo(x, z) { calls.push(["move", x, z]); }, lineTo(x, z) { calls.push(["line", x, z]); }, closePath() { calls.push(["close"]); } };
}
const points = [{ x: 0, z: 0 }, { x: 10, z: 50 }, { x: 100, z: 80 }];
test("open minimap has no artificial finish-to-start connector", () => {
  const c = context(); drawMinimapRoute(c, points, x => x, z => z, true);
  assert.deepEqual(c.calls, [["begin"], ["move", 0, 0], ["line", 10, 50], ["line", 100, 80]]);
});
test("closed minimap still closes its circuit exactly once", () => {
  const c = context(); drawMinimapRoute(c, points, x => x * 2, z => z * 2, false);
  assert.deepEqual(c.calls.at(-1), ["close"]);
  assert.equal(c.calls.filter(call => call[0] === "close").length, 1);
  assert.deepEqual(c.calls[2], ["line", 20, 100]);
});
test("open progress clamps to the finish instead of wrapping", () => {
  for (const progress of [1, 1.01, 2, 10]) assert.deepEqual(minimapPreviewIndices(100, progress, true), [99]);
});
test("open preview stops at the last point near the finish", () => {
  const indices = minimapPreviewIndices(100, 0.99, true);
  assert.deepEqual(indices, [98, 99]);
});
test("open negative or nonfinite progress cannot address outside the polyline", () => {
  for (const value of [-1, -0.1, NaN, Infinity, -Infinity]) {
    const indices = minimapPreviewIndices(12, value, true);
    assert.equal(indices[0], 0);
    assert.ok(indices.every(i => i >= 0 && i < 12));
  }
});
test("loop preview still crosses the start line", () => {
  assert.deepEqual(minimapPreviewIndices(10, 0.9, false), [9, 0, 1, 2, 3, 4, 5, 6]);
  assert.equal(minimapPreviewIndices(10, 1, false)[0], 0);
  assert.equal(minimapPreviewIndices(10, -0.1, false)[0], 9);
});
test("zero or invalid point counts are harmless", () => {
  for (const count of [0, -1, NaN, Infinity, 1.5]) assert.deepEqual(minimapPreviewIndices(count, 1, true), []);
});
test("tiny polylines never duplicate points or index outside the array", () => {
  for (const open of [true, false]) for (let count = 1; count <= 8; count++) {
    const indices = minimapPreviewIndices(count, 0, open);
    assert.equal(new Set(indices).size, indices.length);
    assert.ok(indices.every(index => index < count));
  }
});
test("open downsampling includes the exact final sample for every stride remainder", () => {
  for (let count = 1; count <= 20; count++) {
    const samples = Array.from({ length: count }, (_, i) => ({ x: i, z: i * 3 }));
    const line = sampleMinimapPolyline(samples, true);
    assert.deepEqual(line.at(-1), samples.at(-1));
    assert.notEqual(line.at(-1), samples.at(-1));
    assert.equal(line.filter(point => point.x === count - 1).length, 1);
  }
});
test("loop downsampling keeps the pre-repair stride and empty input is safe", () => {
  assert.deepEqual(sampleMinimapPolyline([], true), []);
  const samples = Array.from({ length: 12 }, (_, i) => ({ x: i, z: 0 }));
  assert.deepEqual(sampleMinimapPolyline(samples, false).map(point => point.x), [0, 4, 8]);
});
