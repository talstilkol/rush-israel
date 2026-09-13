import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_DIGEST_SHA256,
  canonicalDigest,
  validateLock,
} from "./check-pwa.mjs";
import {
  LOCK_DEFINED,
  PUBLIC_DISTRIBUTION,
  PWA_COMPLETE,
  SERVICE_WORKER,
  OFFLINE_CACHE,
  evaluateLock,
} from "../src/game/pwa/offline.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-047 lock passes and RSH-058 remains absent", () => {
  const result = validateLock();
  assert.deepEqual(result.errors, []);
  assert.equal(result.locked, true);
});

test("RSH-058 precreation fails closed", () => {
  const result = validateLock({
    repositoryFiles: ["RSH-058-PREFLIGHT.json", "src/game/rothschild-golden/lock.ts", "scripts/check-oldjaffa.mjs"],
  });
  assert.match(messages(result), /RSH-058 was precreated/);
});

test("RSH-047 does not accept service-worker, offline-cache or a11y-complete claims", () => {
  const verified = evaluateLock({ claimedServiceWorker: true, claimedOfflineCache: true, claimedA11yComplete: true });
  assert.equal(verified.acceptedAsServiceWorker, false);
  assert.equal(verified.acceptedAsOfflineCache, false);
  assert.equal(verified.acceptedAsA11yComplete, false);
  assert.equal(verified.pwaComplete, true);
  assert.equal(verified.manifestPresent, true);
  assert.equal(verified.displayStandalone, true);
  assert.equal(LOCK_DEFINED, true);
  assert.equal(PWA_COMPLETE, true);
  assert.equal(SERVICE_WORKER, false);
  assert.equal(OFFLINE_CACHE, false);
  assert.equal(PUBLIC_DISTRIBUTION, false);
  assert.equal(createHash("sha256").update(canonicalDigest()).digest("hex"), EXPECTED_DIGEST_SHA256);
  const manifest = JSON.parse(readFileSync(fromRoot("PWA-MANIFEST.json"), "utf8"));
  assert.equal(manifest.unit, "RSH-047");
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.lock.pwa_complete, true);
  assert.equal(manifest.lock.service_worker, false);
  assert.equal(manifest.lock.offline_cache, false);
  assert.equal(manifest.lock.a11y_complete, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-058");
});
