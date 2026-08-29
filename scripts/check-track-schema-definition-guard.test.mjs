import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  analyzeTrackDefinitionClosure,
  validateTrackDefinitionClosure,
} from "./check-track-schema-definition-guard.mjs";
import { readCanonicalTrackSource } from "./load-track-modules.mjs";

const SOURCE = readCanonicalTrackSource();
const TRACKS_MARKER = "export const TRACKS: TrackDef[] = [";

function insertBeforeTracks(statement) {
  assert.ok(SOURCE.includes(TRACKS_MARKER));
  return SOURCE.replace(TRACKS_MARKER, `${statement}\n\n${TRACKS_MARKER}`);
}

function errors(source) {
  return validateTrackDefinitionClosure(source).join("\n");
}

test("committed source seals all 44 referenced top-level runtime definitions", () => {
  const result = analyzeTrackDefinitionClosure(SOURCE);
  assert.deepEqual(result.errors, []);
  assert.equal(result.protectedDefinitions.length, 44);
  assert.ok(result.protectedDefinitions.includes("TLV_BLUE"));
  assert.ok(result.protectedDefinitions.includes("tlv"));
  assert.equal(result.protectedDefinitions.includes("TLV_NIGHT"), false);
  assert.equal(result.protectedDefinitions.includes("CITY_FILTERS"), false);
});

test("direct preset property mutation outside the hashed declaration closure fails closed", () => {
  assert.match(
    errors(insertBeforeTracks("TLV_BLUE.elevation = 9;")),
    /referenced runtime definition TLV_BLUE is used outside/,
  );
});

test("preset aliasing outside the hashed declaration closure fails closed before later mutation", () => {
  assert.match(
    errors(insertBeforeTracks("const presetAlias = TLV_BLUE; presetAlias.elevation = 9;")),
    /referenced runtime definition TLV_BLUE is used outside/,
  );
});

test("helper reassignment outside the hashed declaration closure fails closed", () => {
  assert.match(
    errors(insertBeforeTracks("tlv = (lat: number, lon: number) => ({ x: lat, z: lon });")),
    /referenced runtime definition tlv is used outside/,
  );
});

test("object mutator use outside the hashed declaration closure fails closed", () => {
  assert.match(
    errors(insertBeforeTracks("Object.assign(TLV_BLUE, { elevation: 9 });")),
    /referenced runtime definition TLV_BLUE is used outside/,
  );
});

test("passing a protected preset to a function outside the hashed closure fails closed", () => {
  assert.match(
    errors(insertBeforeTracks("function rewrite(value: { elevation: number }) { value.elevation = 9; } rewrite(TLV_BLUE);")),
    /referenced runtime definition TLV_BLUE is used outside/,
  );
});

test("a non-protected mutator function cannot capture a protected definition", () => {
  assert.match(
    errors(insertBeforeTracks("function mutatePreset() { TLV_BLUE.elevation = 9; } mutatePreset();")),
    /referenced runtime definition TLV_BLUE is used outside/,
  );
});

test("transitive reads inside protected declarations remain inside the hashed closure", () => {
  const source = `
const PRESET = { elevation: 8 };
function point() { return { x: PRESET.elevation, z: 0 }; }
const TRACKS = [{ id: "a", points: [point(), point(), point()] }];
`;
  const result = analyzeTrackDefinitionClosure(source);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.protectedDefinitions, ["PRESET", "point"]);
});

test("mutating an unrelated unreferenced definition is outside this guard", () => {
  const source = `
const UNUSED = { elevation: 8 };
UNUSED.elevation = 9;
const TRACKS = [{ id: "a", points: [{ x: 0, z: 0 }, { x: 1, z: 1 }, { x: 2, z: 2 }] }];
`;
  assert.deepEqual(validateTrackDefinitionClosure(source), []);
});

test("a referenced definition used after TRACKS also fails closed", () => {
  assert.match(
    errors(`${SOURCE}\nvoid TLV_BLUE;\n`),
    /referenced runtime definition TLV_BLUE is used outside/,
  );
});
