import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_FREEZE_DIGEST_SHA256,
  canonicalFreezeDigest,
  validateAyalonFreeze,
} from "./check-ayalon-freeze.mjs";

function messages(result) {
  return result.errors.join("\n");
}

test("RSH-036 pending candidate inventory is internally consistent and RSH-037 remains absent", () => {
  const result = validateAyalonFreeze();
  assert.deepEqual(result.errors, []);
  assert.equal(result.frozen, false);
  assert.equal(result.sourceCount, 41);
});

test("RSH-037 precreation fails closed", () => {
  const result = validateAyalonFreeze({
    repositoryFiles: ["RSH-037-PREFLIGHT.json", "src/game/perf-instrument/metrics.ts"],
  });
  assert.match(messages(result), /RSH-037 was precreated/);
});

test("partial inventory does not grant freeze, GIS, owner-settings freeze or public distribution", () => {
  assert.equal(createHash("sha256").update(canonicalFreezeDigest()).digest("hex"), EXPECTED_FREEZE_DIGEST_SHA256);
  const freeze = readFileSync(fromRoot("src", "game", "ayalon-freeze", "freeze.ts"), "utf8");
  assert.match(freeze, /export const AYALON_FREEZE_GRANTED = false/);
  assert.match(freeze, /export const AYALON_FREEZE_GIS_CLAIM = false/);
  assert.match(freeze, /export const AYALON_FREEZE_OWNER_SETTINGS = false/);
  assert.match(freeze, /export const AYALON_FREEZE_PUBLIC_DISTRIBUTION = false/);
  const owner = JSON.parse(readFileSync(fromRoot("AYALON-OWNER-APPROVAL.json"), "utf8"));
  assert.equal(owner.unique_pack_approved, true);
  assert.equal(owner.placeholders_are_unique_evidence, false);
  assert.equal(owner.freeze_granted, false);
  assert.equal(owner.gis_claim, false);
  assert.equal(owner.public_distribution, false);
  const pack = readFileSync(fromRoot("src", "game", "ayalon-golden", "pack.ts"), "utf8");
  assert.match(pack, /export const AYALON_GOLDEN_OWNER_FREEZE = false/);
  const manifest = JSON.parse(readFileSync(fromRoot("AYALON-FREEZE-MANIFEST.json"), "utf8"));
  assert.equal(manifest.lock.freeze_granted, false);
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.owner_settings_freeze, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-037");
});

for (const mutation of ['grant', 'coverage', 'acceptance']) {
  test(`pending freeze cannot hide blocker: ${mutation}`, () => {
    const manifest = JSON.parse(readFileSync(fromRoot('AYALON-FREEZE-MANIFEST.json'), 'utf8'));
    if (mutation === 'grant') manifest.lock.freeze_granted = true;
    if (mutation === 'coverage') manifest.coverage.complete_dependency_closure = true;
    if (mutation === 'acceptance') manifest.acceptance.state = 'accepted';
    const result = validateAyalonFreeze({ manifestSource: JSON.stringify(manifest, null, 2) + '\n' });
    assert.ok(result.errors.length > 0);
    assert.match(result.errors.join(' '), /premature|blocked acceptance|partial dependency/);
  });
}
