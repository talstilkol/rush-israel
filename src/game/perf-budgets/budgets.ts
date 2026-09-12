/** Canonical bundle, streaming and cache budget lock (RSH-039). */

export const PERF_BUDGETS_GIS_CLAIM = false;
export const PERF_BUDGETS_OWNER_FREEZE = false;
export const PERF_BUDGETS_PUBLIC_DISTRIBUTION = false;
export const BUDGETS_DEFINED = true;
export const LEAK_CYCLES_ENFORCED = false;
export const REAL_DEVICE_BASELINE_ACCEPTED = false;
export const CACHE_PATHS = ["/game/", "/basis/"] as const;
export const CACHE_CONTROL = "public, max-age=31536000, immutable" as const;
export const CACHE_MAX_AGE_S = 31536000;
export const HTML_CACHE_CONTROL = "no-cache" as const;
export const ASSET_STREAMING_GLTF = false;
export const MESH_STREAMING = false;
export const STREAMING_MUSIC = false;
export const DRAW_CALL_TARGET = 80;
export const PRODUCTION_FINISHNOW_FORBIDDEN = true;
export const LIVE_CACHE_MODULE = "server/middleware/game-cache.ts" as const;
export const LIVE_CACHE_SMOKE = "scripts/cache-headers-smoke.mjs" as const;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";

export function canonicalBudgetDigest(): string {
  return [
    "cache_paths=/game/,/basis/",
    "cache_control=public, max-age=31536000, immutable",
    "html_cache_control=no-cache",
    "asset_streaming_gltf=false",
    "mesh_streaming=false",
    "streaming_music=false",
    "draw_call_target=80",
    "production_finishnow_forbidden=true",
    "leak_cycles_enforced=false",
    "real_device_baseline=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}
