/** Historical RSH lock metadata; no current product/source freeze is granted. */
/** Canonical RSH-067 Publish v1.0.0 with signed tag, dossier and rollback proof lock. Honest: no GIS, no public distribution, no real-device baseline. */
export const UNIT_ID = "RSH-067" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const V1_IDENTITY = "1.0.0-private" as const;
export const DOSSIER_LOCKED = false;
export const ROLLBACK_PROOF_LOCKED = false;
export const SIGNED_TAG_CREATED = false;

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
  return "v1_identity=1.0.0-private\ndossier_locked=false\nrollback_proof_locked=false\nsigned_tag_created=false\npublic_distribution=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

