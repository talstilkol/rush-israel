import type { TrackDef } from "./types";

export const ROAD_EDGE_RAIL = { bottom: 0.22, top: 0.72, postHeight: 0.78, postCenterY: 0.4 } as const;
export const ROAD_EDGE_JERSEY = { bottom: 0.08, top: 1.35 } as const;

export function roadHasRail(def: Pick<TrackDef, "id" | "theme">) {
  return def.theme !== "desert" && def.theme !== "snow" && def.theme !== "carmel" && def.id !== "ayalon";
}

export function roadHasJersey(def: Pick<TrackDef, "id" | "theme">) {
  return def.theme !== "desert" && def.theme !== "snow" && def.id !== "rothschild" && def.theme !== "stone" && def.theme !== "jaffa" && def.theme !== "carmel";
}

/** Union of the edge structures actually rendered on this track. */
export function roadEdgeHeightRange(def: Pick<TrackDef, "id" | "theme">) {
  const ranges = [];
  if (roadHasRail(def)) ranges.push({ minY: ROAD_EDGE_RAIL.postCenterY - ROAD_EDGE_RAIL.postHeight / 2, maxY: ROAD_EDGE_RAIL.postCenterY + ROAD_EDGE_RAIL.postHeight / 2 });
  if (roadHasJersey(def)) ranges.push({ minY: ROAD_EDGE_JERSEY.bottom, maxY: ROAD_EDGE_JERSEY.top });
  if (!ranges.length) return;
  return { minY: Math.min(...ranges.map(range => range.minY)), maxY: Math.max(...ranges.map(range => range.maxY)) };
}

export const ROAD_UV_METRES = 6;
// The committed kit repeats its 48px paint cycle within a 512px image.
// A 96m image repeat preserves the existing approximately 4.4m / 9m dash rhythm.
export const ROAD_PAINT_REPEAT_METRES = 96;

/** The landscaped island is not a racing lane. Shared by geometry and driving. */
export function roadMedianHalfWidth(def: Pick<TrackDef, "id">): number {
  return def.id === "rothschild" ? 6.2 : 0;
}

export function roadLaneOffset(road: { width: number; medianHalfWidth?: number }, preferred: number): number {
  const median = road.medianHalfWidth ?? 0;
  if (!median) return preferred;
  const center = (median + road.width / 2) / 2;
  return preferred > 0 ? center : -center;
}

/** The loader and world geometry must select the same baked road kit. */
export function roadLaneCount(def: Pick<TrackDef, "id" | "theme">): 3 | 4 | 8 {
  if (def.id === "ayalon") return 8;
  if (["telaviv", "namal", "gushdan", "hw1", "hw2", "hw6"].includes(def.id) || def.theme === "highway") return 4;
  return 3;
}
