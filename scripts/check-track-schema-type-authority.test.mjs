import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateTrackDefTypeAuthority } from "./check-track-schema-type-authority.mjs";

function source() {
  return readFileSync(fromRoot("src", "game", "types.ts"), "utf8");
}

function mutate(before, after) {
  const original = source();
  assert.ok(original.includes(before), `missing mutation anchor: ${before}`);
  return original.replace(before, after);
}

test("the committed TrackDef field-type authority is exact", () => {
  assert.deepEqual(validateTrackDefTypeAuthority(source()), []);
});

test("TrackDef.id cannot broaden beyond TrackId", () => {
  assert.match(
    validateTrackDefTypeAuthority(mutate("  id: TrackId;", "  id: string;")).join("\n"),
    /TrackDef\.id type string differs from canonical TrackId/,
  );
});

test("TrackDef.city cannot broaden beyond CityId", () => {
  assert.match(
    validateTrackDefTypeAuthority(mutate("  city: CityId;", "  city: string;")).join("\n"),
    /TrackDef\.city type string differs from canonical CityId/,
  );
});

test("schema-backed geometry types cannot broaden", () => {
  assert.match(
    validateTrackDefTypeAuthority(mutate("  points: Vec2[];", "  points: unknown[];")).join("\n"),
    /TrackDef\.points type unknown\[\] differs from canonical Vec2\[\]/,
  );
});

test("optional field types and optionality are both enforced", () => {
  const changed = mutate("  open?: boolean;", "  open: boolean | null;");
  const errors = validateTrackDefTypeAuthority(changed).join("\n");
  assert.match(errors, /TrackDef\.open optionality/);
  assert.match(errors, /TrackDef\.open type boolean\|null differs from canonical boolean/);
});

test("unreviewed TrackDef properties fail closed", () => {
  const changed = mutate("  open?: boolean;", "  open?: boolean;\n  extra?: string;");
  const errors = validateTrackDefTypeAuthority(changed).join("\n");
  assert.match(errors, /property order and membership/);
  assert.match(errors, /unreviewed property extra/);
});
