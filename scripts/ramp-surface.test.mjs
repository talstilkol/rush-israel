import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fitRampSlab } from '../src/game/ramp-surface.ts';

function box(length = 68, thickness = 0.95, half = 10.2) {
  const vertices = [];
  for (const x of [-half, half]) for (const y of [-thickness / 2, thickness / 2]) for (const z of [-length / 2, length / 2]) vertices.push([x, y, z]);
  const calls = [];
  const position = { count: vertices.length, getY: i => vertices[i][1], getZ: i => vertices[i][2],
    setY: (i, y) => { vertices[i][1] = y; }, needsUpdate: false };
  return { vertices, calls, position, getAttribute: () => position,
    computeVertexNormals() { calls.push('normals'); }, computeBoundingBox() { calls.push('box'); }, computeBoundingSphere() { calls.push('sphere'); } };
}
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-12, `${a} != ${b}`);
for (const [label, rise] of [['uphill', 8.9], ['downhill', -8.9], ['flat', 0], ['steep', 9.05]]) {
  test(`${label} slab top follows the physics plane at both endpoints`, () => {
    const geometry = box(); const top = geometry.vertices.map((v, i) => v[1] > 0 ? i : -1).filter(i => i >= 0);
    fitRampSlab(geometry, 68, rise, 0.95);
    for (const i of top) { const v = geometry.vertices[i]; close(v[1], rise * v[2] / 68); }
  });
  test(`${label} slab preserves full horizontal footprint and vertical thickness`, () => {
    const geometry = box(); const xz = geometry.vertices.map(([x, , z]) => [x, z]);
    fitRampSlab(geometry, 68, rise, 0.95);
    assert.deepEqual(geometry.vertices.map(([x, , z]) => [x, z]), xz);
    for (let i = 0; i < 8; i += 4) for (let j = 0; j < 2; j++) close(geometry.vertices[i + j + 2][1] - geometry.vertices[i + j][1], 0.95);
  });
}
test('short painted strips use the full ramp slope, with their underside on the deck', () => {
  const geometry = box(68 * 0.94, 0.08, 0.09), old = geometry.vertices.map(v => [...v]);
  fitRampSlab(geometry, 68, 8.9, 0.08, 0.08);
  for (let i = 0; i < old.length; i++) close(geometry.vertices[i][1], old[i][2] * 8.9 / 68 + (old[i][1] > 0 ? 0.08 : 0));
});
test('all geometry derivatives are refreshed after positions change', () => {
  const geometry = box(); assert.equal(fitRampSlab(geometry, 68, 8.9, 0.95), geometry);
  assert.equal(geometry.position.needsUpdate, true); assert.deepEqual(geometry.calls, ['normals', 'box', 'sphere']);
});
test('unrelated geometry has no shared mutable ramp state', () => {
  const a = box(), b = box(); fitRampSlab(a, 68, 8.9, 0.95); assert.notDeepEqual(a.vertices, b.vertices);
});
for (const args of [[0, 1, 1], [-1, 1, 1], [Infinity, 1, 1], [1, NaN, 1], [1, 1, 0], [1, 1, -1], [1, 1, Infinity], [1, 1, 1, NaN]]) {
  test(`invalid slab inputs fail before mutation: ${args.map(String).join(',')}`, () => {
    const geometry = box(), old = geometry.vertices.map(v => [...v]);
    assert.throws(() => fitRampSlab(geometry, ...args), RangeError); assert.deepEqual(geometry.vertices, old); assert.deepEqual(geometry.calls, []);
  });
}
test('missing vertex data fails closed', () => {
  assert.throws(() => fitRampSlab({ getAttribute: () => null }, 68, 8.9, 0.95), /position vertices/);
});
