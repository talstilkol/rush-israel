import assert from "node:assert/strict";
import { test } from "node:test";
import { validateTrackMutationGuard } from "./check-track-schema-mutation-guard.mjs";

const BASE = `
type TrackDef = { id: string; width: number; points: { x: number }[] };
export const TRACKS: TrackDef[] = [
  { id: "a", width: 20, points: [{ x: 1 }] },
  { id: "b", width: 21, points: [{ x: 2 }] },
];
export function getTrack(id: string) {
  const track = TRACKS.find((entry) => entry.id === id);
  if (!track) throw new Error(id);
  return track;
}
`;

function errors(extra) {
  return validateTrackMutationGuard(`${BASE}\n${extra}\n`).join("\n");
}

test("read-only TRACKS access remains valid", () => {
  assert.deepEqual(validateTrackMutationGuard(BASE), []);
});

test("direct post-declaration order mutation fails closed", () => {
  assert.match(errors("TRACKS.reverse();"), /mutating method reverse/);
});

test("direct nested data assignment fails closed", () => {
  assert.match(errors("TRACKS[0].width = 1;"), /assignment to TRACKS/);
});

test("nested collection mutation fails closed", () => {
  assert.match(errors("TRACKS[0].points.push({ x: 3 });"), /mutating method push/);
});

test("alias mutation fails closed", () => {
  assert.match(errors("const alias = TRACKS; alias.sort(() => 0);"), /mutating method sort/);
});

test("callback element mutation fails closed", () => {
  assert.match(
    errors("TRACKS.forEach((track) => { track.width = 1; });"),
    /assignment to TRACKS/,
  );
});

test("for-of element mutation fails closed", () => {
  assert.match(
    errors("for (const track of TRACKS) { track.width += 1; }"),
    /assignment to TRACKS/,
  );
});

test("local function mutation through an argument alias fails closed", () => {
  assert.match(
    errors("function mutate(tracks: TrackDef[]) { tracks.splice(0, 1); } mutate(TRACKS);"),
    /mutating method splice/,
  );
});

test("unreviewed external call with TRACKS fails closed", () => {
  assert.match(
    errors("declare function mutate(value: unknown): void; mutate(TRACKS);"),
    /unreviewed call mutate/,
  );
});

test("named callback element mutation fails closed", () => {
  assert.match(
    errors("function rewrite(track: TrackDef) { track.width = 1; } TRACKS.forEach(rewrite);"),
    /assignment to TRACKS/,
  );
});

test("unreviewed callback on a protected iteration fails closed", () => {
  assert.match(
    errors("declare function rewrite(track: TrackDef): void; TRACKS.forEach(rewrite);"),
    /unreviewed callback passed to protected method forEach/,
  );
});
