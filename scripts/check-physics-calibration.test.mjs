import assert from "node:assert/strict";
import { test } from "node:test";
import { validatePhysicsCalibration } from "./check-physics-calibration.mjs";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-033 physics calibration lock passes and RSH-037 remains absent", () => {
  const result = validatePhysicsCalibration();
  assert.deepEqual(result.errors, []);
  assert.equal(result.physicsVersion, 7);
  assert.deepEqual(result.claims, [8.4, 6.6, 4.9, 5.8, 3.5]);
});

test("RSH-037 precreation fails closed", () => {
  const result = validatePhysicsCalibration({
    repositoryFiles: ["RSH-037-PREFLIGHT.json", "src/game/perf-instrument/metrics.ts"],
  });
  assert.match(messages(result), /RSH-037 was precreated/);
});

test("claim rewrite and version drift fail closed", () => {
  const result = validatePhysicsCalibration({
    physicsSource: "export const PHYSICS_VERSION = 6;\n",
    carsSource: "zeroTo100: 9.9",
  });
  assert.match(messages(result), /PHYSICS_VERSION is not 7/);
});
