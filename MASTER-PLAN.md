# RUSH Israel — Canonical Master Plan

**Schema:** 2.6.1  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**Verified base:** `69765febef85d732d9ba79fe260fec78ee76b2df`  
**Active unit:** RSH-010 / replacement PR #13  
**Replaced Draft PR:** #12, closed unmerged after connector Ready-for-review failure  
**Established by:** RSH-001  
**Governance policy:** RSH-002  
**Product-definition authority:** `PRODUCT-DEFINITION.json`  
**Track-classification authority:** `TRACK-CATALOGUE-CLASSIFICATION.json`  
**Date:** 29 August 2026

## 1. Authority

GitHub is the sole source of truth. `CURRENT-STATE.json`, `QUEUE.json`, this document,
`NEXT-CONTRACT.md`, `FINDINGS-REGISTER.md`, `BASELINE-REGISTER.json`,
`MILESTONE-REGISTER.md`, `PRODUCT-DEFINITION.json`,
`TRACK-CATALOGUE-CLASSIFICATION.json` and `REPOSITORY-GOVERNANCE.md` control
program state and sequencing.

`progress.md`, `PLAN.md`, `TASKS.md`, `EXECUTION_PLAN.md`,
`MASTER_PLAN_AUDIT.md` and `CODEX_GAPS.md` remain historical and technical evidence.
They do not control queue order, accepted progress or release-gate counts.

## 2. Product boundary

Version 1 is a **private, owner-controlled Three.js WebGL simcade driving game
using fictional routes inspired by Israeli places**.

The machine-readable product boundary was frozen by RSH-009 in
`PRODUCT-DEFINITION.json`. It requires:

- `WebGLRenderer` as the default renderer;
- fixed-step simcade physics at 120 Hz;
- exactly eight Version 1 tracks;
- exactly five fictional vehicles;
- local single-player web delivery;
- keyboard, touch and gamepad input;
- Hebrew and English;
- all 13 release gates before a release claim.

It is not represented as GIS, a measurement simulator, a digital twin, Unreal, Unity,
photogrammetry, a scanned/licensed-real-vehicle product or console-equivalent
photorealism. WebGPU as default, online multiplayer, public distribution, native store
packages, mandatory accounts, monetisation, UGC and expansion beyond the eight-track
Version 1 boundary are excluded unless a later explicit owner-authorised unit changes
the preserved definition.

RSH-010 maps the eight frozen names to exact repository IDs and classifies all 56
catalogue entries. RSH-011 inventories asset provenance and licensing.

## 3. Operating rules

1. Execute only the eligible queue head.
2. Re-read live GitHub before every write.
3. Use a dedicated branch and PR; never write directly to `main`.
4. Never force-push or rewrite history.
5. Never pre-create a later unit.
6. A unit is accepted only when merged evidence and canonical state agree.
7. Percentages are estimates; accepted units and the 13 release gates are authoritative.
8. A bounded owner instruction may authorise several consecutive units, but authority
   ends after the exact final unit recorded in `QUEUE.json`.
9. Exact-head required CI success is mandatory for every PR after RSH-007.
10. Workflow evidence and GitHub repository settings are separate authorities.
11. If a unit's own PR prepares post-merge canonical state, the next preflight must
    read and persist the actual merge SHA.
12. The frozen product definition may change only through explicit owner authorisation,
    a separate reviewed unit, canonical plan/queue updates and preservation of history.
13. Deferred catalogue entries remain retained unless an explicit later unit authorises deletion.

## 4. Current program state

| Metric | Current value |
|---|---:|
| Total units | 67 |
| Accepted units | 9 |
| Units in review | 1 |
| Queue head | RSH-010 |
| Active PR | #13 |
| Replaced unmerged draft | #12 |
| Remaining units | 58 |
| Active bounded batch | RSH-010–RSH-014 |
| Verified release gates | 0/13 |
| Findings | 42 |
| OPEN / MITIGATED / CLOSED | 26 / 8 / 8 |

The owner instruction `next 5` authorises exactly RSH-010 through RSH-014. Each unit
must validate and merge before its successor starts. RSH-015 is not authorised.

## 5. Version 1 track scope

