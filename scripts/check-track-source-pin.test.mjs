import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateTrackModuleManifest } from "./check-track-module-manifest.mjs";

test("RSH-014 replaces the single-file source pin with the modular manifest", () => {
  assert.equal(existsSync(fromRoot("TRACK-SOURCE-PIN.json")), false);
  assert.deepEqual(validateTrackModuleManifest().errors, []);
});
