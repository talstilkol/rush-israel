# RUSH Israel — Canonical Master Plan

**Schema:** 2.1.0  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**Transition base:** `6932a74ca23f125e212f37fa0db73da377eaabe3`  
**Effective when:** PR #7 merges  
**Established by:** RSH-001  
**Governance policy:** RSH-002  
**Date:** 29 August 2026

## 1. Authority

GitHub is the sole source of truth. `CURRENT-STATE.json`, `QUEUE.json`, this document,
`NEXT-CONTRACT.md`, `FINDINGS-REGISTER.md`, `BASELINE-REGISTER.json` and
`REPOSITORY-GOVERNANCE.md` control program state and sequencing.

`progress.md`, `PLAN.md`, `TASKS.md`, `EXECUTION_PLAN.md`,
`MASTER_PLAN_AUDIT.md` and `CODEX_GAPS.md` remain historical and technical evidence.
They do not control queue order, accepted progress or release-gate counts.

## 2. Product boundary

Version 1 is a **private, owner-controlled Three.js WebGL simcade driving game
inspired by Israeli places**.

It is not represented as GIS, a measurement simulator, a digital twin, Unreal,
photogrammetry or a scanned-vehicle product. `WebGLRenderer` remains the default.
WebGPU, online multiplayer, public distribution and expansion beyond the eight-track
MVP are outside Version 1 until explicitly authorised.

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
9. If a unit's own PR prepares post-merge canonical state, the next preflight must
   read and persist the actual merge SHA.

## 4. Current program state

| Metric | Current value |
|---|---:|
| Total units | 67 |
| Accepted units | 6 |
| Units in review | 0 |
| Eligible queue head | RSH-007 |
| RSH-007 started | No |
| Remaining units | 61 |
| Verified release gates | 0/13 |
| Findings | 42 |
| OPEN / MITIGATED / CLOSED | 30 / 9 / 3 |

The owner-authorised five-unit batch contained exactly RSH-002–RSH-006 and is
complete. A future plain `next` may begin RSH-007 only.

## 5. Version 1 track scope

| # | MVP track |
|---|---|
| 1 | Ayalon |
| 2 | Rothschild |
| 3 | Yarkon–Reading |
| 4 | Jaffa |
| 5 | Jerusalem–Scopus |
| 6 | Haifa–Carmel |
| 7 | Ramon |
| 8 | Hermon |

The remaining 48 catalogue cards are deferred and must not be expanded before the
MVP and release gates are complete.

## 6. Stage map

| Stage | Units | Count | Purpose | Current state |
|---|---:|---:|---|---|
| G0 | RSH-001–RSH-003 | 3 | Control and governance | ACCEPTED |
| G1 | RSH-004–RSH-008 | 5 | Reproducible toolchain and CI | ACTIVE |
| G2 | RSH-009–RSH-012 | 4 | Scope, licensing and assets | DEFERRED |
| G3 | RSH-013–RSH-020 | 8 | Architecture decomposition | DEFERRED |
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

## 9. Current execution boundary

RSH-006 has established the local self-starting QA lifecycle. GitHub-hosted
clean-clone execution remains intentionally deferred to RSH-007. Therefore the
self-contained-QA finding is mitigated, but CI and reproducibility gates remain open.

No RSH-007 branch or PR exists. The completed batch gives no remaining authority.
A future plain `next` may begin RSH-007 only after its preflight records the live
PR #7 merge SHA.
