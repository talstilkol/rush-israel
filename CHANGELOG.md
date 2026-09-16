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

## Post-merge CI after PR #74 — 2026-09-16

Not a new RSH unit. Operating-rule-6 reconciliation of PR #74 merge evidence.

- Merge SHA: `d6da3aa43bfb19a4be8e673b9a28dcf6df7fdafb`
- Validated head: `d803a992db238ef8400b38b30124993f99276023`
- Post-merge `required-ci / validate`: run `35089028213` **success**
- Live release gates stay **2/13** (gates 2 and 4 GREEN)
- Remaining eleven gates recorded as RED with live blockers
- Frozen product sources, `package.json`, `required-ci.yml` and `CURRENT-STATE.json` unchanged

## Live gates 3 and 11 — 2026-09-16 (after PR #75)

Not a new RSH unit. Owner instruction to finish the master plan authorises
recording live GREEN where the gate text already matches accepted CI.
Frozen unit manifests stay `release_gates_green: 0`.

- PR #75 merge SHA: `2cfd6616cb0affcb687611aaa9b15ae33fa8fc32`
- Post-merge `required-ci / validate`: run `35090558345` **success**
- Gate 3 **GREEN** — clean clone `npm ci` + toolchain + `build:dev` on ubuntu-24.04
- Gate 11 **GREEN** — save schema v3 and timed-records checkers run in `npm test`
- Gates 5 and 6 stay **RED** — secret scan excludes `public/`; Ayalon freeze inventory is not a complete dependency closure
- Live release gates **4/13**
- P1-12, P1-13, P2-03, P2-09 stay **OPEN**
- Frozen product sources, `package.json`, `required-ci.yml` and `CURRENT-STATE.json` unchanged

## Live gates 5 and 6 — 2026-09-16 (after PR #76)

Not a new RSH unit. Companion checkers close the Codex gaps without rewriting
hashed RSH-024 / RSH-036 identities.

- PR #76 merge SHA: `2c248783c72433b101b90c299a5a1f8ecbb1fefa`
- Post-merge `required-ci / validate`: run `35092771176` **success**
- Gate 5 **GREEN** — `scripts/check-public-secrets.mjs` scans 8 shipped public text/SVG files in `npm test` (frozen `secrets-check.mjs` still excludes `public/`)
- Gate 6 **GREEN** — `scripts/check-ayalon-builder-deps.mjs` pins the 6 direct Ayalon builder imports (36-hash freeze inventory unchanged)
- Live release gates **6/13**
- P1-12, P1-13, P2-03, P2-09 stay **OPEN**
- Frozen product sources, `package.json`, `required-ci.yml` and `CURRENT-STATE.json` unchanged

## Live gate 7 — 2026-09-16 (after PR #77)

Not a new RSH unit. Companion `scripts/check-damage-required.test.mjs` runs
accepted `damage-smoke.mjs` inside `npm test`. Hashed `qa:ci:raw` is unchanged.

- PR #77 merge SHA: `5914600cd6e5f66f79b18cb64d7e79c6c5039c3b`
- Post-merge `required-ci / validate`: run `35094034867` **success**
- Gate 7 **GREEN** — drive/ramp/physics already in qa:ci; damage-smoke now required via npm test
- Live release gates **7/13**
- P1-12 stays **OPEN** (golden/HaShalom/long-soak still outside the required gate)
- P1-13, P2-03, P2-09 stay **OPEN**
- Frozen product sources, `package.json`, `required-ci.yml` and `CURRENT-STATE.json` unchanged

## Live gate 10 stays RED — 2026-09-16 (after PR #78)

Not a new RSH unit. Post-merge CI of PR #78 is recorded. Gate 10 stays
**RED**: 2-cycle soak-smoke and the 20-cycle enter-exit harness do not
substitute for the 1800 s wall-clock soak.

- PR #78 merge SHA: `a0850f9523224b8224d940b910c69e8986681578`
- Post-merge `required-ci / validate`: run `35095481235` **success**
- Live release gates stay **7/13**
- P1-12 stays **OPEN**
- P1-13, P2-03, P2-09 stay **OPEN**
- Frozen product sources, `package.json`, `required-ci.yml` and `CURRENT-STATE.json` unchanged

## Pixel-golden and Ayalon lock stay outside required npm test — 2026-09-16 (after PR #79)

Not a new RSH unit. Required CI of the golden/ayalon-hash attempt failed
(run `35099626005`): `ayalon-hash` mismatches frozen `ayalon.lock`, and
`pixel-golden` aborted with ECONNRESET / missing Ayalon control under
unit-test load. Those scripts stay outside `npm test`. Damage-smoke remains
required. Hashed `qa:ci:raw` is unchanged.

- PR #79 merge SHA: `2748bd65b345e0fb958cf37f2b86b0dc0c02190d`
- Post-merge `required-ci / validate`: run `35098117727` **success**
- Live release gates stay **7/13**
- P1-12 stays **OPEN**
- P1-13, P2-03, P2-09 stay **OPEN**
- Frozen product sources, `package.json`, `required-ci.yml` and `CURRENT-STATE.json` unchanged
