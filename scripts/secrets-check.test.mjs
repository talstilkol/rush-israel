import assert from "node:assert/strict";
import { test } from "node:test";
import { scanSecrets } from "./secrets-check.mjs";
import { fromRoot } from "./project-root.mjs";

test("src/game has no sk-/apiKey/BEGIN RSA", async () => {
  const hits = await scanSecrets(fromRoot("src", "game"));
  assert.deepEqual(hits, []);
});
