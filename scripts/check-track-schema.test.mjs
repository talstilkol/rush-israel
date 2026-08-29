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

function errorsOf(inputs) {
  const result = validateTrackSchema(inputs);
  return Array.isArray(result) ? result : result.errors;
}

test("committed 56-track catalogue satisfies the canonical schema", () => {
  const inputs = readInputs();
  const result = validateTrackSchema(inputs);
  assert.equal(Array.isArray(result), false);
  assert.deepEqual(result.errors, []);
  assert.equal(result.summaries.length, 56);
  assert.equal(result.digest, "9f30d10a8be5d7388c23720a96ead370f9acaf38aa55aeac2f8166d8b8555230");
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
  const inputs = readInputs();
  const result = validateTrackSchema(inputs);
  assert.equal(Array.isArray(result), false);
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
  inputs.schema.change_control.RSH_015_authorized = true;
  assert.match(errorsOf(inputs).join("\n"), /over-authorized/);
});

test("runtime data mutation changes the pinned digest", () => {
  const inputs = readInputs();
  const original = '    descriptionEn: "The promenade on the Mediterranean — Hilton, Opera Tower, Gordon Beach and the marina. Inspired by the place — not a map, not GIS.",';
  const replacement = '    descriptionEn: "A changed but still valid localized description for the same track.",';
  assert.ok(inputs.trackSource.includes(original));
  inputs.trackSource = inputs.trackSource.replace(original, replacement);
  assert.match(errorsOf(inputs).join("\n"), /runtime definition digest/);
});
