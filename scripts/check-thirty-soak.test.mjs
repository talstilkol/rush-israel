import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_SOAK_DIGEST_SHA256,
  canonicalSoakDigest,
  validateThirtySoak,
} from "./check-thirty-soak.mjs";
import {
  LIVE_SOAK,
  REQUIRED_CI_CYCLES,
  SMOKE_SUBSTITUTES,
  SOAK_DURATION_S,
  SOAK_ENFORCED,
  evaluateThirtySoak,
} from "../src/game/thirty-soak/soak.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-042 thirty-soak lock passes and RSH-047 remains absent", () => {
  const result = validateThirtySoak();
  assert.deepEqual(result.errors, []);
  assert.equal(result.locked, true);
  assert.equal(result.durationS, 1800);
});

test("RSH-047 precreation fails closed", () => {
  const result = validateThirtySoak({
    repositoryFiles: ["RSH-047-PREFLIGHT.json", "src/game/pwa/offline.ts", "scripts/check-pwa.mjs"],
  });
  assert.match(messages(result), /RSH-047 was precreated/);
});

test("2-cycle smoke does not satisfy the 30-minute soak", () => {
  const smoke = evaluateThirtySoak(2_000, 2);
  assert.equal(smoke.durationMet, false);
  assert.equal(smoke.smokeSubstitutes, false);
  assert.equal(smoke.acceptedAsThirtyMinute, false);
  const full = evaluateThirtySoak(1_800_000, 2);
  assert.equal(full.durationMet, true);
  assert.equal(full.smokeSubstitutes, false);
  assert.equal(full.acceptedAsThirtyMinute, true);
});

test("thirty-minute soak is locked to soak-30min without a device matrix or real-device baseline", () => {
  assert.equal(createHash("sha256").update(canonicalSoakDigest()).digest("hex"), EXPECTED_SOAK_DIGEST_SHA256);
  const soak = readFileSync(fromRoot("src", "game", "thirty-soak", "soak.ts"), "utf8");
  assert.match(soak, /export const THIRTY_SOAK_DEFINED = true/);
  assert.match(soak, /export const SOAK_ENFORCED = true/);
  assert.match(soak, /export const SMOKE_SUBSTITUTES = false/);
  assert.match(soak, /export const DEVICE_MATRIX_ENFORCED = false/);
  assert.match(soak, /export const REAL_DEVICE_BASELINE_ACCEPTED = false/);
  assert.equal(LIVE_SOAK, "scripts/soak-30min.mjs");
  const wall = readFileSync(fromRoot("scripts", "soak-30min.mjs"), "utf8");
  assert.match(wall, /const MS = Number\(process\.env\.SOAK_MS \|\| 30 \* 60 \* 1000\)/);
  assert.match(wall, /Not advanceTime/);
  assert.match(wall, /while \(Date\.now\(\) - t0 < MS\)/);
  const manifest = JSON.parse(readFileSync(fromRoot("THIRTY-SOAK-MANIFEST.json"), "utf8"));
  assert.equal(manifest.lock.soak_duration_s, 1800);
  assert.equal(manifest.lock.live_soak, "scripts/soak-30min.mjs");
  assert.equal(manifest.lock.live_enter_exit, "scripts/soak-menu-race.mjs");
  assert.equal(manifest.lock.smoke_substitutes, false);
  assert.equal(manifest.lock.device_matrix_enforced, false);
  assert.equal(manifest.lock.real_device_baseline_accepted, false);
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-047");
  assert.equal(SOAK_DURATION_S, 1800);
  assert.equal(REQUIRED_CI_CYCLES, 2);
  assert.equal(SOAK_ENFORCED, true);
  assert.equal(SMOKE_SUBSTITUTES, false);
});