| # | Frozen Version 1 name | Exact repository ID | RSH-010 state |
|---:|---|---|---|
| 1 | Ayalon | `ayalon` | MVP |
| 2 | Rothschild | `rothschild` | MVP |
| 3 | Yarkon–Reading | `namal` | MVP |
| 4 | Jaffa | `oldjaffa` | MVP |
| 5 | Jerusalem–Scopus | `scopus` | MVP |
| 6 | Haifa–Carmel | `haifa` | MVP |
| 7 | Ramon | `ramon` | MVP |
| 8 | Hermon | `hermon` | MVP |

All other 48 live IDs are explicitly deferred and retained. The complete ordered
classification is in `TRACK-CATALOGUE-CLASSIFICATION.json`; implicit promotion or
scope expansion is prohibited.

## 6. Stage map

| Stage | Units | Count | Purpose | Current state |
|---|---:|---:|---|---|
| G0 | RSH-001–RSH-003 | 3 | Control and governance | ACCEPTED |
| G1 | RSH-004–RSH-008 | 5 | Reproducible toolchain and CI | UNITS ACCEPTED; EXIT GATE BLOCKED BY OWNER SETTING |
| G2 | RSH-009–RSH-012 | 4 | Scope, licensing and assets | ACTIVE — RSH-010; AUTHORISED THROUGH RSH-012 |
| G3 | RSH-013–RSH-020 | 8 | Architecture decomposition | RSH-013–RSH-014 AUTHORISED; RSH-015–020 DEFERRED |
| G4 | RSH-021–RSH-024 | 4 | Data integrity and production security | DEFERRED |
| G5 | RSH-025–RSH-036 | 12 | Ayalon vertical slice | DEFERRED |
| G6 | RSH-037–RSH-043 | 7 | Performance and reliability | DEFERRED |
| G7 | RSH-044–RSH-048 | 5 | UX, accessibility and mobile | DEFERRED |
| G8 | RSH-049–RSH-062 | 14 | Seven additional MVP tracks | DEFERRED |
| G9 | RSH-063–RSH-067 | 5 | Release | DEFERRED |

## 7. Unit plan

### G0 — Control and governance

| Unit | Title |
|---|---|
| RSH-001 | Canonical program control |
| RSH-002 | Repository governance and visibility policy |
| RSH-003 | Baseline, milestones, labels and release register |

### G1 — Toolchain and CI

| Unit | Title |
|---|---|
| RSH-004 | Pin Node, npm and reproducible installation |
| RSH-005 | Remove absolute workspace paths and make scripts portable |
| RSH-006 | Build a self-starting QA harness |
| RSH-007 | Create GitHub Actions CI |
| RSH-008 | Enforce required checks, branch protection and CI artifacts |

### G2 — Scope, licensing and assets

| Unit | Title |
|---|---|
| RSH-009 | Freeze the Version 1 product definition |
| RSH-010 | Classify the track catalogue into 8 MVP and 48 deferred tracks |
| RSH-011 | Create the complete asset provenance and licence inventory |
| RSH-012 | Align README, metadata, branding, licence and PWA scope |

### G3 — Architecture decomposition

| Unit | Title |
|---|---|
| RSH-013 | Define and validate the canonical track schema |
| RSH-014 | Split `tracks.ts` into one module per track |
| RSH-015 | Extract the world core from `world.ts` |
| RSH-016 | Create isolated world builders per track |
| RSH-017 | Split `engine.ts` into loop, rendering, physics and QA adapters |
| RSH-018 | Split `game-app.tsx` into screens, HUD and race controller |
| RSH-019 | Complete resource ownership, disposal and leak accounting |
| RSH-020 | Isolate or remove unused auth, DB, multiplayer and template dependencies |

### G4 — Data integrity and production security

| Unit | Title |
|---|---|
| RSH-021 | Version the save schema and implement deterministic migrations |
| RSH-022 | Add save backup, corruption recovery and user-visible failure handling |
| RSH-023 | Harden timed records, write ordering, deduplication and storage limits |
| RSH-024 | Harden production security and separate DB migration from build |

### G5 — Ayalon vertical slice

| Unit | Title |
|---|---|
| RSH-025 | Define Ayalon acceptance criteria and reference pack |
| RSH-026 | Lock Ayalon road geometry, widths and lanes |
| RSH-027 | Lock Ayalon ramps, barriers, colliders and checkpoints |
| RSH-028 | Lock Ayalon landmark placement |
| RSH-029 | Lock Ayalon asphalt, sidewalks, markings and signs |
| RSH-030 | Deliver the Version 1 hero car, LODs and silhouette gate |
| RSH-031 | Lock daylight, sky and image-based lighting |
| RSH-032 | Lock night lighting, headlights and weather |
| RSH-033 | Calibrate driving physics and the five-car performance table |
| RSH-034 | Lock audio, HUD, keyboard, touch and gamepad behaviour |
| RSH-035 | Produce the unique Ayalon golden pack and owner approval record |
| RSH-036 | Freeze Ayalon and hash all transitive dependencies |

