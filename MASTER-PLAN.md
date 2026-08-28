# RUSH Israel — Canonical Master Plan

**Schema:** 1.0.0  
**Canonical repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**Verified baseline:** `bf08477a44aae0bfc5fee7329f83885adb85c3d8`  
**Established by:** RSH-001  
**Date:** 28 August 2026

## 1. Authority

GitHub is the sole source of truth. `CURRENT-STATE.json`, `QUEUE.json`, this document, `NEXT-CONTRACT.md` and `FINDINGS-REGISTER.md` control program state and sequencing.

`progress.md`, `PLAN.md`, `TASKS.md`, `EXECUTION_PLAN.md`, `MASTER_PLAN_AUDIT.md` and `CODEX_GAPS.md` remain technical and historical evidence. They do not control the queue, accepted progress or release-gate count.

## 2. Product boundary

Version 1 is a **Three.js WebGL simcade driving game inspired by Israeli places**.

It is not represented as GIS, a measurement simulator, a digital twin, Unreal, photogrammetry or a scanned-vehicle product. `WebGLRenderer` remains the default renderer. WebGPU, online multiplayer and broad catalogue expansion are outside Version 1 until the 13 release gates pass.

## 3. Operating rules

1. Execute exactly one queue-head unit per `next`.
2. Re-read the live `main` HEAD before every write.
3. Use a clean feature branch and Draft PR.
4. Never write directly to `main`.
5. Never merge without explicit owner approval.
6. Never force-push or rewrite history.
7. Never pre-create later-unit branches, commits or PRs.
8. A later unit becomes eligible only after the current unit is accepted and merged.
9. A unit is complete only when its scope, validation evidence and control documents agree.
10. Program percentages are secondary; accepted units and release gates are authoritative.

## 4. Current baseline

| Metric | Canonical value |
|---|---:|
| Program units | 67 |
| Accepted units | 0 |
| Units in review | 1 |
| Queue head | RSH-001 |
| Documented implementation estimate | 13.0% |
| Independent implementation estimate | 16.0% |
| Estimate range | 14.0%–18.0% |
| Verified release gates | 0/13 |
| Findings | 42 |
| P0 / P1 / P2 | 12 / 18 / 12 |

The 13%–16% values describe implementation breadth only. They do not imply release readiness.

## 5. Version 1 track scope

| # | MVP track |
| --- | --- |
| 1 | Ayalon |
| 2 | Rothschild |
| 3 | Yarkon–Reading |
| 4 | Jaffa |
| 5 | Jerusalem–Scopus |
| 6 | Haifa–Carmel |
| 7 | Ramon |
| 8 | Hermon |

The remaining 48 catalogue cards are deferred. They are not active Version 1 commitments and must not be expanded before the eight-track MVP and release gates are complete.

## 6. Stage map

| Stage | Units | Count | Purpose | Gate |
| --- | --- | --- | --- | --- |
| G0 | RSH-001–RSH-003 | 3 | Control and governance | A single canonical state, queue and governance model exists. |
| G1 | RSH-004–RSH-008 | 5 | Toolchain and CI | A clean clone passes one reproducible required CI command. |
| G2 | RSH-009–RSH-012 | 4 | Scope, licensing and assets | Version 1 scope and every shipped asset's legal status are explicit. |
| G3 | RSH-013–RSH-020 | 8 | Architecture decomposition | Core responsibilities are separated and resource ownership is explicit. |
| G4 | RSH-021–RSH-024 | 4 | Data integrity and production security | Save data is recoverable and production contains no debug or secret exposure. |
| G5 | RSH-025–RSH-036 | 12 | Ayalon vertical slice | Ayalon is owner-approved, golden-locked and dependency-frozen. |
| G6 | RSH-037–RSH-043 | 7 | Performance and reliability | Performance, leak, recovery, soak and compatibility targets pass. |
| G7 | RSH-044–RSH-048 | 5 | UX, accessibility and mobile | Keyboard, touch and gamepad flows pass UX, accessibility and privacy gates. |
| G8 | RSH-049–RSH-062 | 14 | Seven additional Version 1 tracks | Eight of eight MVP tracks are driveable, golden-approved and frozen. |
| G9 | RSH-063–RSH-067 | 5 | Release | All 13 release gates pass and v1.0.0 has rollback proof. |

## 7. Unit plan

## G0 — Control and governance

