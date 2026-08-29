import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateTrackSchema } from "./check-track-schema.mjs";

function readInputs() {
  return {
    schema: JSON.parse(readFileSync(fromRoot("TRACK-SCHEMA.json"), "utf8")),
    classification: JSON.parse(
      readFileSync(fromRoot("TRACK-CATALOGUE-CLASSIFICATION.json"), "utf8"),
    ),
    typeSource: readFileSync(fromRoot("src", "game", "types.ts"), "utf8"),
    trackSource: readFileSync(fromRoot("src", "game", "tracks.ts"), "utf8"),
  };
}

function resultOf(inputs) {
  const result = validateTrackSchema(inputs);
  assert.equal(Array.isArray(result), false);
  return result;
}

function errorsOf(inputs) {
  return resultOf(inputs).errors;
}

test("committed 56-track catalogue satisfies the canonical schema", () => {
  const inputs = readInputs();
  const result = resultOf(inputs);
  assert.deepEqual(result.errors, []);
  assert.equal(result.summaries.length, 56);
  assert.match(result.digest, /^[0-9a-f]{64}$/);
  if (inputs.schema.runtime_definition_integrity.expected_digest !== null) {
    assert.equal(result.digest, inputs.schema.runtime_definition_integrity.expected_digest);
  }
  assert.notDeepEqual(
    result.summaries.map((entry) => entry.id),
    inputs.schema.catalogue.ids_in_canonical_order,
  );
  console.log(`track-schema-runtime-digest=${result.digest}`);
});

test("schema and TrackDef required keys cannot drift", () => {
  const inputs = readInputs();
  inputs.schema.type_contract.required_properties = inputs.schema.type_contract.required_properties
    .filter((key) => key !== "seed");
  assert.match(errorsOf(inputs).join("\n"), /required properties/);
});

test("schema and TrackId order cannot drift", () => {
  const inputs = readInputs();
  [inputs.schema.catalogue.ids_in_canonical_order[0], inputs.schema.catalogue.ids_in_canonical_order[1]] =
    [inputs.schema.catalogue.ids_in_canonical_order[1], inputs.schema.catalogue.ids_in_canonical_order[0]];
  assert.match(errorsOf(inputs).join("\n"), /TrackId order/);
});

test("a missing required track property fails closed", () => {
  const inputs = readInputs();
  inputs.trackSource = inputs.trackSource.replace(
    '    seed: 1812,\n',
    "",
  );
  assert.match(errorsOf(inputs).join("\n"), /missing required property seed/);
});

test("an unknown top-level track property fails closed", () => {
  const inputs = readInputs();
  inputs.trackSource = inputs.trackSource.replace(
    '    seed: 1812,\n',
    '    seed: 1812,\n    unreviewedField: true,\n',
  );
  assert.match(errorsOf(inputs).join("\n"), /unknown property unreviewedField/);
});

test("track image identity remains bound to TrackId", () => {
  const inputs = readInputs();
  inputs.trackSource = inputs.trackSource.replace(
    '    image: "/tracks/hayarkon.jpg",\n',
    '    image: "/tracks/other.jpg",\n',
  );
  assert.match(errorsOf(inputs).join("\n"), /image must equal \/tracks\/hayarkon\.jpg/);
});

test("duplicate track IDs fail closed", () => {
  const inputs = readInputs();
  inputs.trackSource = inputs.trackSource.replace(
    '    id: "oldjaffa",\n',
    '    id: "hayarkon",\n',
  );
  assert.match(errorsOf(inputs).join("\n"), /unique|same unique IDs/);
});

test("invalid normalized street ranges fail closed", () => {
  const inputs = readInputs();
  inputs.trackSource = inputs.trackSource.replace(
    '{ from: 0.0, to: 0.22, he: "טיילת הרברט סמואל", en: "Herbert Samuel" }',
    '{ from: 0.8, to: 0.2, he: "טיילת הרברט סמואל", en: "Herbert Samuel" }',
  );
  assert.match(errorsOf(inputs).join("\n"), /ordered normalized range/);
});

test("the Ayalon zero-argument point-builder IIFE is explicitly accepted", () => {
  const result = resultOf(readInputs());
  assert.doesNotMatch(result.errors.join("\n"), /track\[8\]\.points/);
});

