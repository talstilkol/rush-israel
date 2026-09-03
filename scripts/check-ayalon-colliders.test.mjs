import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_CHECKPOINT_SHA256,
  EXPECTED_RAMP_RECIPE_SHA256,
  canonicalCheckpointDigest,
  canonicalRampRecipeDigest,
  liveCheckpoints,
  validateAyalonColliders,
} from "./check-ayalon-colliders.mjs";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-027 Ayalon collider lock passes under the RSH-029 overlay and RSH-034 remains absent", () => {
  const result = validateAyalonColliders();
  assert.deepEqual(result.errors, []);
  assert.equal(result.trackId, "ayalon");
  assert.equal(result.rampCount, 50);
  assert.equal(result.checkpointCount, 8);
  assert.equal(result.interchangeCount, 6);
});

test("RSH-034 precreation fails closed", () => {
  const result = validateAyalonColliders({
    repositoryFiles: ["RSH-034-PREFLIGHT.json", "src/game/ayalon-colliders/colliders.ts"],
  });
  assert.match(messages(result), /RSH-034 was precreated/);
});

test("live checkpoints stay 8 open fractions and ramp recipe stays 50", () => {
  const checkpoints = liveCheckpoints();
  assert.equal(checkpoints.length, 8);
  assert.equal(checkpoints[0], 1 / 8.15);
  assert.equal(checkpoints[7], 8 / 8.15);
  assert.equal(createHash("sha256").update(canonicalCheckpointDigest(checkpoints)).digest("hex"), EXPECTED_CHECKPOINT_SHA256);
  assert.equal(createHash("sha256").update(canonicalRampRecipeDigest()).digest("hex"), EXPECTED_RAMP_RECIPE_SHA256);
  const track = readFileSync(fromRoot("src", "game", "tracks", "ayalon.ts"), "utf8");
  assert.match(track, /checkpointCount: 8/);
  const spline = readFileSync(fromRoot("src", "game", "spline.ts"), "utf8");
  assert.match(spline, /\(i \+ 1\) \/ \(def\.checkpointCount \+ 0\.15\)/);
  const world = readFileSync(fromRoot("src", "game", "world.ts"), "utf8");
  assert.match(world, /built\.width \/ 2 \+ 1\.55/);
  assert.match(world, /kind: "barrier"/);
  const builder = readFileSync(fromRoot("src", "game", "world-builders", "tracks", "ayalon.ts"), "utf8");
  assert.match(builder, /const deckY = 9\.4;/);
  assert.match(builder, /const zLen = 68;/);
  const manifest = JSON.parse(readFileSync(fromRoot("AYALON-COLLIDER-MANIFEST.json"), "utf8"));
  assert.equal(manifest.colliders.gis_claim, false);
  assert.equal(manifest.colliders.owner_freeze, false);
  assert.equal(manifest.colliders.ramp_count, 50);
});
