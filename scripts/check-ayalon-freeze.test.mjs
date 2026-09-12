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

test("committed RSH-036 Ayalon freeze passes and RSH-037 remains absent", () => {
  const result = validateAyalonFreeze();
  assert.deepEqual(result.errors, []);
  assert.equal(result.frozen, true);
  assert.equal(result.sourceCount, 36);
});

test("RSH-037 precreation fails closed", () => {
  const result = validateAyalonFreeze({
    repositoryFiles: ["RSH-037-PREFLIGHT.json", "src/game/perf-instrument/metrics.ts"],
  });
  assert.match(messages(result), /RSH-037 was precreated/);
});

test("freeze is granted without GIS, owner-settings freeze or public distribution", () => {
  assert.equal(createHash("sha256").update(canonicalFreezeDigest()).digest("hex"), EXPECTED_FREEZE_DIGEST_SHA256);
  const freeze = readFileSync(fromRoot("src", "game", "ayalon-freeze", "freeze.ts"), "utf8");
  assert.match(freeze, /export const AYALON_FREEZE_GRANTED = true/);
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
  assert.equal(manifest.lock.freeze_granted, true);
  assert.equal(manifest.lock.gis_claim, false);
  assert.equal(manifest.lock.owner_settings_freeze, false);
  assert.equal(manifest.lock.public_distribution, false);
  assert.equal(manifest.deferred_boundary.queue_head, "RSH-037");
});
