import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateTrackSchema } from "./check-track-schema.mjs";
import { validateTrackTypeSourcePin } from "./check-track-type-source-pin.mjs";

function typeSource() {
  return readFileSync(fromRoot("src", "game", "types.ts"), "utf8");
}

function completeInputs(mutatedTypeSource) {
  return {
    schema: JSON.parse(readFileSync(fromRoot("TRACK-SCHEMA.json"), "utf8")),
    classification: JSON.parse(
      readFileSync(fromRoot("TRACK-CATALOGUE-CLASSIFICATION.json"), "utf8"),
    ),
    sourcePin: JSON.parse(readFileSync(fromRoot("TRACK-SOURCE-PIN.json"), "utf8")),
    typeSource: mutatedTypeSource,
    trackSource: readFileSync(fromRoot("src", "game", "tracks.ts"), "utf8"),
    trackSchemaSource: readFileSync(fromRoot("src", "game", "track-schema.ts"), "utf8"),
    supportSources: {
      "src/game/math.ts": readFileSync(fromRoot("src", "game", "math.ts"), "utf8"),
    },
  };
}

function broadenVec2() {
  const source = typeSource();
  const changed = source.replace(
    "export type Vec2 = { x: number; z: number };",
    "export type Vec2 = { x: number | string; z: number };",
  );
  assert.notEqual(changed, source);
  return changed;
}

test("the complete track type source is pinned to its accepted Git blob", () => {
  const result = validateTrackTypeSourcePin(typeSource());
  assert.deepEqual(result.errors, []);
  assert.equal(
    result.actualGitBlobSha1,
    "f2ce095b2fcd4f9fa6f55ce0c3413ffa8d09d6c0",
  );
});

test("changing a transitive TrackDef alias fails the type-source pin", () => {
  assert.match(
    validateTrackTypeSourcePin(broadenVec2()).errors.join("\n"),
    /src\/game\/types\.ts Git blob identity/,
  );
});

test("the complete schema gate incorporates the transitive type-source pin", () => {
  const result = validateTrackSchema(completeInputs(broadenVec2()));
  assert.equal(Array.isArray(result), false);
  assert.match(
    result.errors.join("\n"),
    /src\/game\/types\.ts Git blob identity/,
  );
});
