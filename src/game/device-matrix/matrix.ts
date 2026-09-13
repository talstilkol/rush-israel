/** Canonical RSH-043 Validate the browser and device support matrix lock. Honest: no GIS, no public distribution, no real-device baseline. */
export const UNIT_ID = "RSH-043" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const DEVICE_MATRIX_ENFORCED = true;
export const REAL_DEVICE_BASELINE_ACCEPTED = false;
export const WEBGL2_REQUIRED = true;
export const WEBGPU_DEFAULT = false;
export const TARGET_BROWSER_COUNT = 6;
export const INPUT_MAPS_UNIFIED = false;
export const TARGET_BROWSERS = [
  { id: "chrome", surface: "desktop", min: "120", engine: "blink", webgl2: true, status: "target" },
  { id: "edge", surface: "desktop", min: "120", engine: "blink", webgl2: true, status: "target" },
  { id: "firefox", surface: "desktop", min: "121", engine: "gecko", webgl2: true, status: "target" },
  { id: "safari", surface: "desktop", min: "17.2", engine: "webkit", webgl2: true, status: "target" },
  { id: "chrome", surface: "android", min: "120", engine: "blink", webgl2: true, status: "target" },
  { id: "safari", surface: "ios", min: "17.2", engine: "webkit", webgl2: true, status: "target" },
] as const;

export type LockReport = { claimedVerified: boolean; webgl2?: boolean };

export function evaluateLock(report: LockReport = { claimedVerified: false }) {
  return {
    defined: LOCK_DEFINED,
    claimedVerified: report.claimedVerified,
    acceptedAsVerifiedDevice: false,
    publicDistribution: PUBLIC_DISTRIBUTION,
    gisClaim: GIS_CLAIM,
  };
}

export function canonicalDigest(): string {
  return "device_matrix_enforced=true\nreal_device_baseline_accepted=false\nwebgl2_required=true\nwebgpu_default=false\ntarget_browser_count=6\ninput_maps_unified=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

