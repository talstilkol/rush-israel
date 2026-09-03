import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_PLACEMENT_SHA256,
  EXPECTED_POI_SHA256,
  LIVE_POIS,
  canonicalPlacementDigest,
  canonicalPoiDigest,
  validateAyalonLandmarks,
} from "./check-ayalon-landmarks.mjs";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-028 Ayalon landmark lock passes under the RSH-029 overlay and RSH-030 remains absent", () => {
  const result = validateAyalonLandmarks();
  assert.deepEqual(result.errors, []);
  assert.equal(result.trackId, "ayalon");
  assert.equal(result.poiCount, 9);
  assert.equal(result.placeCalls, 8);
  assert.equal(result.extraLandmarks, 6);
});

test("RSH-030 precreation fails closed", () => {
  const result = validateAyalonLandmarks({
    repositoryFiles: ["RSH-030-PREFLIGHT.json", "src/game/ayalon-landmarks/landmarks.ts"],
  });
  assert.match(messages(result), /RSH-030 was precreated/);
});

test("live POIs stay 9 inspired placements and builder recipes stay locked", () => {
  assert.equal(LIVE_POIS.length, 9);
  assert.equal(LIVE_POIS[0].en, "HaHagana Station");
  assert.equal(LIVE_POIS[8].en, "Midtown TLV");
  assert.equal(createHash("sha256").update(canonicalPoiDigest()).digest("hex"), EXPECTED_POI_SHA256);
  assert.equal(createHash("sha256").update(canonicalPlacementDigest()).digest("hex"), EXPECTED_PLACEMENT_SHA256);
  const track = readFileSync(fromRoot("src", "game", "tracks", "ayalon.ts"), "utf8");
  assert.match(track, /en: "Azrieli"/);
  assert.match(track, /en: "ToHa Tower"/);
  const builder = readFileSync(fromRoot("src", "game", "world-builders", "tracks", "ayalon.ts"), "utf8");
  assert.match(builder, /placeAzrieli\(1\.42\);/);
  assert.match(builder, /placeToHa\(1\.28, 32\.0695, 34\.7894\);/);
  const manifest = JSON.parse(readFileSync(fromRoot("AYALON-LANDMARK-MANIFEST.json"), "utf8"));
  assert.equal(manifest.landmarks.gis_claim, false);
  assert.equal(manifest.landmarks.owner_freeze, false);
  assert.equal(manifest.landmarks.track_poi_count, 9);
});
