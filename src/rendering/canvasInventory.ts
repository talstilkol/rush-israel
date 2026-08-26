/** Honest remaining runtime CanvasTexture sites. Probe canvas is allowed. NYC textures are DataTexture. */
export const CANVAS_TEXTURE_SITES = [
  { file: "src/rendering/CapabilityProbe.ts", kind: "webgl2 probe", status: "allowed" as const },
] as const;