test("MVP membership cannot expand implicitly", () => {
  const inputs = readInputs();
  const deferred = inputs.classification.entries.find((entry) => entry.id === "hayarkon");
  deferred.status = "mvp";
  assert.match(errorsOf(inputs).join("\n"), /MVP set|classification counts/);
});

test("RSH-015 remains outside the authorised schema change", () => {
  const inputs = readInputs();
  inputs.schema.change_control["RSH-015_authorized"] = true;
  assert.match(errorsOf(inputs).join("\n"), /over-authorized/);
});

test("noncanonical underscore RSH control keys fail closed", () => {
  const inputs = readInputs();
  inputs.schema.change_control.RSH_015_authorized = false;
  assert.match(errorsOf(inputs).join("\n"), /hyphenated RSH IDs/);
});

test("runtime object mutation changes the closure digest", () => {
  const baseline = readInputs();
  const baselineDigest = resultOf(baseline).digest;
  const changed = readInputs();
  const original =
    '    descriptionEn: "The promenade on the Mediterranean — Hilton, Opera Tower, Gordon Beach and the marina. Inspired by the place — not a map, not GIS.",';
  const replacement =
    '    descriptionEn: "A changed but still valid localized description for the same track.",';
  assert.ok(changed.trackSource.includes(original));
  changed.trackSource = changed.trackSource.replace(original, replacement);
  assert.notEqual(resultOf(changed).digest, baselineDigest);
});

test("referenced sky preset mutation changes the closure digest", () => {
  const baselineDigest = resultOf(readInputs()).digest;
  const changed = readInputs();
  assert.ok(changed.trackSource.includes("const TLV_BLUE = {\n  elevation: 8.4,"));
  changed.trackSource = changed.trackSource.replace(
    "const TLV_BLUE = {\n  elevation: 8.4,",
    "const TLV_BLUE = {\n  elevation: 8.5,",
  );
  assert.notEqual(resultOf(changed).digest, baselineDigest);
});

test("referenced coordinate helper mutation changes the closure digest", () => {
  const baselineDigest = resultOf(readInputs()).digest;
  const changed = readInputs();
  assert.ok(changed.trackSource.includes("x: (lon - 34.77) * 94350 * 0.45,"));
  changed.trackSource = changed.trackSource.replace(
    "x: (lon - 34.77) * 94350 * 0.45,",
    "x: (lon - 34.77) * 94350 * 0.46,",
  );
  assert.notEqual(resultOf(changed).digest, baselineDigest);
});

test("unreferenced utility source is outside the track-definition digest", () => {
  const baselineDigest = resultOf(readInputs()).digest;
  const unchanged = readInputs();
  assert.equal(resultOf(unchanged).digest, baselineDigest);
});

test("TRACKS rejects wrappers other than defineTracks", () => {
  const inputs = readInputs();
  const start = "export const TRACKS: TrackDef[] = [";
  const end = "\n];\n\nexport function getTrack";
  assert.ok(inputs.trackSource.includes(start));
  assert.ok(inputs.trackSource.includes(end));
  inputs.trackSource = inputs.trackSource
    .replace(
      start,
      "const reverseTracks = (tracks: TrackDef[]) => [...tracks].reverse();\n"
        + "export const TRACKS: TrackDef[] = reverseTracks([",
    )
    .replace(end, "\n]);\n\nexport function getTrack");
  assert.match(errorsOf(inputs).join("\n"), /wrapper must be the identity helper defineTracks/);
});

test("declared field contracts cannot drift from enforcement", () => {
  const inputs = readInputs();
  inputs.schema.field_contracts.width.maximum = 1;
  assert.match(errorsOf(inputs).join("\n"), /declared field contracts/);
});

test("pinned digest fails closed when any effective runtime helper changes", () => {
  const inputs = readInputs();
  if (inputs.schema.runtime_definition_integrity.expected_digest === null) return;
  inputs.trackSource = inputs.trackSource.replace(
    "const TLV_BLUE = {\n  elevation: 8.4,",
    "const TLV_BLUE = {\n  elevation: 8.5,",
  );
  assert.match(errorsOf(inputs).join("\n"), /runtime definition digest/);
});
