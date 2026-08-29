import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateTrackDefImportAuthority } from "./check-track-schema-import-authority.mjs";

function source() {
  return readFileSync(fromRoot("src", "game", "track-schema.ts"), "utf8");
}

function mutate(before, after) {
  const original = source();
  assert.ok(original.includes(before), `missing mutation anchor: ${before}`);
  return original.replace(before, after);
}

test("TrackDef is bound to the exact canonical type-only import", () => {
  assert.deepEqual(validateTrackDefImportAuthority(source()), []);
});

test("an in-scope replacement type named TrackDef cannot impersonate the authority", () => {
  const changed = mutate(
    'import type { TrackDef } from "./types";',
    "type TrackDef = Record<string, unknown>;",
  );
  const errors = validateTrackDefImportAuthority(changed).join("\n");
  assert.match(errors, /type-only named import from \.\/types/);
  assert.match(errors, /must not declare or shadow/);
});

test("TrackDef cannot be imported from another module", () => {
  const changed = mutate('from "./types";', 'from "./other-types";');
  assert.match(
    validateTrackDefImportAuthority(changed).join("\n"),
    /type-only named import from \.\/types/,
  );
});

test("an aliased imported type cannot take the TrackDef authority name", () => {
  const changed = mutate(
    'import type { TrackDef } from "./types";',
    'import type { OtherTrack as TrackDef } from "./types";',
  );
  assert.match(
    validateTrackDefImportAuthority(changed).join("\n"),
    /canonical name/,
  );
});

test("TrackDef must remain a type-only import", () => {
  const changed = mutate("import type { TrackDef }", "import { TrackDef }");
  assert.match(
    validateTrackDefImportAuthority(changed).join("\n"),
    /type-only named import/,
  );
});

test("a second local TrackDef declaration fails closed", () => {
  const changed = `${source()}\ninterface TrackDef { id: string }\n`;
  assert.match(
    validateTrackDefImportAuthority(changed).join("\n"),
    /must not declare or shadow/,
  );
});
