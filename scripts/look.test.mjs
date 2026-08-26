import assert from "node:assert/strict";
import { test } from "node:test";
import { FOG, fogKey, lookFromFlags, LOOKS } from "../src/rendering/EnvironmentState.ts";

test("fog table keys", () => {
  assert.equal(fogKey("highway", "ayalon"), "city");
  assert.equal(fogKey("desert", "ramon"), "desert");
  assert.equal(fogKey("snow", "hermon"), "snow");
  assert.equal(fogKey("carmel", "haifa"), "carmel");
  assert.equal(fogKey("stone", "jerusalem"), "stone");
  assert.ok(FOG.city.day < FOG.city.night);
  assert.equal(FOG.desert.far, 12000);
});

test("lookFromFlags", () => {
  assert.equal(lookFromFlags(false, "clear"), "summer14");
  assert.equal(lookFromFlags(false, "clear", true), "golden");
  assert.equal(lookFromFlags(true, "clear"), "night");
  assert.equal(lookFromFlags(true, "rain"), "nightrain");
  assert.equal(lookFromFlags(false, "rain"), "rain");
  assert.equal(LOOKS.night.wetness < LOOKS.nightrain.wetness, true);
});
