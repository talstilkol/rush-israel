import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_DIGEST_SHA256,
  canonicalDigest,
  validateLock,
} from "./check-rtl-scope.mjs";
import {
  LOCK_DEFINED,
  PUBLIC_DISTRIBUTION,
  RTL_SCOPE_COMPLETE,
  ARABIC_COPY_COMPLETE,
  evaluateLock,
} from "../src/game/rtl-scope/scope.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-045 lock passes and RSH-046 remains absent", () => {
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

test("RSH-045 does not accept complete Arabic copy, onboarding or public-distribution claims", () => {
  const verified = evaluateLock({ claimedArabicCopyComplete: true, claimedOnboardingComplete: true });
  assert.equal(verified.acceptedAsArabicCopyComplete, false);
  assert.equal(verified.acceptedAsOnboardingComplete, false);
  assert.equal(verified.rtlScopeComplete, true);
  assert.equal(verified.arabicInScope, true);
  assert.equal(LOCK_DEFINED, true);
  assert.equal(RTL_SCOPE_COMPLETE, true);
  assert.equal(ARABIC_COPY_COMPLETE, false);
  assert.equal(PUBLIC_DISTRIBUTION, false);
  assert.equal(createHash("sha256").update(canonicalDigest()).digest("hex"), EXPECTED_DIGEST_SHA256);
  const manifest = JSON.parse(readFileSync(fromRoot("RTL-SCOPE-MANIFEST.json"), "utf8"));
  assert.equal(manifest.unit, "RSH-045");
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.lock.rtl_scope_complete, true);
  assert.equal(manifest.lock.arabic_copy_complete, false);
  assert.equal(manifest.lock.onboarding_complete, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-046");
});
