# RUSH Israel — Canonical Master Plan

**Schema:** 2.8.0  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**RSH-012 implementation base:** `aab3b725f256ff5a0a145c5cd3ac749860bdaeb9`  
**State effective on:** merge of PR #15  
**Next eligible unit:** RSH-013  
**Product-definition authority:** `PRODUCT-DEFINITION.json`  
**Track-classification authority:** `TRACK-CATALOGUE-CLASSIFICATION.json`  
**Asset-provenance authority:** `ASSET-PROVENANCE.json`  
**Product-metadata authority:** `PRODUCT-METADATA.json`  
**Date:** 29 August 2026

## 1. Authority

GitHub is the sole source of truth. `CURRENT-STATE.json`, `QUEUE.json`, this document,
`NEXT-CONTRACT.md`, `FINDINGS-REGISTER.md`, `BASELINE-REGISTER.json`,
`MILESTONE-REGISTER.md`, `PRODUCT-DEFINITION.json`,
`TRACK-CATALOGUE-CLASSIFICATION.json`, `ASSET-PROVENANCE.json`,
`PRODUCT-METADATA.json` and `REPOSITORY-GOVERNANCE.md` control program state.

Historical planning files are evidence only. They do not control queue order,
accepted progress, asset clearance or release-gate counts.

## 2. Frozen Version 1 boundary

Version 1 is a private, owner-controlled Three.js WebGL simcade browser-driving game
using fictional routes inspired by Israeli places. It uses fixed-step 120 Hz physics,
five fictional vehicles, keyboard/touch/gamepad input, Hebrew and English, and exactly
eight Version 1 tracks.

| Frozen name | Exact repository ID |
|---|---|
| Ayalon | `ayalon` |
| Rothschild | `rothschild` |
| Yarkon–Reading | `namal` |
| Jaffa | `oldjaffa` |
| Jerusalem–Scopus | `scopus` |
| Haifa–Carmel | `haifa` |
| Ramon | `ramon` |
| Hermon | `hermon` |

The remaining 48 live track IDs are deferred and retained. Public distribution,
multiplayer, mandatory accounts/backend, monetisation, UGC, WebGPU as default,
native-store release, GIS/navigation accuracy and console-photorealism claims remain
outside Version 1 unless an explicit owner-authorised change preserves history.

## 3. Identity, asset and legal truth

RSH-011 inventories every tracked file recursively under `public/`. RSH-012 establishes
the product identity, package metadata, proprietary root licence and product-specific
PWA integration.

| Metric | Exact value |
|---|---:|
| Product name | RUSH Israel |
| Product version | `0.0.0-private` |
| Package licence | `UNLICENSED` |
| Root licence | Proprietary — All Rights Reserved |
| Public shipping files | 134 |
| Public asset files | 131 |
| Unverified shipping files | 67 |
| Unverified asset files | 66 |
| Legal clearance complete | No |
| Public distribution authorised | No |

Complete inventory coverage and a root proprietary licence do not clear third-party or
unverified assets. The 56 track-card images, seven Grok visual assets and three
root-branding assets remain unverified.

## 4. Operating rules

1. Execute only the eligible queue head.
2. Re-read live GitHub before every write.
3. Use one dedicated branch and PR per unit; never write directly to `main`.
4. Never force-push, rewrite history or pre-create a later unit.
5. Exact-head `required-ci / validate` success and resolved blocking review findings are mandatory before merge.
6. A unit becomes accepted when its PR merges; exact self-referential merge evidence is reconciled in the following preflight.
7. Accepted-unit progress is not release readiness; all 13 release gates remain authoritative.
8. The current owner batch is exactly RSH-010–RSH-014 and closes after RSH-014.
9. RSH-013 requires a new `next`; RSH-015 is not authorised.

## 5. Post-RSH-012 program state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 12 |
| In review | 0 |
| Eligible | 1 |
| Deferred | 54 |
| Remaining | 55 |
| Queue head | RSH-013 |
| Active PR | none |
| Current batch completed | 3/5 |
| Release gates green | 0/13 |
| Findings OPEN / MITIGATED / CLOSED | 24 / 7 / 11 |

## 6. Stage map

| Stage | Units | Count | Purpose | Post-merge state |
|---|---:|---:|---|---|
| G0 | RSH-001–003 | 3 | Control and governance | ACCEPTED |
| G1 | RSH-004–008 | 5 | Reproducible toolchain and CI | UNITS ACCEPTED; EXIT GATE BLOCKED BY OWNER SETTING |
| G2 | RSH-009–012 | 4 | Scope, licensing and assets | ACCEPTED ON PR #15 MERGE |
| G3 | RSH-013–020 | 8 | Architecture decomposition | ACTIVE — RSH-013 eligible; RSH-014 authorised |
| G4 | RSH-021–024 | 4 | Data integrity and production security | DEFERRED |
| G5 | RSH-025–036 | 12 | Ayalon vertical slice | DEFERRED |
| G6 | RSH-037–043 | 7 | Performance and reliability | DEFERRED |
| G7 | RSH-044–048 | 5 | UX, accessibility and mobile | DEFERRED |
| G8 | RSH-049–062 | 14 | Seven additional MVP tracks | DEFERRED |
| G9 | RSH-063–067 | 5 | Release | DEFERRED |

