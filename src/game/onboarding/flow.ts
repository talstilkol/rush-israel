/** Canonical RSH-046 onboarding, settings, error and recovery lock. Honest: title-boot, settings panel and save-recovery UX; no first-run wizard; no PWA (RSH-047). */
export const UNIT_ID = "RSH-046" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const ONBOARDING_COMPLETE = true;
export const TITLE_BOOT = true;
export const SETTINGS_PANEL = true;
export const SAVE_RECOVERY_UX = true;
export const FIRST_RUN_WIZARD = false;
export const BOOT_SCREEN = "title" as const;
export const PWA_COMPLETE = false;
export const A11Y_COMPLETE = false;

export type LockReport = { claimedFirstRunWizard?: boolean; claimedPwaComplete?: boolean; claimedA11yComplete?: boolean };

export function evaluateLock(report: LockReport = {}) {
  return {
    defined: LOCK_DEFINED,
    onboardingComplete: ONBOARDING_COMPLETE,
    titleBoot: TITLE_BOOT,
    settingsPanel: SETTINGS_PANEL,
    saveRecoveryUx: SAVE_RECOVERY_UX,
    claimedFirstRunWizard: Boolean(report.claimedFirstRunWizard),
    acceptedAsFirstRunWizard: false,
    claimedPwaComplete: Boolean(report.claimedPwaComplete),
    acceptedAsPwaComplete: false,
    claimedA11yComplete: Boolean(report.claimedA11yComplete),
    acceptedAsA11yComplete: false,
    publicDistribution: PUBLIC_DISTRIBUTION,
    gisClaim: GIS_CLAIM,
  };
}

export function canonicalDigest(): string {
  return [
    "onboarding_complete=true",
    "title_boot=true",
    "settings_panel=true",
    "save_recovery_ux=true",
    "first_run_wizard=false",
    "boot_screen=title",
    "pwa_complete=false",
    "a11y_complete=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}
