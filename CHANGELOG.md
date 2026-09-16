# Changelog

Private owner-controlled record. This is **not** a GitHub Release and does **not**
authorise public distribution.

## 1.0.0-private — 2026-09-13

Locked by RSH-067. Signed Git tag and GitHub Release were **not** created.

- Identity: `1.0.0-private`
- Dossier and rollback proof: locked in `src/game/v1-publish/`
- Public distribution: forbidden
- GIS / navigation claims: forbidden

## 0.1.0-alpha.1-private — 2026-09-13

Locked by RSH-065. No GitHub Release.

## Program units RSH-001 – RSH-067

All 67 master-plan units are accepted on `main`. Queue head is empty
(`program_complete`). Frozen product sources (tracks, physics, cars, HUD,
Ayalon freeze) were not rewritten by later lock units.

| Stage | Units | Result |
|---|---|---|
| G0 Control | RSH-001–003 | accepted |
| G1 Toolchain / CI | RSH-004–008 | accepted; live `main` now protected |
| G2 Scope / assets | RSH-009–012 | accepted; 66 unverified assets remain |
| G3 Architecture | RSH-013–020 | accepted |
| G4 Save / security | RSH-021–024 | accepted; save schema v3 |
| G5 Ayalon slice | RSH-025–036 | accepted; freeze granted, 36 hashes |
| G6 Perf / reliability | RSH-037–043 | accepted; long soak not in required CI |
| G7 UX / a11y | RSH-044–048 | accepted; no WCAG AA |
| G8 Seven MVP tracks | RSH-049–062 | accepted as honest locks |
| G9 Release | RSH-063–067 | accepted as private identities |

## Owner settings applied 2026-09-13 (after program complete)

Live GitHub, not a new RSH unit:

- Repository visibility: **private**
- Ruleset `rush-main-protection` (`23177340`): **active** on `main`
- Required check: `required-ci / validate`
- Force-push and branch deletion: blocked

## Post-v1 findings pass 2026-09-13 (after PR #73)

Not a new RSH unit. Frozen product sources, `package.json` and
`.github/workflows/required-ci.yml` unchanged. `CURRENT-STATE.json` stays the
RSH-067 snapshot.

- P0-10 **CLOSED** — G5 Ayalon vertical slice is accepted
- P1-16 **CLOSED** — all eight Version 1 tracks have accepted golden/freeze units
- P2-04 **MITIGATED** — live ruleset requires PRs; historical direct-main remains
- P1-12, P1-13, P2-03, P2-09 stay **OPEN**
- P1-17 stays **MITIGATED** (pixel-golden still outside required CI)

Still not done: signed tag, GitHub Release, real-device p95, 30-minute soak in
required CI, production JS/asset byte-size gate, clearance of 66 unverified assets,
commit-signing enforcement.
