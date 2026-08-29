import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateTrackSupportPin } from "./check-track-schema-support-pin.mjs";

const ACCEPTED_AGGREGATE_DIGEST =
  "1f10ef1b656fb61b414aed82a1918ade65c5093fcedf486b2aa3b37527d5dfb7";

function readInputs() {
  return {
    schema: JSON.parse(readFileSync(fromRoot("TRACK-SCHEMA.json"), "utf8")),
    supportSources: {
      "src/game/math.ts": readFileSync(fromRoot("src", "game", "math.ts"), "utf8"),
    },
    aggregateDigest: ACCEPTED_AGGREGATE_DIGEST,
  };
}

function gitBlobSha1(source) {
  const body = Buffer.from(source, "utf8");
  return createHash("sha1")
    .update(Buffer.from(`blob ${body.length}\0`, "utf8"))
    .update(body)
    .digest("hex");
}

test("committed math source and aggregate match the accepted RSH-013 baseline", () => {
  const result = validateTrackSupportPin(readInputs());
  assert.deepEqual(result.errors, []);
  assert.equal(result.actualGitBlobSha1, "c215daef16056d5d7c142db964ed93f82c74f8e8");
});

test("editing math and its editable schema hashes cannot move the accepted baseline", () => {
  const inputs = readInputs();
  const original = "export function clamp(v: number, a: number, b: number) {\n  return Math.max(a, Math.min(b, v));\n}";
  const replacement = "export function clamp(v: number, a: number, b: number) {\n  return Math.min(b, Math.max(a, v));\n}";
  const changed = inputs.supportSources["src/game/math.ts"].replace(original, replacement);
  assert.notEqual(changed, inputs.supportSources["src/game/math.ts"]);
  inputs.supportSources["src/game/math.ts"] = changed;
  inputs.schema.runtime_definition_integrity.support_sources[0].git_blob_sha1 = gitBlobSha1(changed);
  inputs.schema.runtime_definition_integrity.expected_aggregate_digest = "f".repeat(64);
  inputs.aggregateDigest = "f".repeat(64);
  const errors = validateTrackSupportPin(inputs).errors.join("\n");
  assert.match(errors, /declared math support source differs/);
  assert.match(errors, /math support source Git blob differs/);
  assert.match(errors, /declared aggregate digest differs/);
  assert.match(errors, /computed aggregate digest differs/);
});

test("schema-only support-source substitution fails closed", () => {
  const inputs = readInputs();
  inputs.schema.runtime_definition_integrity.support_sources[0].path = "src/game/other.ts";
  assert.match(
    validateTrackSupportPin(inputs).errors.join("\n"),
    /declared math support source differs/,
  );
});

test("missing support source and aggregate drift both fail closed", () => {
  const inputs = readInputs();
  inputs.supportSources = {};
  inputs.aggregateDigest = "0".repeat(64);
  const errors = validateTrackSupportPin(inputs).errors.join("\n");
  assert.match(errors, /math support source is missing/);
  assert.match(errors, /computed aggregate digest differs/);
});
