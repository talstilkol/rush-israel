/** G0-07: runtime CanvasTexture sites. Replacement: authored KTX2. None replaced yet. */
export const CANVAS_TEXTURE_SITES = [
  { file: "src/game/world.ts", kind: "curtain/sky/signs/asphalt", status: "runtime" as const },
  { file: "public/game/asphalt-8.png", kind: "ayalon albedo baked procedural", status: "baked" as const },
  { file: "src/game/car-mesh.ts", kind: "flake/beam", status: "runtime" as const },
  { file: "src/game/engine.ts", kind: "env/lens", status: "runtime" as const },
  { file: "src/game/nyc-landmarks.ts", kind: "billboard", status: "runtime" as const },
] as const;
