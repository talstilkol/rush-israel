import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  EXPECTED_HEADLIGHT_DIGEST_SHA256,
  EXPECTED_NIGHT_DIGEST_SHA256,
  EXPECTED_WEATHER_DIGEST_SHA256,
  canonicalHeadlightDigest,
  canonicalNightDigest,
  canonicalWeatherDigest,
  validateNightWeather,
} from "./check-night-weather.mjs";

function messages(result) {
  return result.errors.join("\n");
}

test("committed RSH-032 night/headlight/weather lock passes and RSH-037 remains absent", () => {
  const result = validateNightWeather();
  assert.deepEqual(result.errors, []);
  assert.equal(result.look, "night");
  assert.equal(result.hdri, false);
  assert.equal(result.weatherDefault, "clear");
  assert.equal(result.skyWidth, 1024);
});

test("RSH-037 precreation fails closed", () => {
  const result = validateNightWeather({
    repositoryFiles: ["RSH-037-PREFLIGHT.json", "src/game/ayalon-night/night.ts"],
  });
  assert.match(messages(result), /RSH-037 was precreated/);
});

test("live night stays non-HDRI with headlights and four weather specs", () => {
  assert.equal(createHash("sha256").update(canonicalNightDigest()).digest("hex"), EXPECTED_NIGHT_DIGEST_SHA256);
  assert.equal(createHash("sha256").update(canonicalHeadlightDigest()).digest("hex"), EXPECTED_HEADLIGHT_DIGEST_SHA256);
  assert.equal(createHash("sha256").update(canonicalWeatherDigest()).digest("hex"), EXPECTED_WEATHER_DIGEST_SHA256);
  const sky = readFileSync(fromRoot("src", "game", "sky-assets.ts"), "utf8");
  assert.match(sky, /Baked gradient skies\. Not HDRI\./);
  assert.match(sky, /\/game\/sky-night\.png/);
  const physics = readFileSync(fromRoot("src", "game", "physics.ts"), "utf8");
  assert.match(physics, /hamsin: \{ long: 0\.9, lat: 0\.84, roll: 1\.12, hydro: 0, vis: 0\.7 \}/);
  const manifest = JSON.parse(readFileSync(fromRoot("NIGHT-WEATHER-MANIFEST.json"), "utf8"));
  assert.equal(manifest.night.gis_claim, false);
  assert.equal(manifest.night.owner_freeze, false);
  assert.equal(manifest.night.hdri, false);
  assert.equal(manifest.night.default_boot, false);
  assert.equal(manifest.ibl.real_sky_ibl, false);
  assert.equal(manifest.weather.default, "clear");
});
