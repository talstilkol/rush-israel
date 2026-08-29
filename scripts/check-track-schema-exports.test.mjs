import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateTrackSchemaExports } from "./check-track-schema-exports.mjs";

function source() {
  return readFileSync(fromRoot("src", "game", "track-schema.ts"), "utf8");
}

test("canonical key authorities and identity helpers are exported", () => {
  assert.deepEqual(validateTrackSchemaExports(source()), []);
});

test("removing export from either key authority fails closed", () => {
  for (const name of ["TRACK_REQUIRED_PROPERTIES", "TRACK_OPTIONAL_PROPERTIES"]) {
    const original = source();
    const mutated = original.replace(`export const ${name}`, `const ${name}`);
    assert.notEqual(mutated, original);
    assert.match(validateTrackSchemaExports(mutated).join("\n"), new RegExp(`${name} must remain exported`));
  }
});

test("changing either key authority from const fails closed", () => {
  for (const name of ["TRACK_REQUIRED_PROPERTIES", "TRACK_OPTIONAL_PROPERTIES"]) {
    const original = source();
    const mutated = original.replace(`export const ${name}`, `export let ${name}`);
    assert.notEqual(mutated, original);
    assert.match(validateTrackSchemaExports(mutated).join("\n"), new RegExp(`${name} must remain a const authority`));
  }
});

test("removing export from either identity helper fails closed", () => {
  for (const name of ["defineTrack", "defineTracks"]) {
    const original = source();
    const mutated = original.replace(`export function ${name}`, `function ${name}`);
    assert.notEqual(mutated, original);
    assert.match(validateTrackSchemaExports(mutated).join("\n"), new RegExp(`${name} must remain exported`));
  }
});

test("defineTrack cannot mutate its input before returning it", () => {
  const original = source();
  const mutated = original.replace(
    "  return track;\n}",
    "  Object.assign(track, { width: 1 });\n  return track;\n}",
  );
  assert.notEqual(mutated, original);
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
    const original = source();
    const mutated = original.replace(before, after);
    assert.notEqual(mutated, original);
    assert.match(
      validateTrackSchemaExports(mutated).join("\n"),
      new RegExp(`${name} must return its exact input without transformation`),
    );
  }
});
