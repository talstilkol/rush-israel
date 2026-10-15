import type { TrackDef } from "./types";

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
