import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_ASPHALT_DIGEST_SHA256,
  EXPECTED_MARKING_DIGEST_SHA256,
  EXPECTED_SIGN_DIGEST_SHA256,
  canonicalAsphaltDigest,
  canonicalMarkingDigest,
  canonicalSignDigest,
  validateAyalonAsphalt,
} from "./check-ayalon-asphalt.mjs";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-029 Ayalon asphalt lock passes and RSH-035 remains absent", () => {
  const result = validateAyalonAsphalt();
  assert.deepEqual(result.errors, []);
  assert.equal(result.trackId, "ayalon");
  assert.equal(result.lanes, 8);
  assert.equal(result.sidewalkPresent, false);
  assert.equal(result.gantryCount, 6);
  assert.equal(result.stationGantryCount, 5);
});

test("RSH-035 precreation fails closed", () => {
  const result = validateAyalonAsphalt({
    repositoryFiles: ["RSH-035-PREFLIGHT.json", "src/game/ayalon-asphalt/asphalt.ts"],
  });
  assert.match(messages(result), /RSH-035 was precreated/);
});

test("live Ayalon asphalt stays 8-lane baked kit, sidewalks stay absent, signs stay locked", () => {
  assert.equal(createHash("sha256").update(canonicalAsphaltDigest()).digest("hex"), EXPECTED_ASPHALT_DIGEST_SHA256);
  assert.equal(createHash("sha256").update(canonicalMarkingDigest()).digest("hex"), EXPECTED_MARKING_DIGEST_SHA256);
  assert.equal(createHash("sha256").update(canonicalSignDigest()).digest("hex"), EXPECTED_SIGN_DIGEST_SHA256);
  const world = readFileSync(fromRoot("src", "game", "world.ts"), "utf8");
  assert.match(world, /if \(def\.id === "ayalon"\) return 8;/);
  assert.match(world, /def\.theme !== "highway" && def\.id !== "ayalon"/);
  const builder = readFileSync(fromRoot("src", "game", "world-builders", "tracks", "ayalon.ts"), "utf8");
  assert.match(builder, /getAyalonRoad\(\)/);
  assert.match(builder, /getSign\("speed90"\)/);
  const manifest = JSON.parse(readFileSync(fromRoot("AYALON-ASPHALT-MANIFEST.json"), "utf8"));
  assert.equal(manifest.asphalt.gis_claim, false);
  assert.equal(manifest.asphalt.owner_freeze, false);
  assert.equal(manifest.asphalt.sidewalk_present, false);
  assert.equal(manifest.asphalt.lanes, 8);
});
