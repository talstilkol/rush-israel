import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateTrackSchema } from "./check-track-schema.mjs";

const TRACK_DIGEST = "a1ccf6f71ca7c4bad7fbc1280aecb04cdc4390ca400cf183cd3fde916d14294d";
const AGGREGATE_DIGEST = "1f10ef1b656fb61b414aed82a1918ade65c5093fcedf486b2aa3b37527d5dfb7";

function readInputs() {
  const mathSource = readFileSync(fromRoot("src", "game", "math.ts"), "utf8");
  return {
    schema: JSON.parse(readFileSync(fromRoot("TRACK-SCHEMA.json"), "utf8")),
    classification: JSON.parse(
      readFileSync(fromRoot("TRACK-CATALOGUE-CLASSIFICATION.json"), "utf8"),
    ),
    typeSource: readFileSync(fromRoot("src", "game", "types.ts"), "utf8"),
    trackSource: readFileSync(fromRoot("src", "game", "tracks.ts"), "utf8"),
    trackSchemaSource: readFileSync(fromRoot("src", "game", "track-schema.ts"), "utf8"),
    supportSources: { "src/game/math.ts": mathSource },
  };
}

function resultOf(inputs) {
  const result = validateTrackSchema(inputs);
  assert.equal(Array.isArray(result), false);
  return result;
}

function errorsOf(inputs) {
  return resultOf(inputs).errors.join("\n");
}

test("hardened committed track authority pins both exact digests", () => {
  const result = resultOf(readInputs());
  assert.deepEqual(result.errors, []);
  assert.equal(result.digest, TRACK_DIGEST);
  assert.equal(result.aggregateDigest, AGGREGATE_DIGEST);
  assert.deepEqual(result.supportSourceIdentities, [
    {
      module: "./math",
      path: "src/game/math.ts",
      git_blob_sha1: "c215daef16056d5d7c142db964ed93f82c74f8e8",
    },
  ]);
});

test("schema theme enum must equal TrackDef.theme exactly", () => {
  const inputs = readInputs();
  inputs.schema.type_contract.theme_enum = inputs.schema.type_contract.theme_enum.slice(1);
  assert.match(errorsOf(inputs), /theme enum must exactly match/);
});

test("required and optional helper key lists are exact and partitioned", () => {
  const missing = readInputs();
  missing.trackSchemaSource = missing.trackSchemaSource.replace('  "seed",\n', "");
  assert.match(errorsOf(missing), /TRACK_REQUIRED_PROPERTIES/);

  const overlap = readInputs();
  overlap.trackSchemaSource = overlap.trackSchemaSource.replace(
    'export const TRACK_OPTIONAL_PROPERTIES = [\n',
    'export const TRACK_OPTIONAL_PROPERTIES = [\n  "id",\n',
  );
  assert.match(errorsOf(overlap), /TRACK_OPTIONAL_PROPERTIES|exact partition/);
});

test("direct-array return cannot impersonate the reviewed Ayalon builder", () => {
  const inputs = readInputs();
  const original = `    points: (() => {\n      const west = 34.795;\n      const pts: { x: number; z: number }[] = [];\n      for (let lat = 32.052; lat <= 32.106; lat += 0.002) pts.push(tlv(Number(lat.toFixed(4)), west));\n      return pts;\n    })(),`;
  assert.ok(inputs.trackSource.includes(original));
  inputs.trackSource = inputs.trackSource.replace(
    original,
    `    points: (() => {\n      const west = 34.795;\n      return [tlv(32.052, west), tlv(32.054, west), tlv(32.056, west)];\n    })(),`,
  );
  assert.match(errorsOf(inputs), /same-scope local-array\/push\/final-return/);
});

test("nested-function push cannot impersonate the reviewed Ayalon builder", () => {
  const inputs = readInputs();
  const line = "      for (let lat = 32.052; lat <= 32.106; lat += 0.002) pts.push(tlv(Number(lat.toFixed(4)), west));";
  assert.ok(inputs.trackSource.includes(line));
  inputs.trackSource = inputs.trackSource.replace(
    line,
    "      const fill = () => pts.push(tlv(32.052, west));\n      fill();",
  );
  assert.match(errorsOf(inputs), /same-scope local-array\/push\/final-return/);
});

test("reassigning the returned Ayalon array fails closed", () => {
  const inputs = readInputs();
  const line = "      return pts;";
  assert.ok(inputs.trackSource.includes(line));
  inputs.trackSource = inputs.trackSource.replace(line, "      pts = [];\n      return pts;");
  assert.match(errorsOf(inputs), /same-scope local-array\/push\/final-return/);
});

test("a local transform named defineTracks cannot wrap TRACKS", () => {
  const inputs = readInputs();
  const start = "export const TRACKS: TrackDef[] = [";
  const end = "\n];\n\nexport function getTrack";
  assert.ok(inputs.trackSource.includes(start));
  assert.ok(inputs.trackSource.includes(end));
  inputs.trackSource = inputs.trackSource
    .replace(
      start,
      "const defineTracks = (tracks: TrackDef[]) => [...tracks].reverse();\n"
        + "export const TRACKS: TrackDef[] = defineTracks([",
    )
    .replace(end, "\n]);\n\nexport function getTrack");
  assert.match(errorsOf(inputs), /imported defineTracks from \.\/track-schema/);
});

test("imported defineTracks must itself remain an identity helper", () => {
  const inputs = readInputs();
  inputs.trackSchemaSource = inputs.trackSchemaSource.replace(
    "  return tracks;\n}",
    "  return [...tracks].reverse() as unknown as T;\n}",
  );
  assert.match(errorsOf(inputs), /return its exact input|identity helper/);
});

test("configured math support source is pinned by Git blob identity and aggregate", () => {
  const inputs = readInputs();
  const original = "export function clamp(v: number, a: number, b: number) {\n  return Math.max(a, Math.min(b, v));\n}";
  const replacement = "export function clamp(v: number, a: number, b: number) {\n  return Math.min(b, Math.max(a, v));\n}";
  assert.ok(inputs.supportSources["src/game/math.ts"].includes(original));
  inputs.supportSources["src/game/math.ts"] = inputs.supportSources["src/game/math.ts"].replace(
    original,
    replacement,
  );
  const result = resultOf(inputs);
  assert.equal(result.digest, TRACK_DIGEST);
  assert.notEqual(result.aggregateDigest, AGGREGATE_DIGEST);
  assert.match(result.errors.join("\n"), /Git blob identity|aggregate runtime definition digest/);
});

test("declared support-source identity cannot be edited independently", () => {
  const inputs = readInputs();
  inputs.schema.runtime_definition_integrity.support_sources[0].git_blob_sha1 =
    "0000000000000000000000000000000000000000";
  assert.match(errorsOf(inputs), /Git blob identity/);
});

test("declared 56/8/48 counts fail closed when any value drifts", () => {
  for (const key of ["expected_track_count", "expected_mvp_count", "expected_deferred_count"]) {
    const inputs = readInputs();
    inputs.schema.catalogue[key] += 1;
    assert.match(errorsOf(inputs), /declared counts must remain exactly 56 total, 8 MVP and 48 deferred/);
  }
});
