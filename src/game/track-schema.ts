import type { TrackDef } from "./types";

/** Canonical required TrackDef keys, mirrored by TRACK-SCHEMA.json. */
export const TRACK_REQUIRED_PROPERTIES = [
  "id",
  "nameHe",
  "nameEn",
  "city",
  "cityHe",
  "cityEn",
  "lengthHint",
  "description",
  "descriptionEn",
  "image",
  "width",
  "points",
  "elevation",
  "sky",
  "ground",
  "sand",
  "streets",
  "pois",
  "checkpointCount",
  "seed",
  "theme",
] as const satisfies readonly (keyof TrackDef)[];

/** Canonical optional TrackDef keys, mirrored by TRACK-SCHEMA.json. */
export const TRACK_OPTIONAL_PROPERTIES = [
  "water",
  "waters",
  "clearZones",
  "open",
] as const satisfies readonly (keyof TrackDef)[];

/**
 * Preserve the exact inferred literal shape while requiring TrackDef compatibility.
 * RSH-014 uses this at each module boundary.
 */
export function defineTrack<const T extends TrackDef>(track: T): T {
  return track;
}

/** Preserve catalogue order while requiring every entry to satisfy TrackDef. */
export function defineTracks<const T extends readonly TrackDef[]>(tracks: T): T {
  return tracks;
}
