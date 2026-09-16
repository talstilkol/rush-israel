import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  DAMAGE_THEN_SOAK_SPAWN_TIMEOUT_MS,
  missingDamageSmokeTokens,
  missingSoakThirtyTokens,
  runDamageThenSoak,
} from "./check-damage-required.mjs";

test("damage-smoke and soak-30min contract tokens remain in the accepted scripts", () => {
  assert.deepEqual(missingDamageSmokeTokens(), []);
  assert.deepEqual(missingSoakThirtyTokens(), []);
  const pkg = JSON.parse(readFileSync(fromRoot("package.json"), "utf8"));
  assert.equal(pkg.scripts["qa:damage:raw"], "node scripts/damage-smoke.mjs");
  assert.equal(pkg.scripts["qa:ci:raw"].includes("qa:damage"), false);
  assert.equal(pkg.scripts["qa:ci:raw"].includes("soak-30min"), false);
  assert.match(pkg.scripts["qa:soak-smoke:raw"], /soak-smoke\.mjs/);
});

test(
  "damage-smoke then 1800s wall-clock soak run inside the required npm test suite",
  { timeout: DAMAGE_THEN_SOAK_SPAWN_TIMEOUT_MS },
  () => {
    const result = runDamageThenSoak();
    const output = (result.stderr || "") + (result.stdout || "");
    assert.equal(result.status, 0, output);
    assert.match(result.stdout, /damage-smoke ok/);
    assert.match(result.stdout, /start ms=1800000/);
    assert.match(result.stdout, /ok ticks=/);
    assert.match(result.stdout, /elapsed=1[89]\d{2}s/);
    assert.match(result.stdout, /damage-then-soak ok/);
  },
);
