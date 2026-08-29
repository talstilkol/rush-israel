import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateTrackSchemaExports } from "./check-track-schema-exports.mjs";

function source() {
  return readFileSync(fromRoot("src", "game", "track-schema.ts"), "utf8");
}

test("both canonical TrackDef key authorities are exported const arrays", () => {
  assert.deepEqual(validateTrackSchemaExports(source()), []);
});

test("removing export from either key authority fails closed", () => {
  for (const name of ["TRACK_REQUIRED_PROPERTIES", "TRACK_OPTIONAL_PROPERTIES"]) {
    const mutated = source().replace(`export const ${name}`, `const ${name}`);
    assert.notEqual(mutated, source());
    assert.match(validateTrackSchemaExports(mutated).join("\n"), new RegExp(`${name} must remain exported`));
  }
});

test("changing either key authority from const fails closed", () => {
  for (const name of ["TRACK_REQUIRED_PROPERTIES", "TRACK_OPTIONAL_PROPERTIES"]) {
    const mutated = source().replace(`export const ${name}`, `export let ${name}`);
    assert.notEqual(mutated, source());
    assert.match(validateTrackSchemaExports(mutated).join("\n"), new RegExp(`${name} must remain a const authority`));
  }
});
