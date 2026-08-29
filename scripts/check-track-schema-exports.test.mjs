import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateTrackSchemaExports } from "./check-track-schema-exports.mjs";

function source() {
  return readFileSync(fromRoot("src", "game", "track-schema.ts"), "utf8");
}

function mutatedSource(before, after) {
  const original = source();
  const mutated = original.replace(before, after);
  assert.notEqual(mutated, original);
  return mutated;
}

test("canonical key authorities and typed identity helpers are exported and frozen", () => {
  assert.deepEqual(validateTrackSchemaExports(source()), []);
});

test("removing export from either key authority fails closed", () => {
  for (const name of ["TRACK_REQUIRED_PROPERTIES", "TRACK_OPTIONAL_PROPERTIES"]) {
    const mutated = mutatedSource(`export const ${name}`, `const ${name}`);
    assert.match(validateTrackSchemaExports(mutated).join("\n"), new RegExp(`${name} must remain exported`));
  }
});

test("changing either key authority from const fails closed", () => {
  for (const name of ["TRACK_REQUIRED_PROPERTIES", "TRACK_OPTIONAL_PROPERTIES"]) {
    const mutated = mutatedSource(`export const ${name}`, `export let ${name}`);
    assert.match(validateTrackSchemaExports(mutated).join("\n"), new RegExp(`${name} must remain a const authority`));
  }
});

test("removing either immediate runtime freeze fails closed", () => {
  for (const name of ["TRACK_REQUIRED_PROPERTIES", "TRACK_OPTIONAL_PROPERTIES"]) {
    const mutated = mutatedSource(`Object.freeze(${name});`, `void ${name};`);
    assert.match(
      validateTrackSchemaExports(mutated).join("\n"),
      new RegExp(`${name} must be frozen immediately after its declaration`),
    );
  }
});

test("freezing the wrong authority or freezing it too late fails closed", () => {
  const wrongTarget = mutatedSource(
    "Object.freeze(TRACK_REQUIRED_PROPERTIES);",
    "Object.freeze(TRACK_OPTIONAL_PROPERTIES);",
  );
  assert.match(
    validateTrackSchemaExports(wrongTarget).join("\n"),
    /TRACK_REQUIRED_PROPERTIES must be frozen immediately/,
  );

  const delayed = mutatedSource(
    "Object.freeze(TRACK_OPTIONAL_PROPERTIES);",
    "void 0;\nObject.freeze(TRACK_OPTIONAL_PROPERTIES);",
  );
  assert.match(
    validateTrackSchemaExports(delayed).join("\n"),
    /TRACK_OPTIONAL_PROPERTIES must be frozen immediately/,
  );
});

test("removing export from either identity helper fails closed", () => {
  for (const name of ["defineTrack", "defineTracks"]) {
    const mutated = mutatedSource(`export function ${name}`, `function ${name}`);
    assert.match(validateTrackSchemaExports(mutated).join("\n"), new RegExp(`${name} must remain exported`));
  }
});

test("defineTrack cannot mutate its input before returning it", () => {
  const mutated = mutatedSource(
    "  return track;\n}",
    "  Object.assign(track, { width: 1 });\n  return track;\n}",
  );
  assert.match(
    validateTrackSchemaExports(mutated).join("\n"),
    /defineTrack must remain the one-parameter identity helper/,
  );
});

test("neither identity helper may return a transformed value", () => {
  const mutations = [
    ["  return track;\n}", "  return { ...track, width: 1 } as T;\n}", "defineTrack"],
    ["  return tracks;\n}", "  return [...tracks].reverse() as unknown as T;\n}", "defineTracks"],
  ];
  for (const [before, after, name] of mutations) {
    const mutated = mutatedSource(before, after);
    assert.match(
      validateTrackSchemaExports(mutated).join("\n"),
      new RegExp(`${name} must return its exact input without transformation`),
    );
  }
});

test("identity-helper generic constraints cannot be weakened", () => {
  const mutations = [
    [
      "defineTrack<const T extends TrackDef>",
      "defineTrack<const T>",
      "defineTrack generic constraint must remain TrackDef",
    ],
    [
      "defineTracks<const T extends readonly TrackDef[]>",
      "defineTracks<const T extends readonly unknown[]>",
      "defineTracks generic constraint must remain readonly TrackDef[]",
    ],
  ];
  for (const [before, after, expected] of mutations) {
    const mutated = mutatedSource(before, after);
    assert.ok(validateTrackSchemaExports(mutated).includes(expected));
  }
});

test("identity-helper generic parameters must remain const and default-free", () => {
  const withoutConst = mutatedSource(
    "defineTrack<const T extends TrackDef>",
    "defineTrack<T extends TrackDef>",
  );
  assert.match(validateTrackSchemaExports(withoutConst).join("\n"), /defineTrack generic parameter must remain const/);

  const withDefault = mutatedSource(
    "defineTrack<const T extends TrackDef>",
    "defineTrack<const T extends TrackDef = TrackDef>",
  );
  assert.match(validateTrackSchemaExports(withDefault).join("\n"), /defineTrack generic parameter must not declare a default/);
});

test("identity-helper parameter and return types remain bound to their generic", () => {
  const mutations = [
    ["(track: T): T", "(track: TrackDef): TrackDef", "defineTrack"],
    ["(tracks: T): T", "(tracks: readonly TrackDef[]): readonly TrackDef[]", "defineTracks"],
  ];
  for (const [before, after, name] of mutations) {
    const mutated = mutatedSource(before, after);
    assert.match(
      validateTrackSchemaExports(mutated).join("\n"),
      new RegExp(`${name} parameter and return types must both remain the exact generic parameter`),
    );
  }
});
