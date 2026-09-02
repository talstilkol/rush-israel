/** RSH-024 production-security policy. Runtime adapters stay on their accepted hashes. */
export const BUILD_COMMAND = "vite build" as const;
export const PRODUCTION_QA_NEEDLES = ["finishNow", "__controlsTest"] as const;
export const SECRET_SCAN_ROOTS = ["src", "scripts", "server", ".github"] as const;
export const QA_ADAPTER_PRODUCTION_GUARD =
  'if (import.meta.env.PROD && import.meta.env.VITE_QA !== "1") return;' as const;
export const FORBIDDEN_PACKAGE_SCRIPTS = ["db:migrate", "check:auth"] as const;
export const REQUIRED_QA_GATE_SCRIPTS = ["check:qa", "check:secrets"] as const;
