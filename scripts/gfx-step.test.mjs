import assert from "node:assert/strict";
import { test } from "node:test";
import { DynamicQualityController, gfxPassFlags } from "../src/rendering/DynamicQualityController.ts";

test("drop order planar → bloom → CSM → pixelScale", () => {
  assert.deepEqual(gfxPassFlags(0), { planar: true, bloom: true, csm: true, pixelExtra: 0 });
  assert.deepEqual(gfxPassFlags(1), { planar: false, bloom: true, csm: true, pixelExtra: 0 });
  assert.deepEqual(gfxPassFlags(2), { planar: false, bloom: false, csm: true, pixelExtra: 0 });
  assert.deepEqual(gfxPassFlags(3), { planar: false, bloom: false, csm: false, pixelExtra: 0 });
  assert.equal(gfxPassFlags(4).pixelExtra, 1);
  assert.equal(gfxPassFlags(5).pixelExtra, 2);
});

test("90 frames p95>20 drops one step; 5s under 16ms raises", () => {
  const d = new DynamicQualityController();
  let last = null;
  for (let i = 0; i < 89; i++) last = d.note(21, 0.016);
  assert.equal(last, null);
  assert.equal(d.step, 0);
  assert.equal(d.note(21, 0.016), "drop");
  assert.equal(d.step, 1);
  assert.equal(d.note(15, 4.9), null);
  assert.equal(d.note(15, 0.2), "raise");
  assert.equal(d.step, 0);
});

test("16–20ms deadband neither drops nor raises (no oscillation)", () => {
  const d = new DynamicQualityController();
  for (let i = 0; i < 90; i++) d.note(21, 0.016);
  assert.equal(d.step, 1);
  for (let i = 0; i < 400; i++) assert.equal(d.note(18, 0.016), null);
  assert.equal(d.step, 1);
  assert.equal(d.note(15, 5), "raise");
  assert.equal(d.step, 0);
});

test("raise requires five cool seconds; a 18ms blip resets cooldown", () => {
  const d = new DynamicQualityController();
  for (let i = 0; i < 90; i++) d.note(21, 0.016);
  assert.equal(d.note(15, 4.5), null);
  assert.equal(d.note(18, 0.016), null);
  assert.equal(d.note(15, 4.9), null);
  assert.equal(d.note(15, 0.2), "raise");
  assert.equal(d.step, 0);
});
