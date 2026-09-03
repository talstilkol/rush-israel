# RUSH Israel — Canonical Master Plan

**Schema:** 16.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-033 implementation base:** `f8d055c86b80ba1a72555e41668e071f74b32536`
**State effective on:** merge of the RSH-033 pull request
**Next unit:** RSH-034 — deferred and not authorised
**Product-definition authority:** `PRODUCT-DEFINITION.json`
**Track-classification authority:** `TRACK-CATALOGUE-CLASSIFICATION.json`
**Asset-provenance authority:** `ASSET-PROVENANCE.json`
**Product-metadata authority:** `PRODUCT-METADATA.json`
**Date:** 3 September 2026

## 1. Authority

GitHub is the sole source of truth. `CURRENT-STATE.json`, `QUEUE.json`, this document,
`NEXT-CONTRACT.md`, `FINDINGS-REGISTER.md`, `BASELINE-REGISTER.json`,
`MILESTONE-REGISTER.md`, `PRODUCT-DEFINITION.json`,
`TRACK-CATALOGUE-CLASSIFICATION.json`, `ASSET-PROVENANCE.json`,
`PRODUCT-METADATA.json`, `TRACK-SCHEMA.json`, `TRACK-MODULE-MANIFEST.json`,
`WORLD-CORE-MANIFEST.json`, `WORLD-BUILDER-MANIFEST.json`,
`ENGINE-ADAPTER-MANIFEST.json`, `GAME-APP-DECOMPOSITION-MANIFEST.json`, `RESOURCE-OWNERSHIP-MANIFEST.json`, `DEPENDENCY-BOUNDARY-MANIFEST.json`, `DEPENDENCY-POLICY.md`, `SAVE-SCHEMA-MANIFEST.json`, `SAVE-RECOVERY-MANIFEST.json`, `RSH-022-SAVE-RECOVERY-CONTRACT.md`, `TIMED-RECORDS-MANIFEST.json`, `RSH-023-TIMED-RECORDS-CONTRACT.md`, `PRODUCTION-SECURITY-MANIFEST.json`, `RSH-024-PRODUCTION-SECURITY-CONTRACT.md`, `AYALON-ACCEPTANCE-MANIFEST.json`, `RSH-025-AYALON-ACCEPTANCE-CONTRACT.md`, `AYALON-GEOMETRY-MANIFEST.json`, `RSH-026-AYALON-GEOMETRY-CONTRACT.md`, `AYALON-COLLIDER-MANIFEST.json`, `RSH-027-AYALON-COLLIDER-CONTRACT.md`, `AYALON-LANDMARK-MANIFEST.json`, `RSH-028-AYALON-LANDMARK-CONTRACT.md`, `AYALON-ASPHALT-MANIFEST.json`, `RSH-029-AYALON-ASPHALT-CONTRACT.md`, `HERO-CAR-MANIFEST.json`, `RSH-030-HERO-CAR-CONTRACT.md`, `DAYLIGHT-SKY-MANIFEST.json`, `RSH-031-DAYLIGHT-CONTRACT.md`, `NIGHT-WEATHER-MANIFEST.json`, `RSH-032-NIGHT-CONTRACT.md` and `REPOSITORY-GOVERNANCE.md` control program state.

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
8. The RSH-010–RSH-014 owner batch is closed at 5/5.
9. The plain `next` / `המשך` authority covers exactly RSH-033 and is consumed on its validated merge; RSH-034 is not authorised.

## 5. Post-RSH-033 program state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 33 |
| In review | 0 |
| Eligible | 0 |
| Deferred | 34 |
| Remaining | 34 |
| Queue head | RSH-034 — deferred/not authorised |
| Active PR | none |
| RSH-033 one-unit authority | 1/1 — consumed |
| Release gates green | 0/13 |
| Findings OPEN / MITIGATED / CLOSED | 13 / 7 / 22 |

## 6. Stage map

| Stage | Units | Count | Purpose | Post-merge state |
|---|---:|---:|---|---|
| G0 | RSH-001–003 | 3 | Control and governance | ACCEPTED |
| G1 | RSH-004–008 | 5 | Reproducible toolchain and CI | UNITS ACCEPTED; EXIT GATE BLOCKED BY OWNER SETTING |
| G2 | RSH-009–012 | 4 | Scope, licensing and assets | ACCEPTED |
| G3 | RSH-013–020 | 8 | Architecture decomposition | ACCEPTED |
| G4 | RSH-021–024 | 4 | Data integrity and production security | ACCEPTED |
| G5 | RSH-025–036 | 12 | Ayalon vertical slice | IN PROGRESS |
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

RSH-021 through RSH-033 are accepted on validated merge. Save schema version 3 and the deterministic 0→1→2→3 migration graph remain unchanged. Production builds stay exactly `vite build`. Ayalon V1 remains a fictional one-carriageway highway (id `ayalon`, width 28, 8 lanes of 3.5, 27 hashed spline samples, 50 interchange ramps, 8 open checkpoints, 9 inspired POIs, baked 8-lane asphalt, no sidewalks, 6 gantries). Daylight stays the live `summer14` look with baked `sky-day.png` and tiny non-HDRI PMREM. Night stays look `night` with baked `sky-night.png`, two headlight spots, ten street lamps and four weather specs. Default boot stays day / clear. Driving physics version 7 matches the five fictional 0–100 claims inside a ±15% band without rewriting `cars.ts`. The opposite carriageway stays visual-only. Owner freeze and GIS claims remain forbidden. GitHub still does not require production checks through branch settings.

Ghosts remain byte-preserved and remain assigned outside this unit. The RSH-033 one-unit `next` / `המשך` authority is consumed on merge. RSH-034 remains deferred and cannot start without a new explicit owner instruction.
