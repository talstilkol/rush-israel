/** Canonical RSH-065 Publish and evaluate v0.1.0-alpha.1 lock. Honest: no GIS, no public distribution, no real-device baseline. */
export const UNIT_ID = "RSH-065" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const PRIVATE_ALPHA_IDENTITY = "0.1.0-alpha.1" as const;
export const GITHUB_RELEASE_CREATED = false;
export const OWNER_VISIBILITY_PRIVATE = false;
export const RC1_PRODUCED = false;

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
  return "private_alpha_identity=0.1.0-alpha.1\ngithub_release_created=false\npublic_distribution=false\nowner_visibility_private=false\nrc1_produced=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

