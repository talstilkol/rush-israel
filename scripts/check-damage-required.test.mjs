import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  missingDamageSmokeTokens,
  runAyalonLock,
  runDamageSmoke,
  runPixelGolden,
} from "./check-damage-required.mjs";

test("damage-smoke contract tokens remain in the accepted script", () => {
  assert.deepEqual(missingDamageSmokeTokens(), []);
  const pkg = JSON.parse(readFileSync(fromRoot("package.json"), "utf8"));
  assert.equal(pkg.scripts["qa:damage:raw"], "node scripts/damage-smoke.mjs");
  assert.equal(pkg.scripts["qa:golden:raw"], "node scripts/pixel-golden.mjs");
  assert.equal(pkg.scripts["qa:ayalon-lock"], "node scripts/ayalon-hash.mjs");
  assert.equal(pkg.scripts["qa:ci:raw"].includes("qa:damage"), false);
  assert.equal(pkg.scripts["qa:ci:raw"].includes("qa:golden"), false);
  assert.equal(pkg.scripts["qa:ci:raw"].includes("qa:hashalom"), false);
});

test("ayalon-hash runs inside the required npm test suite", () => {
  const result = runAyalonLock();
  assert.equal(result.status, 0, (result.stderr || "") + (result.stdout || ""));
  assert.match(result.stdout, /ayalon-hash ok/);
});

test("damage-smoke runs inside the required npm test suite", { timeout: 180_000 }, () => {
  const result = runDamageSmoke();
  assert.equal(result.status, 0, (result.stderr || "") + (result.stdout || ""));
  assert.match(result.stdout, /damage-smoke ok/);
});

test("pixel-golden runs inside the required npm test suite", { timeout: 180_000 }, () => {
  const result = runPixelGolden();
  assert.equal(result.status, 0, (result.stderr || "") + (result.stdout || ""));
  assert.match(result.stdout, /pixel-golden ok/);
});
