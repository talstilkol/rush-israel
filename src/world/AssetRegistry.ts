/** G0-08: provenance. Missing license = unknown. Blocks a real publish. */
export type Provenance = {
  id: string;
  owner: string;
  source: string;
  license: "unknown" | "owned" | "licensed";
};

export const ASSET_PROVENANCE: Provenance[] = [
  { id: "procedural-world", owner: "rush", source: "src/game/world.ts", license: "unknown" },
  { id: "procedural-car", owner: "rush", source: "src/game/car-mesh.ts", license: "unknown" },
  { id: "canvas-asphalt", owner: "rush", source: "runtime canvas", license: "unknown" },
  { id: "canvas-sky", owner: "rush", source: "runtime canvas", license: "unknown" },
  { id: "track-splines", owner: "rush", source: "src/game/tracks.ts lat/lon hand-placed", license: "unknown" },
];

export function unpublishedAssets() {
  return ASSET_PROVENANCE.filter((a) => a.license === "unknown");
}
