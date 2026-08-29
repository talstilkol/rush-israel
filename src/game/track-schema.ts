import type { TrackDef } from "./types";

type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;
type ExactUnion<Actual, Expected> =
  [Actual] extends [Expected]
    ? [Expected] extends [Actual]
      ? true
      : false
    : false;
type UniqueTuple<
  T extends readonly PropertyKey[],
  Seen extends PropertyKey = never,
> = T extends readonly [infer Head extends PropertyKey, ...infer Tail extends readonly PropertyKey[]]
  ? Head extends Seen
    ? false
    : UniqueTuple<Tail, Seen | Head>
  : true;
type Assert<T extends true> = T;

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
Object.freeze(TRACK_REQUIRED_PROPERTIES);

/** Canonical optional TrackDef keys, mirrored by TRACK-SCHEMA.json. */
export const TRACK_OPTIONAL_PROPERTIES = [
  "water",
  "waters",
  "clearZones",
  "open",
] as const satisfies readonly (keyof TrackDef)[];
Object.freeze(TRACK_OPTIONAL_PROPERTIES);

export type TrackRequiredPropertiesAreExact = Assert<
  ExactUnion<(typeof TRACK_REQUIRED_PROPERTIES)[number], RequiredKeys<TrackDef>>
>;
export type TrackOptionalPropertiesAreExact = Assert<
  ExactUnion<(typeof TRACK_OPTIONAL_PROPERTIES)[number], OptionalKeys<TrackDef>>
>;
export type TrackRequiredPropertiesAreUnique = Assert<
  UniqueTuple<typeof TRACK_REQUIRED_PROPERTIES>
>;
export type TrackOptionalPropertiesAreUnique = Assert<
  UniqueTuple<typeof TRACK_OPTIONAL_PROPERTIES>
>;

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
