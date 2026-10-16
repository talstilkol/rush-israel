/** Canonical RSH-048 accessibility, privacy and Alpha UX lock. Honest: live aria controls, live regions and reduced-motion; no WCAG AA, no canvas a11y, no telemetry, no crash reporting, no public privacy policy; Alpha remains private. */
export const UNIT_ID = "RSH-048" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const A11Y_COMPLETE = false;
export const ARIA_CONTROLS = true;
export const LIVE_REGIONS = true;
export const REDUCED_MOTION = true;
export const WCAG_AA = false;
export const CANVAS_A11Y = false;
export const PRIVACY_POLICY = false;
export const TELEMETRY = false;
export const CRASH_REPORTING = false;
export const ALPHA_UX_PRIVATE = true;
export const ROTHSCHILD_GEOMETRY = false;

export type LockReport = { claimedWcagAa?: boolean; claimedCanvasA11y?: boolean; claimedTelemetry?: boolean; claimedRothschild?: boolean };

export function evaluateLock(report: LockReport = {}) {
  return {
    defined: LOCK_DEFINED,
    a11yComplete: A11Y_COMPLETE,
    ariaControls: ARIA_CONTROLS,
    liveRegions: LIVE_REGIONS,
    reducedMotion: REDUCED_MOTION,
    claimedWcagAa: Boolean(report.claimedWcagAa),
    acceptedAsWcagAa: false,
    claimedCanvasA11y: Boolean(report.claimedCanvasA11y),
    acceptedAsCanvasA11y: false,
    claimedTelemetry: Boolean(report.claimedTelemetry),
    acceptedAsTelemetry: false,
    claimedRothschild: Boolean(report.claimedRothschild),
    acceptedAsRothschildGeometry: false,
    privacyPolicy: PRIVACY_POLICY,
    telemetry: TELEMETRY,
    crashReporting: CRASH_REPORTING,
    alphaUxPrivate: ALPHA_UX_PRIVATE,
    publicDistribution: PUBLIC_DISTRIBUTION,
    gisClaim: GIS_CLAIM,
  };
}

export function prefersReducedMotion() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function canonicalDigest(): string {
  return [
    "a11y_complete=false",
    "aria_controls=true",
    "live_regions=true",
    "reduced_motion=true",
    "wcag_aa=false",
    "canvas_a11y=false",
    "privacy_policy=false",
    "telemetry=false",
    "crash_reporting=false",
    "alpha_ux_private=true",
    "rothschild_geometry=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}