| Unit | Title | Type |
| --- | --- | --- |
| RSH-001 | Canonical program control | control |
| RSH-002 | Repository governance and visibility policy | governance |
| RSH-003 | Baseline, milestones, labels and release register | governance |

**Stage gate:** A single canonical state, queue and governance model exists.

## G1 — Toolchain and CI

| Unit | Title | Type |
| --- | --- | --- |
| RSH-004 | Pin Node, npm and reproducible installation | toolchain |
| RSH-005 | Remove absolute workspace paths and make scripts portable | toolchain |
| RSH-006 | Build a self-starting QA harness | ci |
| RSH-007 | Create GitHub Actions CI | ci |
| RSH-008 | Enforce required checks, branch protection and CI artifacts | governance |

**Stage gate:** A clean clone passes one reproducible required CI command.

## G2 — Scope, licensing and assets

| Unit | Title | Type |
| --- | --- | --- |
| RSH-009 | Freeze the Version 1 product definition | product |
| RSH-010 | Classify the track catalogue into 8 MVP and 48 deferred tracks | product |
| RSH-011 | Create the complete asset provenance and licence inventory | legal |
| RSH-012 | Align README, metadata, branding, licence and PWA scope | documentation |

**Stage gate:** Version 1 scope and every shipped asset's legal status are explicit.

## G3 — Architecture decomposition

| Unit | Title | Type |
| --- | --- | --- |
| RSH-013 | Define and validate the canonical track schema | architecture |
| RSH-014 | Split tracks.ts into one module per track | architecture |
| RSH-015 | Extract the world core from world.ts | architecture |
| RSH-016 | Create isolated world builders per track | architecture |
| RSH-017 | Split engine.ts into loop, rendering, physics and QA adapters | architecture |
| RSH-018 | Split game-app.tsx into screens, HUD and race controller | architecture |
| RSH-019 | Complete resource ownership, disposal and leak accounting | architecture |
| RSH-020 | Isolate or remove unused auth, DB, multiplayer and template dependencies | architecture |

**Stage gate:** Core responsibilities are separated and resource ownership is explicit.

## G4 — Data integrity and production security

| Unit | Title | Type |
| --- | --- | --- |
| RSH-021 | Version the save schema and implement deterministic migrations | data |
| RSH-022 | Add save backup, corruption recovery and user-visible failure handling | data |
| RSH-023 | Harden timed records, write ordering, deduplication and storage limits | data |
| RSH-024 | Harden production security and separate DB migration from build | security |

**Stage gate:** Save data is recoverable and production contains no debug or secret exposure.

## G5 — Ayalon vertical slice

| Unit | Title | Type |
| --- | --- | --- |
| RSH-025 | Define Ayalon acceptance criteria and reference pack | vertical-slice |
| RSH-026 | Lock Ayalon road geometry, widths and lanes | vertical-slice |
| RSH-027 | Lock Ayalon ramps, barriers, colliders and checkpoints | vertical-slice |
| RSH-028 | Lock Ayalon landmark placement | vertical-slice |
| RSH-029 | Lock Ayalon asphalt, sidewalks, markings and signs | vertical-slice |
| RSH-030 | Deliver the Version 1 hero car, LODs and silhouette gate | vertical-slice |
| RSH-031 | Lock daylight, sky and image-based lighting | vertical-slice |
| RSH-032 | Lock night lighting, headlights and weather | vertical-slice |
| RSH-033 | Calibrate driving physics and the five-car performance table | vertical-slice |
| RSH-034 | Lock audio, HUD, keyboard, touch and gamepad behaviour | vertical-slice |
| RSH-035 | Produce the unique Ayalon golden pack and owner approval record | vertical-slice |
| RSH-036 | Freeze Ayalon and hash all transitive dependencies | vertical-slice |

**Stage gate:** Ayalon is owner-approved, golden-locked and dependency-frozen.

## G6 — Performance and reliability

| Unit | Title | Type |
| --- | --- | --- |
| RSH-037 | Instrument p50, p95, p99, draw calls, triangles and memory | performance |
| RSH-038 | Define quality profiles and dynamic-quality hysteresis | performance |
| RSH-039 | Set bundle, asset streaming and cache budgets | performance |
| RSH-040 | Pass 20 race enter-exit cycles without a resource leak | reliability |
| RSH-041 | Pass WebGL context-loss and recovery tests | reliability |
| RSH-042 | Pass the 30-minute soak test | reliability |
| RSH-043 | Validate the browser and device support matrix | reliability |

