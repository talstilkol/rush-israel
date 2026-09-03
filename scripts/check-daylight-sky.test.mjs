import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_DAYLIGHT_DIGEST_SHA256,
  EXPECTED_IBL_DIGEST_SHA256,
  EXPECTED_SKY_DIGEST_SHA256,
  canonicalDaylightDigest,
  canonicalIblDigest,
  canonicalSkyDigest,
  validateDaylightSky,
} from "./check-daylight-sky.mjs";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-031 daylight/sky/IBL lock passes and RSH-036 remains absent", () => {
  const result = validateDaylightSky();
  assert.deepEqual(result.errors, []);
  assert.equal(result.look, "summer14");
  assert.equal(result.hdri, false);
  assert.equal(result.iblKind, "tiny_pmrem");
  assert.equal(result.skyWidth, 1024);
});

test("RSH-036 precreation fails closed", () => {
  const result = validateDaylightSky({
    repositoryFiles: ["RSH-036-PREFLIGHT.json", "src/game/ayalon-light/daylight.ts"],
  });
  assert.match(messages(result), /RSH-036 was precreated/);
});

test("live daylight stays non-HDRI summer14 with baked sky and tiny PMREM", () => {
  assert.equal(createHash("sha256").update(canonicalDaylightDigest()).digest("hex"), EXPECTED_DAYLIGHT_DIGEST_SHA256);
  assert.equal(createHash("sha256").update(canonicalSkyDigest()).digest("hex"), EXPECTED_SKY_DIGEST_SHA256);
  assert.equal(createHash("sha256").update(canonicalIblDigest()).digest("hex"), EXPECTED_IBL_DIGEST_SHA256);
  const sky = readFileSync(fromRoot("src", "game", "sky-assets.ts"), "utf8");
  assert.match(sky, /Baked gradient skies\. Not HDRI\./);
  assert.match(sky, /\/game\/sky-day\.png/);
  const postfx = readFileSync(fromRoot("src", "game", "postfx.ts"), "utf8");
  assert.match(postfx, /Not an HDRI\. Not IBL from a real sky/);
  const manifest = JSON.parse(readFileSync(fromRoot("DAYLIGHT-SKY-MANIFEST.json"), "utf8"));
  assert.equal(manifest.daylight.gis_claim, false);
  assert.equal(manifest.daylight.owner_freeze, false);
  assert.equal(manifest.daylight.hdri, false);
  assert.equal(manifest.ibl.real_sky_ibl, false);
});
