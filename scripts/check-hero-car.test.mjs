import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_HERO_DIGEST_SHA256,
  EXPECTED_LOD_DIGEST_SHA256,
  EXPECTED_SIL_DIGEST_SHA256,
  canonicalHeroDigest,
  canonicalLodDigest,
  canonicalSilhouetteDigest,
  extractBodyShapes,
  rasterSilhouette,
  validateHeroCar,
} from "./check-hero-car.mjs";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-030 hero-car lock passes and RSH-036 remains absent", () => {
  const result = validateHeroCar();
  assert.deepEqual(result.errors, []);
  assert.equal(result.carCount, 5);
  assert.equal(result.fictional, true);
  assert.equal(result.scanned, false);
  assert.equal(result.lod0, 40000);
});

test("RSH-036 precreation fails closed", () => {
  const result = validateHeroCar({
    repositoryFiles: ["RSH-036-PREFLIGHT.json", "src/game/hero-car/hero.ts"],
  });
  assert.match(messages(result), /RSH-036 was precreated/);
});

test("live hero cars stay five fictional extrusions with distinct silhouettes", () => {
  assert.equal(createHash("sha256").update(canonicalHeroDigest()).digest("hex"), EXPECTED_HERO_DIGEST_SHA256);
  assert.equal(createHash("sha256").update(canonicalLodDigest()).digest("hex"), EXPECTED_LOD_DIGEST_SHA256);
  assert.equal(createHash("sha256").update(canonicalSilhouetteDigest()).digest("hex"), EXPECTED_SIL_DIGEST_SHA256);
  const cars = readFileSync(fromRoot("src", "game", "cars.ts"), "utf8");
  assert.match(cars, /id: "sabra"/);
  assert.match(cars, /id: "yam"/);
  const mesh = readFileSync(fromRoot("src", "game", "car-mesh.ts"), "utf8");
  const shapes = extractBodyShapes(mesh);
  assert.ok(shapes);
  const hashes = ["gt", "hatch", "muscle", "rally", "super"].map((kind) => rasterSilhouette(shapes[kind]));
  assert.equal(new Set(hashes).size, 5);
  const manifest = JSON.parse(readFileSync(fromRoot("HERO-CAR-MANIFEST.json"), "utf8"));
  assert.equal(manifest.hero.gis_claim, false);
  assert.equal(manifest.hero.owner_freeze, false);
  assert.equal(manifest.hero.hero_gltf_present, false);
  assert.equal(manifest.hero.scanned, false);
});
