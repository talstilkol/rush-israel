# RUSH Israel — Architecture Decision Register

Private owner-controlled record. This is not a public ADR site and does not
authorise public distribution.

| ID | Date | Decision | Status |
|---|---|---|---|
| ADR-001 | 2026-09-03 | Version 1 is a private Three.js WebGL simcade on fictional routes inspired by Israeli places. GIS/navigation accuracy is forbidden. | accepted |
| ADR-002 | 2026-09-03 | Public distribution, GitHub Release and native-store shipping are not authorised until an explicit later owner decision. | accepted |
| ADR-003 | 2026-09-13 | Repository visibility is **private**. | accepted |
| ADR-004 | 2026-09-13 | `main` is protected by ruleset `rush-main-protection` (`23177340`). Required check is `required-ci / validate`. Force-push and branch deletion are blocked. Merge method is merge-commit only. | accepted |
| ADR-005 | 2026-09-13 | `CURRENT-STATE.json` remains the RSH-067 merge snapshot. Live GitHub settings are recorded in `LIVE-GITHUB-STATUS.json` so frozen program-control tests keep their exact expected bytes. | accepted |
| ADR-006 | 2026-09-13 | Post-v1 findings that accepted units already remediated are closed in `FINDINGS-REGISTER.md` without rewriting frozen unit manifests. P1-12, P1-13 and P2-09 stay OPEN because unit checkers require those tokens until soak-in-CI, a real-device baseline and a production JS/asset byte-size check exist. | accepted |
| ADR-007 | 2026-09-16 | Remaining eleven release gates stay RED in `LIVE-GITHUB-STATUS.json` even when accepted units already produced product locks. Unit acceptance is not release readiness. Gate 4 evidence is the latest successful `required-ci / validate` on `main` after PR #74. | superseded by ADR-008 |
| ADR-008 | 2026-09-16 | Live gates 3 and 11 are GREEN because required CI actually clones/installs/builds and save/records checkers run in `npm test`. Gates 5 and 6 stay RED: secret scan excludes `public/`, and the Ayalon freeze inventory is not a complete builder-dependency closure. Frozen manifests stay 0/13. | superseded by ADR-009 |
| ADR-009 | 2026-09-16 | Gate 5 is GREEN via companion `scripts/check-public-secrets.mjs` (hashed `secrets-check.mjs` unchanged). Gate 6 is GREEN via companion `scripts/check-ayalon-builder-deps.mjs` pinning 6 direct Ayalon builder imports (36-hash freeze unchanged). Frozen manifests stay 0/13. | accepted |
