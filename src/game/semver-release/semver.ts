/** Canonical RSH-063 Establish SemVer, changelog and release automation lock. Honest: no GIS, no public distribution, no real-device baseline. */
export const UNIT_ID = "RSH-063" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const SEMVER_LOCKED = true;
export const CHANGELOG_LOCKED = true;
export const PACKAGE_JSON_FROZEN = true;
export const GITHUB_RELEASE_CREATED = false;

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
  return "semver_locked=true\nchangelog_locked=true\npackage_json_frozen=true\npublic_distribution=false\ngithub_release_created=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

