import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fromRoot } from './project-root.mjs';
import { applyWaterClock } from '../src/game/water-clock.ts';

function material() {
  return {
    color: { base: null, factor: 1, setHex(v) { this.base = v; this.factor = 1; }, multiplyScalar(v) { this.factor *= v; } },
    envMapIntensity: 0, roughness: 0, opacity: 0,
  };
}
const snapshot = m => ({ base: m.color.base, factor: m.color.factor, env: m.envMapIntensity, roughness: m.roughness, opacity: m.opacity });
const entry = (baseColor = 0x2a6a78) => ({ material: material(), baseColor });

test('a procedural canal with zero catalogue water bodies can change to night', () => {
  const canal = entry();
  applyWaterClock([canal], 1);
  assert.deepEqual(snapshot(canal.material), { base: 0x2a6a78, factor: 0.5, env: 2.6, roughness: 0.03, opacity: 0.9 });
});
test('multiple water bodies and the extra canal retain their own base colours', () => {
  const entries = [entry(0x123456), entry(0xabcdef), entry()];
  applyWaterClock(entries, 1);
  assert.deepEqual(entries.map(e => e.material.color.base), [0x123456, 0xabcdef, 0x2a6a78]);
});
test('100 day/night cycles never compound darkness or mutate source colours', () => {
  const entries = [entry(0x123456), entry()];
  for (let i = 0; i < 100; i++) {
    applyWaterClock(entries, 1);
    assert.equal(entries[0].material.color.factor, 0.5);
    applyWaterClock(entries, 0);
    assert.equal(entries[0].material.color.factor, 1);
    assert.equal(entries[1].material.color.factor, 1);
  }
  assert.deepEqual(entries.map(e => e.baseColor), [0x123456, 0x2a6a78]);
});
test('repeated night updates are idempotent', () => {
  const water = entry(); applyWaterClock([water], 0.9); const before = snapshot(water.material);
  for (let i = 0; i < 100; i++) applyWaterClock([water], 0.9);
  assert.deepEqual(snapshot(water.material), before);
});
test('returning from night restores the daytime recipe', () => {
  const water = entry(); applyWaterClock([water], 1); applyWaterClock([water], 0);
  assert.deepEqual(snapshot(water.material), { base: 0x2a6a78, factor: 1, env: 1.7, roughness: 0.08, opacity: 0.82 });
});
test('all valid night amounts retain the exact existing standard-water formula', () => {
  for (const n of [0, 0.1, 0.35, 0.35001, 0.48, 0.5, 0.9, 1]) {
    const water = entry(0x123456); applyWaterClock([water], n);
    assert.deepEqual(snapshot(water.material), { base: 0x123456, factor: n > 0.35 ? 1 + (0.5 - 1) * n : 1, env: 1.7 + (2.6 - 1.7) * n, roughness: 0.08 + (0.03 - 0.08) * n, opacity: 0.82 + (0.9 - 0.82) * n });
  }
});
test('an empty water registry is safe at day and night', () => {
  applyWaterClock([], 0); applyWaterClock([], 1);
});
test('out-of-range amounts clamp to physical day/night bounds', () => {
  const water = entry(); applyWaterClock([water], -1); assert.equal(water.material.opacity, 0.82);
  applyWaterClock([water], 2); assert.equal(water.material.opacity, 0.9);
});
test('nonfinite amounts fail before any material mutation', () => {
  for (const n of [NaN, Infinity, -Infinity]) {
    const water = entry(); const before = snapshot(water.material);
    assert.throws(() => applyWaterClock([water], n), RangeError);
    assert.deepEqual(snapshot(water.material), before);
  }
});
test('world registers body and canal appearances and updates their real materials', () => {
  const source = readFileSync(fromRoot('src/game/world.ts'), 'utf8');
  assert.match(source, /waterMats\.push\(\{ material: mat, baseColor: body\.color \}\)/);
  assert.match(source, /waterMats\.push\(\{ material: canalMat, baseColor: 0x2a6a78 \}\)/);
  assert.match(source, /applyWaterClock\(waterMats, n\)/);
  assert.match(source, /for \(const \{ material: mat \} of waterMats\) if \(mat\.normalMap\)/);
  assert.doesNotMatch(source, /const src = bodies\[i\]/);
});
