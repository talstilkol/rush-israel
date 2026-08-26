import assert from "node:assert/strict";
import { test } from "node:test";
import { padCurve } from "../src/game/input.ts";

test("padCurve deadzone and expo", () => {
  assert.equal(padCurve(0), 0);
  assert.equal(padCurve(0.11), 0);
  assert.equal(padCurve(-0.11), 0);
  assert.ok(padCurve(0.5) < 0.5);
  assert.ok(Math.abs(padCurve(0.5) - Math.pow(0.5, 1.6)) < 1e-9);
  assert.equal(padCurve(-0.5), -padCurve(0.5));
  assert.ok(Math.abs(padCurve(1) - 1) < 1e-9);
});
