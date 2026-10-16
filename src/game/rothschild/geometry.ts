/** Historical RSH lock metadata; no current product/source freeze is granted. */
/** Canonical RSH-049 Rothschild geometry and driving lock. Honest: no GIS, no public distribution, no real-device baseline. */
export const UNIT_ID = "RSH-049" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const TRACK_ID = "rothschild" as const;
export const GEOMETRY_LOCKED = false;
export const DRIVING_LOCKED = false;
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
  return "track_id=rothschild\ngeometry_locked=false\ndriving_locked=false\nart_golden_locked=false\ntrack_freeze_granted=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

