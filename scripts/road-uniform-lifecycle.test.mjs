import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bindRoadCompile } from '../src/game/roadShader.ts';
const shader = () => ({ fragmentShader: '#include <map_fragment>\n#include <roughnessmap_fragment>', uniforms: {} });
const material = () => ({ userData: { lanes: 8 } });

test('road wetness exists before the first compilation so world startup can set it', () => {
  const mat = material(); bindRoadCompile(mat);
  assert.deepEqual(mat.userData.uWet, { value: 0 });
});
test('a day look assigned before compilation is not lost on first render', () => {
  const mat = material(); bindRoadCompile(mat);
  if (mat.userData.uWet) mat.userData.uWet.value = 0.18; // Actual world applyWet condition.
  const s = shader(); mat.onBeforeCompile(s, null); assert.equal(s.uniforms.uWet.value, 0.18);
});
test('recompilation does not reset the active storm look to dry', () => {
  const mat = material(); bindRoadCompile(mat); mat.onBeforeCompile(shader(), null);
  mat.userData.uWet.value = 1; const s = shader(); mat.onBeforeCompile(s, null);
  assert.equal(s.uniforms.uWet.value, 1);
});
test('all program variants share the same material-owned wetness cell', () => {
  const mat = material(); bindRoadCompile(mat); const a = shader(), b = shader();
  mat.onBeforeCompile(a, null); mat.onBeforeCompile(b, null);
  assert.equal(a.uniforms.uWet, b.uniforms.uWet); assert.equal(a.uniforms.uWet, mat.userData.uWet);
});
test('switching back to a cached program sees subsequent look updates', () => {
  const mat = material(); bindRoadCompile(mat); const a = shader(), b = shader();
  mat.onBeforeCompile(a, null); mat.onBeforeCompile(b, null); mat.userData.uWet.value = 0.7;
  assert.equal(a.uniforms.uWet.value, 0.7); assert.equal(b.uniforms.uWet.value, 0.7);
});
test('rebinding after a CSM hook replacement preserves the existing wetness cell', () => {
  const mat = material(); bindRoadCompile(mat); mat.onBeforeCompile(shader(), null);
  const owned = mat.userData.uWet; owned.value = 0.22;
  mat.onBeforeCompile = () => {}; bindRoadCompile(mat); const s = shader(); mat.onBeforeCompile(s, null);
  assert.equal(s.uniforms.uWet, owned); assert.equal(s.uniforms.uWet.value, 0.22);
});
test('repeated hook chaining inserts lane GLSL once and retains the same uniform', () => {
  const mat = material(); bindRoadCompile(mat); mat.onBeforeCompile(shader(), null);
  const owned = mat.userData.uWet; bindRoadCompile(mat); bindRoadCompile(mat);
  const s = shader(); mat.onBeforeCompile(s, null);
  assert.equal((s.fragmentShader.match(/RUSH_LANES/g) ?? []).length, 1); assert.equal(s.uniforms.uWet, owned);
});
test('material instances never share their mutable weather uniform', () => {
  const a = material(), b = material(); bindRoadCompile(a); bindRoadCompile(b);
  a.onBeforeCompile(shader(), null); b.onBeforeCompile(shader(), null);
  assert.notEqual(a.userData.uWet, b.userData.uWet); a.userData.uWet.value = 1;
  assert.equal(b.userData.uWet.value, 0);
});
test('existing hooks retain material this and renderer arguments', () => {
  const mat = material(), renderer = {}; let called = 0; const s = shader();
  mat.onBeforeCompile = function (actualShader, actualRenderer) {
    assert.equal(this, mat); assert.equal(actualShader, s); assert.equal(actualRenderer, renderer); called++;
  };
  bindRoadCompile(mat); mat.onBeforeCompile(s, renderer); assert.equal(called, 1);
});
test('an explicitly supplied wetness cell is reused rather than reset', () => {
  const mat = material(); const owned = { value: 0.7 }; mat.userData.uWet = owned;
  bindRoadCompile(mat); const s = shader(); mat.onBeforeCompile(s, null); assert.equal(s.uniforms.uWet, owned);
});
test('zero-lane non-road materials keep their hook and have no added uniforms', () => {
  const hook = () => {}; const mat = { userData: { lanes: 0 }, onBeforeCompile: hook };
  bindRoadCompile(mat); assert.equal(mat.onBeforeCompile, hook); assert.equal(mat.userData.uWet, undefined);
});
test('a failed upstream compiler remains failed without discarding material state', () => {
  const mat = material(), owned = { value: 1 }, error = new Error('CSM failed');
  mat.userData.uWet = owned; mat.onBeforeCompile = () => { throw error; }; bindRoadCompile(mat);
  assert.throws(() => mat.onBeforeCompile(shader(), null), error); assert.equal(mat.userData.uWet, owned);
});
