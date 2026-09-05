import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import { fromRoot } from './project-root.mjs';

const source = readFileSync(fromRoot('src/game/world-builders/tracks/rothschild.ts'), 'utf8');
// Execute the actual construction block. A bounded matrix-store double makes
// otherwise silent out-of-bounds writes fail, independently of historical pins.
function buildFoliage(samples, code = source) {
  const start = code.indexOf('    const ficusN = ');
  const end = code.indexOf('    const benchG = ', start);
  assert.ok(start >= 0 && end > start, 'foliage construction boundaries must exist');
  const meshes = [];
  class Geometry {}
  class InstancedMesh {
    constructor(geometry, material, capacity) {
      this.capacity = capacity; this.instanceMatrix = { count: capacity }; this.count = capacity;
      this.writes = new Set(); this.geometry = geometry; this.material = material; meshes.push(this);
    }
    setMatrixAt(index) {
      assert.ok(Number.isInteger(index) && index >= 0 && index < this.capacity, `matrix ${index} exceeds capacity ${this.capacity}`);
      assert.ok(!this.writes.has(index), 'each instance must be initialized exactly once');
      this.writes.add(index);
    }
  }
  const context = { THREE: { CylinderGeometry: Geometry, SphereGeometry: Geometry, InstancedMesh },
    n: samples, built: { samples: Array.from({ length: samples }, (_, i) => ({ x: i, y: 0, z: 0, rx: 0, rz: 1 })) },
    bag: [], trunkM: {}, leafM: {}, shadows: true, colliders: [], group: { add() {} },
    _dummy: { position: { set() {} }, scale: { set() {} }, rotation: { set() {} }, updateMatrix() {}, matrix: {} } };
  runInNewContext(code.slice(start, end), context, { timeout: 2000 });
  const [trunks, leaves] = meshes;
  return { trunks, leaves, colliders: context.colliders.length };
}

test('actual 480-sample Rothschild route retains all 96 trees and 1152 canopy instances', () => {
  const { trunks, leaves, colliders } = buildFoliage(480);
  assert.equal(trunks.count, 96); assert.equal(leaves.count, 1152); assert.equal(colliders, 96);
  assert.equal(trunks.capacity, 128); assert.equal(leaves.capacity, 1536);
  assert.equal(leaves.writes.size, 1152);
});
test('original 960-slot allocation reproduces the first out-of-range write at index 960', () => {
  const old = source.replace('new THREE.InstancedMesh(leafG, leafM, ficusN * 12)', 'new THREE.InstancedMesh(leafG, leafM, 960)');
  assert.notEqual(old, source);
  assert.throws(() => buildFoliage(480, old), /matrix 960 exceeds capacity 960/);
});
test('all supported sampling boundaries preserve full geometry inside allocated buffers', () => {
  for (const count of [0, 1, 2, 3, 4, 47, 48, 49, 64, 65, 66, 95, 96, 97, 479, 480, 481, 1000, 5000]) {
    const { trunks, leaves, colliders } = buildFoliage(count);
    assert.ok(trunks.count <= trunks.capacity && leaves.count <= leaves.capacity, `sample count ${count}`);
    assert.equal(leaves.count, trunks.count * 12); assert.equal(colliders, trunks.count);
    assert.equal(trunks.writes.size, trunks.count); assert.equal(leaves.writes.size, leaves.count);
  }
});
test('maximum permitted tree population has room for every canopy without clamping', () => {
  const { trunks, leaves } = buildFoliage(66);
  assert.equal(trunks.count, 128); assert.equal(leaves.count, 1536); assert.equal(leaves.writes.size, 1536);
});
