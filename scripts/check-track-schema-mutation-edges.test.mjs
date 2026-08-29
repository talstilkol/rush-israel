import assert from "node:assert/strict";
import { test } from "node:test";
import { validateTrackMutationEdges } from "./check-track-schema-mutation-edges.mjs";

const BASE = `
type TrackDef = { id: string; width: number };
const TRACKS: TrackDef[] = [{ id: "a", width: 20 }];
const selected = TRACKS[0];
`;

function errors(extra) {
  return validateTrackMutationEdges(`${BASE}\n${extra}\n`).join("\n");
}

test("ordinary read-only access and unrelated constructors remain valid", () => {
  assert.deepEqual(
    validateTrackMutationEdges(`${BASE}\nconst message = new Error("missing");`),
    [],
  );
});

test("array destructuring assignment fails closed", () => {
  assert.match(
    errors("let track: TrackDef; [track] = TRACKS; track.width = 1;"),
    /destructuring assignment/,
  );
});

test("object destructuring assignment fails closed", () => {
  assert.match(
    errors("let track: TrackDef; ({ 0: track } = TRACKS); track.width = 1;"),
    /destructuring assignment/,
  );
});

test("destructuring through an alias fails closed", () => {
  assert.match(
    errors("const alias = TRACKS; let track: TrackDef; [track] = alias;"),
    /destructuring assignment/,
  );
});

test("property retention of a protected reference fails closed", () => {
  assert.match(
    errors("const holder: { track?: TrackDef } = {}; holder.track = selected;"),
    /property assignment/,
  );
});

test("constructor use of a protected reference fails closed", () => {
  assert.match(
    errors("class Mutator { constructor(track: TrackDef) { track.width = 1; } } new Mutator(selected);"),
    /constructor receives/,
  );
});

test("constructor use through an alias fails closed", () => {
  assert.match(
    errors("const alias = selected; class Holder { constructor(track: TrackDef) {} } new Holder(alias);"),
    /constructor receives/,
  );
});
