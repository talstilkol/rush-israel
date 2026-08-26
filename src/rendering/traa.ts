/**
 * Codex 77: three/tsl r185 has neither TRAANode nor traa.
 * addons/tsl/display/TRAANode.js exists but is WebGPU-only — not wired.
 * Photo AA = SMAA. Do not write TRAA by hand. No TAARenderPass.
 */
export const HAS_TRAA_NODE = false;
export const PHOTO_AA = "smaa" as const;
