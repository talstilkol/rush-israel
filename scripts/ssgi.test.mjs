import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

test("SSGI stays off", () => {
  const t = readFileSync(fromRoot("src", "game", "postfx.ts"), "utf8");
  assert.match(t, /export const SSGI_OFF = true/);
  assert.doesNotMatch(t, /SSGIPass|SSGINode|N8AO|GTAOPass/);
  const eng = readFileSync(fromRoot("src", "game", "engine.ts"), "utf8");
  assert.match(eng, /FogExp2/);
});
