import assert from "node:assert/strict";
import { test } from "node:test";
import { padCurve } from "../src/game/input-curve.ts";

test("padCurve deadzone and exponent 1.6", () => {
  assert.equal(padCurve(0), 0);
  assert.equal(padCurve(0.12), 0);
  assert.equal(padCurve(-0.12), 0);
  assert.equal(padCurve(1), 1);
  assert.equal(padCurve(-1), -1);
  assert.ok(Math.abs(padCurve(0.5) - Math.pow(0.5, 1.6)) < 1e-9);
  assert.ok(padCurve(0.5) < 0.5);
  assert.ok(padCurve(-0.5) > -0.5);
});
