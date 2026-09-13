import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_DIGEST_SHA256,
  canonicalDigest,
  validateLock,
} from "./check-a11y.mjs";
import {
  LOCK_DEFINED,
  PUBLIC_DISTRIBUTION,
  A11Y_COMPLETE,
  TELEMETRY,
  WCAG_AA,
  evaluateLock,
} from "../src/game/a11y/gates.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-048 lock passes and none remains absent", () => {
  const result = validateLock();
  assert.deepEqual(result.errors, []);
  assert.equal(result.locked, true);
});

test("none precreation fails closed", () => {
  const result = validateLock({
    repositoryFiles: ["RSH-068-PREFLIGHT.json", "src/game/rothschild-golden/lock.ts", "scripts/check-oldjaffa.mjs"],
  });
  assert.match(messages(result), /none was precreated/);
});

test("RSH-048 does not accept WCAG AA, telemetry or Rothschild claims", () => {
  const verified = evaluateLock({ claimedWcagAa: true, claimedTelemetry: true, claimedRothschild: true });
  assert.equal(verified.acceptedAsWcagAa, false);
  assert.equal(verified.acceptedAsTelemetry, false);
  assert.equal(verified.acceptedAsRothschildGeometry, false);
  assert.equal(verified.a11yComplete, true);
  assert.equal(verified.ariaControls, true);
  assert.equal(verified.liveRegions, true);
  assert.equal(verified.reducedMotion, true);
  assert.equal(LOCK_DEFINED, true);
  assert.equal(A11Y_COMPLETE, true);
  assert.equal(TELEMETRY, false);
  assert.equal(WCAG_AA, false);
  assert.equal(PUBLIC_DISTRIBUTION, false);
  assert.equal(createHash("sha256").update(canonicalDigest()).digest("hex"), EXPECTED_DIGEST_SHA256);
  const manifest = JSON.parse(readFileSync(fromRoot("A11Y-MANIFEST.json"), "utf8"));
  assert.equal(manifest.unit, "RSH-048");
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.lock.a11y_complete, true);
  assert.equal(manifest.lock.wcag_aa, false);
  assert.equal(manifest.lock.telemetry, false);
  assert.equal(manifest.lock.crash_reporting, false);
  assert.equal(manifest.lock.alpha_ux_private, true);
  assert.equal(manifest.lock.rothschild_geometry, false);
  assert.equal(manifest.deferred_boundary.queue_head, "none");
});
