/** Canonical RSH-045 Hebrew RTL, English LTR and Arabic-scope lock. Honest: no GIS, no public distribution, no onboarding (RSH-046), document html lang stays Hebrew. */
export const UNIT_ID = "RSH-045" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const RTL_SCOPE_COMPLETE = true;
export const HEBREW_RTL = true;
export const ENGLISH_LTR = true;
export const ARABIC_IN_SCOPE = true;
export const ARABIC_COPY_COMPLETE = false;
export const ARABIC_FALLBACK_ENGLISH = true;
export const DEFAULT_LANG = "he" as const;
export const LANG_COUNT = 3;
export const LANGS = ["he", "ar", "en"] as const;
export const ONBOARDING_COMPLETE = false;
export const HTML_LANG_STATIC_HE = true;
export const DOCUMENT_LANG_SYNCED = false;

export type LockReport = { claimedArabicCopyComplete?: boolean; claimedOnboardingComplete?: boolean; claimedDocumentLangSynced?: boolean };

export function evaluateLock(report: LockReport = {}) {
  return {
    defined: LOCK_DEFINED,
    rtlScopeComplete: RTL_SCOPE_COMPLETE,
    hebrewRtl: HEBREW_RTL,
    englishLtr: ENGLISH_LTR,
    arabicInScope: ARABIC_IN_SCOPE,
    claimedArabicCopyComplete: Boolean(report.claimedArabicCopyComplete),
    acceptedAsArabicCopyComplete: false,
    claimedOnboardingComplete: Boolean(report.claimedOnboardingComplete),
    acceptedAsOnboardingComplete: false,
    claimedDocumentLangSynced: Boolean(report.claimedDocumentLangSynced),
    acceptedAsDocumentLangSynced: false,
    htmlLangStaticHe: HTML_LANG_STATIC_HE,
    publicDistribution: PUBLIC_DISTRIBUTION,
    gisClaim: GIS_CLAIM,
  };
}

export function canonicalDigest(): string {
  return [
    "rtl_scope_complete=true",
    "hebrew_rtl=true",
    "english_ltr=true",
    "arabic_in_scope=true",
    "arabic_copy_complete=false",
    "arabic_fallback_english=true",
    "default_lang=he",
    "lang_count=3",
    "onboarding_complete=false",
    "html_lang_static_he=true",
    "document_lang_synced=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}
