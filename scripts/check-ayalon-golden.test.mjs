import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  DUPLICATE_PLACEHOLDER_HASH,
  EXPECTED_GOLDEN_DIGEST_SHA256,
  canonicalGoldenDigest,
  validateAyalonGolden,
} from "./check-ayalon-golden.mjs";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-035 unique golden pack passes and RSH-036 remains absent", () => {
  const result = validateAyalonGolden();
  assert.deepEqual(result.errors, []);
  assert.equal(result.uniqueCount, 20);
  assert.equal(result.placeholderCount, 4);
  assert.equal(result.approved, true);
});

test("RSH-036 precreation fails closed", () => {
  const result = validateAyalonGolden({
    repositoryFiles: ["RSH-036-PREFLIGHT.json", "src/game/ayalon-freeze/freeze.ts"],
  });
  assert.match(messages(result), /RSH-036 was precreated/);
});

test("unique pack stays owner-approved and placeholders stay non-authority", () => {
  assert.equal(createHash("sha256").update(canonicalGoldenDigest()).digest("hex"), EXPECTED_GOLDEN_DIGEST_SHA256);
  const pack = readFileSync(fromRoot("src", "game", "ayalon-golden", "pack.ts"), "utf8");
  assert.match(pack, /export const AYALON_GOLDEN_OWNER_FREEZE = false/);
  assert.match(pack, /unique_pack_approved: true/);
  assert.doesNotMatch(pack, /placeholders_are_unique_evidence: true/);
  const owner = JSON.parse(readFileSync(fromRoot("AYALON-OWNER-APPROVAL.json"), "utf8"));
  assert.equal(owner.unique_pack_approved, true);
  assert.equal(owner.placeholders_are_unique_evidence, false);
  assert.equal(owner.freeze_granted, false);
  assert.equal(owner.gis_claim, false);
  assert.equal(owner.public_distribution, false);
  const manifest = JSON.parse(readFileSync(fromRoot("AYALON-GOLDEN-MANIFEST.json"), "utf8"));
  assert.equal(manifest.lock.unique_count, 20);
  assert.equal(manifest.lock.placeholder_count, 4);
  assert.equal(manifest.lock.placeholder_hash, DUPLICATE_PLACEHOLDER_HASH);
  assert.equal(manifest.lock.owner_freeze, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-036");
});
