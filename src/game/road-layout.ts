import type { TrackDef } from "./types";

/** The loader and world geometry must select the same baked road kit. */
export function roadLaneCount(def: Pick<TrackDef, "id" | "theme">): 3 | 4 | 8 {
  if (def.id === "ayalon") return 8;
  if (["telaviv", "namal", "gushdan", "hw1", "hw2", "hw6"].includes(def.id) || def.theme === "highway") return 4;
  return 3;
}
