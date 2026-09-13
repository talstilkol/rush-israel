import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_QUALITY_DIGEST_SHA256,
  canonicalQualityDigest,
  validateQualityProfiles,
} from "./check-quality-profiles.mjs";
import { LOCKED_PROFILES, profileFromLegacy } from "../src/game/quality-profiles/profiles.ts";
import { createHysteresisState, gfxPassFlags, noteHysteresis } from "../src/game/quality-profiles/hysteresis.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-038 quality-profile lock passes and RSH-042 remains absent", () => {
  const result = validateQualityProfiles();
  assert.deepEqual(result.errors, []);
  assert.equal(result.locked, true);
  assert.equal(result.profileCount, 5);
});

test("RSH-042 precreation fails closed", () => {
  const result = validateQualityProfiles({
    repositoryFiles: ["RSH-042-PREFLIGHT.json", "src/game/thirty-soak/soak.ts", "scripts/check-thirty-soak.mjs"],
  });
  assert.match(messages(result), /RSH-042 was precreated/);
});

test("profiles and hysteresis are locked without budgets or a real-device baseline", () => {
  assert.equal(createHash("sha256").update(canonicalQualityDigest()).digest("hex"), EXPECTED_QUALITY_DIGEST_SHA256);
  const profiles = readFileSync(fromRoot("src", "game", "quality-profiles", "profiles.ts"), "utf8");
  assert.match(profiles, /export const QUALITY_PROFILES_DEFINED = true/);
  assert.match(profiles, /export const BUDGETS_ENFORCED = false/);
  assert.match(profiles, /export const REAL_DEVICE_BASELINE_ACCEPTED = false/);
  assert.match(profiles, /export const QUALITY_PROFILES_GIS_CLAIM = false/);
  const manifest = JSON.parse(readFileSync(fromRoot("QUALITY-PROFILES-MANIFEST.json"), "utf8"));
  assert.equal(manifest.lock.budgets_enforced, false);
  assert.equal(manifest.lock.real_device_baseline_accepted, false);
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-042");
  assert.equal(LOCKED_PROFILES.compat.targetFps, 30);
  assert.equal(LOCKED_PROFILES.balanced.pixelScale, 0.75);
  assert.equal(LOCKED_PROFILES.high.bloom, true);
  assert.equal(profileFromLegacy("low").id, "compat");
  assert.equal(profileFromLegacy("mid").id, "balanced");
  assert.equal(profileFromLegacy("high").id, "high");
  const state = createHysteresisState();
  for (let i = 0; i < 89; i++) assert.equal(noteHysteresis(state, 21, 1 / 60), null);
  assert.equal(noteHysteresis(state, 21, 1 / 60), "drop");
  assert.equal(state.step, 1);
  assert.deepEqual(gfxPassFlags(1), { planar: false, bloom: true, csm: true, pixelExtra: 0 });
  assert.equal(noteHysteresis(state, 15, 4.9), null);
  assert.equal(noteHysteresis(state, 15, 0.2), "raise");
  assert.equal(state.step, 0);
});
