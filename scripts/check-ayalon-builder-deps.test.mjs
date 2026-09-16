import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { AYALON_BUILDER_DEPS, validateAyalonBuilderDeps } from "./check-ayalon-builder-deps.mjs";

test("Ayalon builder direct imports are pinned and currently match", () => {
  assert.deepEqual(Object.keys(AYALON_BUILDER_DEPS).sort(), [
    "src/game/arrow-assets.ts",
    "src/game/road-assets.ts",
    "src/game/sign-assets.ts",
    "src/game/spline.ts",
    "src/game/tracks.ts",
    "src/game/world-builders/shared.ts",
  ]);
  assert.deepEqual(validateAyalonBuilderDeps(), []);
});

test("ayalon world-builder still imports the pinned direct dependencies", () => {
  const source = readFileSync(fromRoot("src", "game", "world-builders", "tracks", "ayalon.ts"), "utf8");
  assert.match(source, /from "\.\.\/\.\.\/spline"/);
  assert.match(source, /from "\.\.\/\.\.\/tracks"/);
  assert.match(source, /from "\.\.\/\.\.\/arrow-assets"/);
  assert.match(source, /from "\.\.\/\.\.\/sign-assets"/);
  assert.match(source, /from "\.\.\/\.\.\/road-assets"/);
  assert.match(source, /from "\.\.\/shared"/);
});
