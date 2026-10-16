/** Historical RSH lock metadata; no current product/source freeze is granted. */
/** Canonical RSH-064 Establish preview, staging, production and rollback lock. Honest: no GIS, no public distribution, no real-device baseline. */
export const UNIT_ID = "RSH-064" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const PREVIEW_CHANNEL_DEFINED = true;
export const STAGING_CHANNEL_DEFINED = true;
export const PRODUCTION_CHANNEL_DEFINED = true;
export const ROLLBACK_PROCEDURE_LOCKED = false;

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
  return "preview_channel_defined=true\nstaging_channel_defined=true\nproduction_channel_defined=true\nrollback_procedure_locked=false\npublic_distribution=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

