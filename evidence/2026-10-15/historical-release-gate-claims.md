# Historical claims from PR 83 at 6395474 — not accepted current evidence

## 8. Release gates

| # | Gate | Current state |
|---:|---|---|
| 1 | Visibility and licensing agree with owner policy | RED — repository is now **private**; 66 assets remain unverified |
| 2 | `main` is protected and PR delivery is enforced | GREEN — ruleset `rush-main-protection` (`23177340`) active |
| 3 | A clean clone installs and builds reproducibly | GREEN — required-ci runs toolchain, `npm ci` and `build:dev` on ubuntu-24.04 |
| 4 | Required CI is complete and green | GREEN — `required-ci / validate` is a required status check |
| 5 | Production contains no QA hook or secrets | GREEN — companion public-text secret scan in `npm test` |
| 6 | Ayalon is owner-approved and frozen | GREEN — freeze granted plus 6 direct builder-import pins |
| 7 | Driving, physics, ramps and damage pass | GREEN — drive/ramp/physics already in qa:ci; damage-smoke now in `npm test` |
| 8 | Desktop performance meets its budget | RED — P1-13 OPEN (no real-device p95) |
| 9 | Mobile performance meets its budget | RED — P1-13 OPEN |
| 10 | Soak, memory and context recovery pass | GREEN — 1800 s soak-30min now runs in `npm test`; P1-12 stays OPEN |
| 11 | Save and records are recoverable and valid | GREEN — RSH-021–RSH-023 checkers run in `npm test` |
| 12 | UX, input, languages, accessibility and legal checks pass | RED — 66 unverified assets; no WCAG AA |
| 13 | Signed release, artifacts and rollback proof exist | RED |

Current verified live result: **8/13** (gates 2, 3, 4, 5, 6, 7, 10 and 11). Frozen unit manifests still record `release_gates_green: 0`.
