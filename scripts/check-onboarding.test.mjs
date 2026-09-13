import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_DIGEST_SHA256,
  canonicalDigest,
  validateLock,
} from "./check-onboarding.mjs";
import {
  LOCK_DEFINED,
  PUBLIC_DISTRIBUTION,
  ONBOARDING_COMPLETE,
  FIRST_RUN_WIZARD,
  PWA_COMPLETE,
  evaluateLock,
} from "../src/game/onboarding/flow.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-046 lock passes and RSH-047 remains absent", () => {
  const result = validateLock();
  assert.deepEqual(result.errors, []);
  assert.equal(result.locked, true);
});

test("RSH-047 precreation fails closed", () => {
  const result = validateLock({
    repositoryFiles: ["RSH-047-PREFLIGHT.json", "src/game/pwa/manifest.ts", "scripts/check-pwa.mjs"],
  });
  assert.match(messages(result), /RSH-047 was precreated/);
});

test("RSH-046 does not accept wizard, PWA or a11y-complete claims", () => {
  const verified = evaluateLock({ claimedFirstRunWizard: true, claimedPwaComplete: true, claimedA11yComplete: true });
  assert.equal(verified.acceptedAsFirstRunWizard, false);
  assert.equal(verified.acceptedAsPwaComplete, false);
  assert.equal(verified.acceptedAsA11yComplete, false);
  assert.equal(verified.onboardingComplete, true);
  assert.equal(verified.titleBoot, true);
  assert.equal(verified.settingsPanel, true);
  assert.equal(verified.saveRecoveryUx, true);
  assert.equal(LOCK_DEFINED, true);
  assert.equal(ONBOARDING_COMPLETE, true);
  assert.equal(FIRST_RUN_WIZARD, false);
  assert.equal(PWA_COMPLETE, false);
  assert.equal(PUBLIC_DISTRIBUTION, false);
  assert.equal(createHash("sha256").update(canonicalDigest()).digest("hex"), EXPECTED_DIGEST_SHA256);
  const manifest = JSON.parse(readFileSync(fromRoot("ONBOARDING-MANIFEST.json"), "utf8"));
  assert.equal(manifest.unit, "RSH-046");
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.lock.onboarding_complete, true);
  assert.equal(manifest.lock.first_run_wizard, false);
  assert.equal(manifest.lock.pwa_complete, false);
  assert.equal(manifest.lock.a11y_complete, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-047");
});