## 7. Unit plan

| Unit | Title |
|---|---|
| RSH-001 | Canonical program control |
| RSH-002 | Repository governance and visibility policy |
| RSH-003 | Baseline, milestones, labels and release register |
| RSH-004 | Pin Node, npm and reproducible installation |
| RSH-005 | Remove absolute workspace paths and make scripts portable |
| RSH-006 | Build a self-starting QA harness |
| RSH-007 | Create GitHub Actions CI |
| RSH-008 | Enforce required checks, branch protection and CI artifacts |
| RSH-009 | Freeze the Version 1 product definition |
| RSH-010 | Classify the track catalogue into 8 MVP and 48 deferred tracks |
| RSH-011 | Create the complete asset provenance and licence inventory |
| RSH-012 | Align README, metadata, branding, licence and PWA scope |
| RSH-013 | Define and validate the canonical track schema |
| RSH-014 | Split `tracks.ts` into one module per track |
| RSH-015 | Extract the world core from `world.ts` |
| RSH-016 | Create isolated world builders per track |
| RSH-017 | Split `engine.ts` into loop, rendering, physics and QA adapters |
| RSH-018 | Split `game-app.tsx` into screens, HUD and race controller |
| RSH-019 | Complete resource ownership, disposal and leak accounting |
| RSH-020 | Isolate or remove unused auth, DB, multiplayer and template dependencies |
| RSH-021 | Version the save schema and implement deterministic migrations |
| RSH-022 | Add save backup, corruption recovery and user-visible failure handling |
| RSH-023 | Harden timed records, write ordering, deduplication and storage limits |
| RSH-024 | Harden production security and separate DB migration from build |
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
| RSH-037 | Instrument p50, p95, p99, draw calls, triangles and memory |
| RSH-038 | Define quality profiles and dynamic-quality hysteresis |
| RSH-039 | Set bundle, asset-streaming and cache budgets |
| RSH-040 | Pass 20 race enter-exit cycles without a resource leak |
| RSH-041 | Pass WebGL context-loss and recovery tests |
| RSH-042 | Pass the 30-minute soak test |
| RSH-043 | Validate the browser and device support matrix |
| RSH-044 | Unify keyboard, touch and gamepad input maps |
| RSH-045 | Complete Hebrew RTL, English LTR and the Arabic-scope decision |
| RSH-046 | Complete onboarding, settings, error and recovery flows |
| RSH-047 | Complete PWA, offline, update and manifest behaviour |
| RSH-048 | Pass accessibility, privacy and Alpha UX gates |
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
| RSH-063 | Establish SemVer, changelog and release automation |
| RSH-064 | Establish preview, staging, production and rollback |
| RSH-065 | Publish and evaluate `v0.1.0-alpha.1` |
| RSH-066 | Produce RC1 and close all blocking defects |
| RSH-067 | Publish `v1.0.0` with signed tag, dossier and rollback proof |

## 8. Release gates

| # | Gate | Current state |
|---:|---|---|
| 1 | Visibility and licensing agree with owner policy | RED — repository remains public and 66 assets remain unverified |
| 2 | `main` is protected and PR delivery is enforced | RED |
| 3 | A clean clone installs and builds reproducibly | RED — evidence exists, release authority not closed |
| 4 | Required CI is complete and green | RED — workflow exists, repository setting absent |
| 5 | Production contains no QA hook or secrets | RED |
| 6 | Ayalon is owner-approved and frozen | RED |
| 7 | Driving, physics, ramps and damage pass | RED |
| 8 | Desktop performance meets its budget | RED |
| 9 | Mobile performance meets its budget | RED |
| 10 | Soak, memory and context recovery pass | RED |
| 11 | Save and records are recoverable and valid | RED |
| 12 | UX, input, languages, accessibility and legal checks pass | RED |
| 13 | Signed release, artifacts and rollback proof exist | RED |

Current verified result: **0/13**.

## 9. Current execution boundary

PR #15 is the sole RSH-012 delivery vehicle. It aligns README, package metadata, root
licence, Open Graph, root document metadata and both Vite and Nitro PWA paths while
preserving 66 unverified-asset blockers.

After PR #15 passes exact-head CI and review and merges, RSH-013 becomes eligible but
must not start without a new `next`. RSH-014 remains the final authorised batch unit.
RSH-015 must not be created automatically.
