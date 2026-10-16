/** Canonical RSH-066 Produce RC1 and close all blocking defects lock. Honest: no GIS, no public distribution, no real-device baseline. */
export const UNIT_ID = "RSH-066" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const RC1_PRODUCED = false;
export const BLOCKING_OWNER_SETTINGS_OPEN = true;
export const UNVERIFIED_ASSETS = 66;
export const V1_PUBLISHED = false;

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
  return "rc1_produced=false\nblocking_owner_settings_open=true\nunverified_assets=66\npublic_distribution=false\nv1_published=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