### G6 — Performance and reliability

| Unit | Title |
|---|---|
| RSH-037 | Instrument p50, p95, p99, draw calls, triangles and memory |
| RSH-038 | Define quality profiles and dynamic-quality hysteresis |
| RSH-039 | Set bundle, asset streaming and cache budgets |
| RSH-040 | Pass 20 race enter-exit cycles without a resource leak |
| RSH-041 | Pass WebGL context-loss and recovery tests |
| RSH-042 | Pass the 30-minute soak test |
| RSH-043 | Validate the browser and device support matrix |

### G7 — UX, accessibility and mobile

| Unit | Title |
|---|---|
| RSH-044 | Unify keyboard, touch and gamepad input maps |
| RSH-045 | Complete Hebrew RTL, English LTR and the Arabic-scope decision |
| RSH-046 | Complete onboarding, settings, error and recovery flows |
| RSH-047 | Complete PWA, offline, update and manifest behaviour |
| RSH-048 | Pass accessibility, privacy and Alpha UX gates |

### G8 — Seven additional Version 1 tracks

| Unit | Title |
|---|---|
| RSH-049 | Rothschild geometry and driving |
| RSH-050 | Rothschild art, golden and freeze |
| RSH-051 | Yarkon–Reading geometry and driving |
| RSH-052 | Yarkon–Reading art, golden and freeze |
| RSH-053 | Jaffa geometry and driving |
| RSH-054 | Jaffa art, golden and freeze |
| RSH-055 | Jerusalem–Scopus geometry and driving |
| RSH-056 | Jerusalem–Scopus art, golden and freeze |
| RSH-057 | Haifa–Carmel geometry and driving |
| RSH-058 | Haifa–Carmel art, golden and freeze |
| RSH-059 | Ramon geometry and driving |
| RSH-060 | Ramon art, golden and freeze |
| RSH-061 | Hermon geometry and driving |
| RSH-062 | Hermon art, golden and freeze |

### G9 — Release

| Unit | Title |
|---|---|
| RSH-063 | Establish SemVer, changelog and release automation |
| RSH-064 | Establish preview, staging, production and rollback |
| RSH-065 | Publish and evaluate `v0.1.0-alpha.1` |
| RSH-066 | Produce RC1 and close all blocking defects |
| RSH-067 | Publish `v1.0.0` with signed tag, dossier and rollback proof |

## 8. Release gates

| # | Gate |
|---:|---|
| 1 | Visibility and licensing agree with owner policy |
| 2 | `main` is protected and PR delivery is enforced |
| 3 | A clean clone installs and builds reproducibly |
| 4 | Required CI is complete and green |
| 5 | Production contains no QA hook or secrets |
| 6 | Ayalon is owner-approved and frozen |
| 7 | Driving, physics, ramps and damage pass |
| 8 | Desktop performance meets its budget |
| 9 | Mobile performance meets its budget |
| 10 | Soak, memory and context recovery pass |
| 11 | Save and records are recoverable and valid |
| 12 | UX, input, languages, accessibility and legal checks pass |
| 13 | Signed release, artifacts and rollback proof exist |

Current verified result: **0/13**.

RSH-007 provides reproducible clean-checkout CI evidence. RSH-008 provides exact-head
governance validation and retained diagnostics, but release gate 2 remains blocked
because live GitHub still reports `main` unprotected, required checks 0 and rulesets 0.
The five known acceleration product claims remain failed and assigned to RSH-033.

## 9. Current execution boundary

RSH-010 creates the complete 56-entry machine classification and source-aware validator.
Replacement PR #13 must reconcile all canonical state, pass exact-head
`required-ci / validate`, preserve all 48 deferred entries and preserve 0/13
release-gate truth. Draft PR #12 remains closed and unmerged as a tool-failure record.

After RSH-010 merges, RSH-011 may inventory provenance. RSH-012, RSH-013 and RSH-014
may then run strictly serially. The bounded batch ends after RSH-014; RSH-015 must not
be created automatically.
