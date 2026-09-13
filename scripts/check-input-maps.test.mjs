import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_DIGEST_SHA256,
  canonicalDigest,
  validateLock,
} from "./check-input-maps.mjs";
import {
  LOCK_DEFINED,
  PUBLIC_DISTRIBUTION,
  INPUT_MAPS_UNIFIED,
  PAUSE_KEYBOARD_ONLY,
  evaluateLock,
} from "../src/game/input-maps/maps.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-044 lock passes and RSH-046 remains absent", () => {
  const result = validateLock();
  assert.deepEqual(result.errors, []);
  assert.equal(result.locked, true);
});

test("RSH-046 precreation fails closed", () => {
  const result = validateLock({
    repositoryFiles: ["RSH-046-PREFLIGHT.json", "src/game/onboarding/flow.ts", "scripts/check-onboarding.mjs"],
  });
  assert.match(messages(result), /RSH-046 was precreated/);
});

test("RSH-044 does not accept an RTL-complete, universal-pause or public-distribution claim", () => {
  const verified = evaluateLock({ claimedRtlComplete: true, claimedUniversalPause: true });
  assert.equal(verified.acceptedAsRtlComplete, false);
  assert.equal(verified.acceptedAsUniversalPause, false);
  assert.equal(verified.pauseKeyboardOnly, true);
  assert.equal(verified.publicDistribution, false);
  assert.equal(verified.unified, true);
  assert.equal(LOCK_DEFINED, true);
  assert.equal(INPUT_MAPS_UNIFIED, true);
  assert.equal(PAUSE_KEYBOARD_ONLY, true);
  assert.equal(PUBLIC_DISTRIBUTION, false);
  assert.equal(createHash("sha256").update(canonicalDigest()).digest("hex"), EXPECTED_DIGEST_SHA256);
  const manifest = JSON.parse(readFileSync(fromRoot("INPUT-MAPS-MANIFEST.json"), "utf8"));
  assert.equal(manifest.unit, "RSH-044");
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.lock.input_maps_unified, true);
  assert.equal(manifest.lock.pause_keyboard_only, true);
  assert.equal(manifest.lock.rtl_scope_complete, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-046");
});
