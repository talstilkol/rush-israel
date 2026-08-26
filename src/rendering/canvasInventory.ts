/** Honest remaining runtime CanvasTexture sites. Probe canvas is allowed. */
export const CANVAS_TEXTURE_SITES = [
  { file: "src/game/nyc-canvas.ts", kind: "NYC facade/ads", status: "runtime" as const },
  { file: "src/rendering/CapabilityProbe.ts", kind: "webgl2 probe", status: "allowed" as const },
] as const;