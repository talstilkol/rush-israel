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
