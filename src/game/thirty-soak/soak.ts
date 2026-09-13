/** Canonical 30-minute soak lock (RSH-042). Smoke runs do not substitute. */

export const THIRTY_SOAK_GIS_CLAIM = false;
export const THIRTY_SOAK_OWNER_FREEZE = false;
export const THIRTY_SOAK_PUBLIC_DISTRIBUTION = false;
export const THIRTY_SOAK_DEFINED = true;
export const SOAK_ENFORCED = true;
export const SMOKE_SUBSTITUTES = false;
export const DEVICE_MATRIX_ENFORCED = false;
export const REAL_DEVICE_BASELINE_ACCEPTED = false;
export const SOAK_DURATION_S = 1800;
export const REQUIRED_CI_CYCLES = 2;
export const ENTER_EXIT_CYCLES = 20;
export const LIVE_SOAK = "scripts/soak-menu-race.mjs" as const;
export const LIVE_SOAK_SMOKE = "scripts/soak-smoke.mjs" as const;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";

export type SoakReport = {
  elapsedMs: number;
  smokeCycles: number;
  durationMet: boolean;
  smokeSubstitutes: boolean;
  acceptedAsThirtyMinute: boolean;
};

export function evaluateThirtySoak(elapsedMs: number, smokeCycles = REQUIRED_CI_CYCLES): SoakReport {
  const durationMet = elapsedMs >= SOAK_DURATION_S * 1000;
  return {
    elapsedMs,
    smokeCycles,
    durationMet,
    smokeSubstitutes: SMOKE_SUBSTITUTES,
    acceptedAsThirtyMinute: durationMet && !SMOKE_SUBSTITUTES && smokeCycles === REQUIRED_CI_CYCLES,
  };
}

export function canonicalSoakDigest(): string {
  return [
    "soak_duration_s=1800",
    "required_ci_cycles=2",
    "enter_exit_cycles=20",
    "smoke_substitutes=false",
    "soak_enforced=true",
    "device_matrix_enforced=false",
    "real_device_baseline=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}
