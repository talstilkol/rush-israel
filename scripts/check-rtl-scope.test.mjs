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
  DOCUMENT_LANG_SYNCED,
  HTML_LANG_STATIC_HE,
  evaluateLock,
} from "../src/game/rtl-scope/scope.ts";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-045 lock passes and RSH-047 remains absent", () => {
  const result = validateLock();
  assert.deepEqual(result.errors, []);
  assert.equal(result.locked, true);
});

test("RSH-047 precreation fails closed", () => {
  const result = validateLock({
    repositoryFiles: ["RSH-047-PREFLIGHT.json", "src/game/pwa/offline.ts", "scripts/check-pwa.mjs"],
  });
  assert.match(messages(result), /RSH-047 was precreated/);
});

test("RSH-045 does not accept complete Arabic copy, onboarding, document-lang-sync or public-distribution claims", () => {
  const verified = evaluateLock({
    claimedArabicCopyComplete: true,
    claimedOnboardingComplete: true,
    claimedDocumentLangSynced: true,
  });
  assert.equal(verified.acceptedAsArabicCopyComplete, false);
  assert.equal(verified.acceptedAsOnboardingComplete, false);
  assert.equal(verified.acceptedAsDocumentLangSynced, false);
  assert.equal(verified.htmlLangStaticHe, true);
  assert.equal(verified.rtlScopeComplete, true);
  assert.equal(verified.arabicInScope, true);
  assert.equal(LOCK_DEFINED, true);
  assert.equal(RTL_SCOPE_COMPLETE, true);
  assert.equal(ARABIC_COPY_COMPLETE, false);
  assert.equal(DOCUMENT_LANG_SYNCED, false);
  assert.equal(HTML_LANG_STATIC_HE, true);
  assert.equal(PUBLIC_DISTRIBUTION, false);
  assert.equal(createHash("sha256").update(canonicalDigest()).digest("hex"), EXPECTED_DIGEST_SHA256);
  const manifest = JSON.parse(readFileSync(fromRoot("RTL-SCOPE-MANIFEST.json"), "utf8"));
  assert.equal(manifest.unit, "RSH-045");
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.lock.rtl_scope_complete, true);
  assert.equal(manifest.lock.arabic_copy_complete, false);
  assert.equal(manifest.lock.onboarding_complete, false);
  assert.equal(manifest.lock.html_lang_static_he, true);
  assert.equal(manifest.lock.document_lang_synced, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-047");
});