**Stage gate:** Performance, leak, recovery, soak and compatibility targets pass.

## G7 — UX, accessibility and mobile

| Unit | Title | Type |
| --- | --- | --- |
| RSH-044 | Unify keyboard, touch and gamepad input maps | ux |
| RSH-045 | Complete Hebrew RTL, English LTR and the Arabic-scope decision | ux |
| RSH-046 | Complete onboarding, settings, error and recovery UX | ux |
| RSH-047 | Harden PWA installation, offline and update behaviour | ux |
| RSH-048 | Pass accessibility, privacy and Alpha UX gates | ux |

**Stage gate:** Keyboard, touch and gamepad flows pass UX, accessibility and privacy gates.

## G8 — Seven additional Version 1 tracks

| Unit | Title | Type |
| --- | --- | --- |
| RSH-049 | Rothschild geometry and driveability | track |
| RSH-050 | Rothschild art, golden evidence and freeze | track |
| RSH-051 | Yarkon-Reading geometry and driveability | track |
| RSH-052 | Yarkon-Reading art, golden evidence and freeze | track |
| RSH-053 | Jaffa geometry and driveability | track |
| RSH-054 | Jaffa art, golden evidence and freeze | track |
| RSH-055 | Jerusalem-Scopus geometry and driveability | track |
| RSH-056 | Jerusalem-Scopus art, golden evidence and freeze | track |
| RSH-057 | Haifa-Carmel geometry and driveability | track |
| RSH-058 | Haifa-Carmel art, golden evidence and freeze | track |
| RSH-059 | Ramon geometry and driveability | track |
| RSH-060 | Ramon art, golden evidence and freeze | track |
| RSH-061 | Hermon geometry and driveability | track |
| RSH-062 | Hermon art, golden evidence and freeze | track |

**Stage gate:** Eight of eight MVP tracks are driveable, golden-approved and frozen.

## G9 — Release

| Unit | Title | Type |
| --- | --- | --- |
| RSH-063 | Establish SemVer, changelog and release automation | release |
| RSH-064 | Establish preview, staging, production and rollback | release |
| RSH-065 | Publish and evaluate v0.1.0-alpha.1 | release |
| RSH-066 | Produce RC1 and close all blocking defects | release |
| RSH-067 | Publish v1.0.0 with signed tag, dossier and rollback proof | release |

**Stage gate:** All 13 release gates pass and v1.0.0 has rollback proof.


## 8. Release gates

| # | Gate | Current state |
| --- | --- | --- |
| 1 | Repository visibility and licensing agree | RED |
| 2 | main is protected and changes require reviewed PRs | RED |
| 3 | A clean clone installs and builds reproducibly | RED |
| 4 | Required CI is complete and green | RED |
| 5 | Production contains no QA hook or exposed secret | RED |
| 6 | Ayalon is owner-approved and dependency-frozen | RED |
| 7 | Driving, physics, ramps, damage and records are validated | RED |
| 8 | Desktop performance meets the accepted budget | RED |
| 9 | Mobile performance meets the accepted budget | RED |
| 10 | Soak, memory and WebGL recovery pass | RED |
| 11 | Save and records are recoverable and integrity-checked | RED |
| 12 | UX, input, language, accessibility, privacy and legal gates pass | RED |
| 13 | Version, signed release, dossier and rollback proof exist | RED |

**Current authoritative result:** `0/13`.

## 9. Performance and reliability targets

| Measure | Acceptance target |
|---|---:|
| Desktop High p95 frame time | ≤16.7 ms |
| Mobile Mid p95 frame time | ≤20.0 ms |
| Low fallback | Stable ≥30 FPS |
| Memory growth after 20 enter/exit cycles | <5% |
| Soak duration | 30 minutes |
| Unhandled page/console errors | 0 |

Targets become authoritative only after RSH-037–RSH-043 define the exact hardware, browser, scene, measurement method and evidence format.

## 10. Deferred roadmap

After Version 1 acceptance only:

- up to 96 units for the remaining 48 track cards, normally two gated units per track;
- up to 6 research units for WebGPU, HDRI and production KTX2;
- multiplayer or online services require a separately approved master-plan revision.

Deferred work is not part of the active 67-unit queue and must not be pre-created.

## 11. Acceptance transition

RSH-001 remains the queue head while its Draft PR is open. After explicit owner approval and merge, RSH-002 becomes the only eligible unit.
