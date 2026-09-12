/** Canonical quality-profile and hysteresis lock (RSH-038). */

export const QUALITY_PROFILES_GIS_CLAIM = false;
export const QUALITY_PROFILES_OWNER_FREEZE = false;
export const QUALITY_PROFILES_PUBLIC_DISTRIBUTION = false;
export const QUALITY_PROFILES_DEFINED = true;
export const BUDGETS_ENFORCED = false;
export const REAL_DEVICE_BASELINE_ACCEPTED = false;
export const PROFILE_VERSION = 1;
export const QUALITY_PROFILE_IDS = ["compat", "balanced", "high", "ultra", "photo"] as const;
export const LEGACY_QUALITY_MAP = { low: "compat", mid: "balanced", high: "high" } as const;
export const DROP_P95_MS = 20;
export const DROP_FRAMES = 90;
export const RAISE_P95_MS = 16;
export const RAISE_HOLD_S = 5;
export const MAX_STEP = 8;
export const DROP_ORDER = ["planar", "bloom", "csm", "pixelExtra"] as const;
export const LIVE_PROFILE_MODULE = "src/rendering/QualityProfile.ts" as const;
export const LIVE_HYSTERESIS_MODULE = "src/rendering/DynamicQualityController.ts" as const;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";

export type LockedProfileId = (typeof QUALITY_PROFILE_IDS)[number];

export type LockedQualityProfile = {
  version: number;
  id: LockedProfileId;
  pixelScale: number;
  shadows: 0 | 1 | 2 | 3 | 4;
  composer: boolean;
  bloom: boolean;
  planar: boolean;
  targetFps: 30 | 60;
};

export const LOCKED_PROFILES: Record<LockedProfileId, LockedQualityProfile> = {
  compat: { version: PROFILE_VERSION, id: "compat", pixelScale: 1, shadows: 0, composer: false, bloom: false, planar: false, targetFps: 30 },
  balanced: { version: PROFILE_VERSION, id: "balanced", pixelScale: 0.75, shadows: 1, composer: true, bloom: false, planar: false, targetFps: 60 },
  high: { version: PROFILE_VERSION, id: "high", pixelScale: 0.85, shadows: 1, composer: true, bloom: true, planar: true, targetFps: 60 },
  ultra: { version: PROFILE_VERSION, id: "ultra", pixelScale: 1, shadows: 1, composer: true, bloom: true, planar: true, targetFps: 60 },
  photo: { version: PROFILE_VERSION, id: "photo", pixelScale: 1, shadows: 1, composer: true, bloom: true, planar: true, targetFps: 30 },
};

export function profileFromLegacy(q: "low" | "mid" | "high"): LockedQualityProfile {
  if (q === "low") return LOCKED_PROFILES.compat;
  if (q === "mid") return LOCKED_PROFILES.balanced;
  return LOCKED_PROFILES.high;
}

export function canonicalQualityDigest(): string {
  return [
    "profiles=compat,balanced,high,ultra,photo",
    "legacy=low:compat,mid:balanced,high:high",
    "drop_p95_ms=20",
    "drop_frames=90",
    "raise_p95_ms=16",
    "raise_hold_s=5",
    "max_step=8",
    "drop_order=planar,bloom,csm,pixelExtra",
    "budgets_enforced=false",
    "real_device_baseline=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}
