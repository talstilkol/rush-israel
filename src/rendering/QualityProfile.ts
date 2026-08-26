/** G0-06: quality schema. Photo mode raises pixel ratio; not a cinematic renderer. */
export const PROFILE_VERSION = 1;

export type ProfileId = "compat" | "balanced" | "high" | "ultra" | "photo";

export type QualityProfile = {
  version: number;
  id: ProfileId;
  pixelScale: number;
  shadows: 0 | 1 | 2 | 3 | 4;
  composer: boolean;
  bloom: boolean;
  planar: boolean;
  targetFps: 30 | 60;
};

export const PROFILES: Record<ProfileId, QualityProfile> = {
  compat: { version: PROFILE_VERSION, id: "compat", pixelScale: 1, shadows: 0, composer: false, bloom: false, planar: false, targetFps: 30 },
  balanced: { version: PROFILE_VERSION, id: "balanced", pixelScale: 0.75, shadows: 1, composer: true, bloom: false, planar: false, targetFps: 60 },
  high: { version: PROFILE_VERSION, id: "high", pixelScale: 0.85, shadows: 1, composer: true, bloom: true, planar: true, targetFps: 60 },
  ultra: { version: PROFILE_VERSION, id: "ultra", pixelScale: 1, shadows: 1, composer: true, bloom: true, planar: true, targetFps: 60 },
  photo: { version: PROFILE_VERSION, id: "photo", pixelScale: 1, shadows: 1, composer: true, bloom: true, planar: true, targetFps: 30 },
};

export function profileFromLegacy(q: "low" | "mid" | "high"): QualityProfile {
  if (q === "low") return PROFILES.compat;
  if (q === "mid") return PROFILES.balanced;
  return PROFILES.high;
}
