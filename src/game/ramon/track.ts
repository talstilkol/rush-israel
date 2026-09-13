/** Canonical RSH-059 Ramon geometry and driving lock. Honest: no GIS, no public distribution, no real-device baseline. */
export const UNIT_ID = "RSH-059" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const TRACK_ID = "ramon" as const;
export const GEOMETRY_LOCKED = true;
export const DRIVING_LOCKED = true;
export const ART_GOLDEN_LOCKED = false;
export const TRACK_FREEZE_GRANTED = false;

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
  return "track_id=ramon\ngeometry_locked=true\ndriving_locked=true\nart_golden_locked=false\ntrack_freeze_granted=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

