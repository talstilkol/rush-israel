/** Honest remaining runtime canvas sites. Texture canvases must be zero. */
export const CANVAS_TEXTURE_SITES = [
  { file: "src/rendering/CapabilityProbe.ts", kind: "webgl2 probe", status: "allowed" as const },
  { file: "src/rendering/RendererFacade.ts", kind: "webgpu probe dummy", status: "allowed" as const },
] as const;