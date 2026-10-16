/** Historical RSH lock metadata; no current product/source freeze is granted. */
/** Canonical RSH-062 Hermon art, golden and freeze lock. Honest: no GIS, no public distribution, no real-device baseline. */
export const UNIT_ID = "RSH-062" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const TRACK_ID = "hermon" as const;
export const ART_GOLDEN_LOCKED = false;
export const TRACK_SOURCE_FREEZE = false;
export const AYALON_FREEZE_GRANTED = false;
export const OWNER_SETTINGS_FREEZE = false;

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
  return "track_id=hermon\nart_golden_locked=false\ntrack_source_freeze=false\nayalon_freeze_granted=false\nowner_settings_freeze=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

