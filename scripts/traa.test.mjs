import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { HAS_TRAA_NODE, PHOTO_AA } from "../src/rendering/traa.ts";

test("r185 Photo AA is SMAA, no hand-rolled TRAA", () => {
  assert.equal(HAS_TRAA_NODE, false);
  assert.equal(PHOTO_AA, "smaa");
  const post = readFileSync("/workspace/src/game/postfx.ts", "utf8");
  assert.match(post, /SMAAPass/);
  assert.doesNotMatch(post, /TAARenderPass|TRAANode/);
});
