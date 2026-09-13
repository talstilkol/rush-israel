/** Canonical RSH-047 PWA, offline, update and manifest lock. Honest: dynamic __grok manifest, standalone display, no service worker, no offline cache, no update prompt, no public install. */
export const UNIT_ID = "RSH-047" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const PWA_COMPLETE = true;
export const MANIFEST_PRESENT = true;
export const MANIFEST_PATH = "/__grok/manifest.webmanifest" as const;
export const DISPLAY_STANDALONE = true;
export const START_URL = "/" as const;
export const SERVICE_WORKER = false;
export const OFFLINE_CACHE = false;
export const UPDATE_PROMPT = false;
export const PUBLIC_INSTALL = false;
export const A11Y_COMPLETE = false;

export type LockReport = { claimedServiceWorker?: boolean; claimedOfflineCache?: boolean; claimedA11yComplete?: boolean };

export function evaluateLock(report: LockReport = {}) {
  return {
    defined: LOCK_DEFINED,
    pwaComplete: PWA_COMPLETE,
    manifestPresent: MANIFEST_PRESENT,
    displayStandalone: DISPLAY_STANDALONE,
    claimedServiceWorker: Boolean(report.claimedServiceWorker),
    acceptedAsServiceWorker: false,
    claimedOfflineCache: Boolean(report.claimedOfflineCache),
    acceptedAsOfflineCache: false,
    claimedA11yComplete: Boolean(report.claimedA11yComplete),
    acceptedAsA11yComplete: false,
    publicDistribution: PUBLIC_DISTRIBUTION,
    gisClaim: GIS_CLAIM,
  };
}

export function canonicalDigest(): string {
  return [
    "pwa_complete=true",
    "manifest_present=true",
    "manifest_path=/__grok/manifest.webmanifest",
    "display_standalone=true",
    "start_url=/",
    "service_worker=false",
    "offline_cache=false",
    "update_prompt=false",
    "public_install=false",
    "a11y_complete=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}
