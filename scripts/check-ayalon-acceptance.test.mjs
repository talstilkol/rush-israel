import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateAyalonAcceptance, DUPLICATE_PLACEHOLDER_HASH } from "./check-ayalon-acceptance.mjs";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-025 Ayalon acceptance authority passes under the RSH-029 overlay and RSH-031 remains absent", () => {
  const result = validateAyalonAcceptance();
  assert.deepEqual(result.errors, []);
  assert.equal(result.trackId, "ayalon");
  assert.equal(result.packFiles, 24);
  assert.equal(result.duplicatePlaceholders, 4);
});

test("RSH-031 precreation fails closed", () => {
  const result = validateAyalonAcceptance({
    repositoryFiles: ["RSH-031-PREFLIGHT.json", "src/game/tracks/ayalon.ts"],
  });
  assert.match(messages(result), /RSH-031 was precreated/);
});

test("Ayalon V1 identity stays a fictional one-carriageway highway", () => {
  const track = readFileSync(fromRoot("src", "game", "tracks", "ayalon.ts"), "utf8");
  assert.match(track, /id: "ayalon"/);
  assert.match(track, /width: 28/);
  assert.match(track, /theme: "highway"/);
  assert.match(track, /open: true/);
  assert.match(track, /Not GIS/);
  const manifest = JSON.parse(readFileSync(fromRoot("AYALON-ACCEPTANCE-MANIFEST.json"), "utf8"));
  assert.equal(manifest.track_identity.gis_claim, false);
  assert.equal(manifest.track_identity.owner_freeze, false);
});

test("HaShalom placeholder shots remain the recorded duplicate hash", () => {
  const manifest = JSON.parse(readFileSync(fromRoot("AYALON-ACCEPTANCE-MANIFEST.json"), "utf8"));
  for (const name of manifest.reference_pack.duplicate_placeholder_shots) {
    assert.equal(manifest.reference_pack.files[name], DUPLICATE_PLACEHOLDER_HASH);
  }
});
