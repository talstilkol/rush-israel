import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_DIGEST_SHA256,
  canonicalDigest,
  validateLock,
} from "./check-rc1-close.mjs";
import {
  LOCK_DEFINED,
  PUBLIC_DISTRIBUTION,
  evaluateLock,
} from "../src/game/rc1-close/rc1.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-066 lock passes and RSH-067 remains absent", () => {
  const result = validateLock();
  assert.deepEqual(result.errors, []);
  assert.equal(result.locked, true);
});

test("RSH-067 precreation fails closed", () => {
  const result = validateLock({
    repositoryFiles: ["RSH-067-PREFLIGHT.json", "src/game/v1-publish/publish.ts", "scripts/check-v1-publish.mjs"],
  });
  assert.match(messages(result), /RSH-067 was precreated/);
});

test("RSH-066 does not accept a verified-device or public-distribution claim", () => {
  const verified = evaluateLock({ claimedVerified: true });
  assert.equal(verified.acceptedAsVerifiedDevice, false);
  assert.equal(verified.publicDistribution, false);
  assert.equal(LOCK_DEFINED, true);
  assert.equal(PUBLIC_DISTRIBUTION, false);
  assert.equal(createHash("sha256").update(canonicalDigest()).digest("hex"), EXPECTED_DIGEST_SHA256);
  const manifest = JSON.parse(readFileSync(fromRoot("RC1-MANIFEST.json"), "utf8"));
  assert.equal(manifest.unit, "RSH-066");
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.lock.real_device_baseline_accepted, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-067");
});
