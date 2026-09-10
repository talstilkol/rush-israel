# RUSH Israel — Canonical Master Plan

**Schema:** 20.1.0
**Revision:** r6.13 — owner-authorised improvement programme
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**Verified main:** `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a`
**State effective on:** verified main; RSH-036 remains in review, not accepted
**Active unit:** RSH-036 — authorised and in review (PR #39)
**Product-definition authority:** `PRODUCT-DEFINITION.json`
**Track-classification authority:** `TRACK-CATALOGUE-CLASSIFICATION.json`
**Asset-provenance authority:** `ASSET-PROVENANCE.json`
**Product-metadata authority:** `PRODUCT-METADATA.json`
**Date:** 7 September 2026

## 1. Authority

GitHub is the sole source of truth. `CURRENT-STATE.json`, `QUEUE.json`, this document,
`NEXT-CONTRACT.md`, `FINDINGS-REGISTER.md`, `BASELINE-REGISTER.json`,
`MILESTONE-REGISTER.md`, `PRODUCT-DEFINITION.json`,
`TRACK-CATALOGUE-CLASSIFICATION.json`, `ASSET-PROVENANCE.json`,
`PRODUCT-METADATA.json`, `TRACK-SCHEMA.json`, `TRACK-MODULE-MANIFEST.json`,
`WORLD-CORE-MANIFEST.json`, `WORLD-BUILDER-MANIFEST.json`,
`ENGINE-ADAPTER-MANIFEST.json`, `GAME-APP-DECOMPOSITION-MANIFEST.json`, `RESOURCE-OWNERSHIP-MANIFEST.json`, `DEPENDENCY-BOUNDARY-MANIFEST.json`, `DEPENDENCY-POLICY.md`, `SAVE-SCHEMA-MANIFEST.json`, `SAVE-RECOVERY-MANIFEST.json`, `RSH-022-SAVE-RECOVERY-CONTRACT.md`, `TIMED-RECORDS-MANIFEST.json`, `RSH-023-TIMED-RECORDS-CONTRACT.md`, `PRODUCTION-SECURITY-MANIFEST.json`, `RSH-024-PRODUCTION-SECURITY-CONTRACT.md`, `AYALON-ACCEPTANCE-MANIFEST.json`, `RSH-025-AYALON-ACCEPTANCE-CONTRACT.md`, `AYALON-GEOMETRY-MANIFEST.json`, `RSH-026-AYALON-GEOMETRY-CONTRACT.md`, `AYALON-COLLIDER-MANIFEST.json`, `RSH-027-AYALON-COLLIDER-CONTRACT.md`, `AYALON-LANDMARK-MANIFEST.json`, `RSH-028-AYALON-LANDMARK-CONTRACT.md`, `AYALON-ASPHALT-MANIFEST.json`, `RSH-029-AYALON-ASPHALT-CONTRACT.md`, `HERO-CAR-MANIFEST.json`, `RSH-030-HERO-CAR-CONTRACT.md`, `DAYLIGHT-SKY-MANIFEST.json`, `RSH-031-DAYLIGHT-CONTRACT.md`, `NIGHT-WEATHER-MANIFEST.json`, `RSH-032-NIGHT-CONTRACT.md`, `PHYSICS-CALIBRATION-MANIFEST.json`, `RSH-033-PHYSICS-CONTRACT.md`, `AUDIO-HUD-INPUT-MANIFEST.json`, `RSH-034-AUDIO-HUD-CONTRACT.md` and `REPOSITORY-GOVERNANCE.md` control program state.

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
9. The owner instruction of 5 September 2026 authorises continuous serial execution and additional improvement planning/repairs. RSH-036 is active; RSH-037–067 are authorised but not activated until predecessor acceptance.
10. This standing grant does not authorise public distribution, fabricated evidence, force pushes, history rewrite or unvalidated acceptance.

## 5. Actual verified program state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 35 |
| In review | 1 |
| Eligible | 0 |
| Authorised, not activated | 31 |
| Remaining | 32 |
| Queue head | RSH-036 — in review |
| Active PR | #39 |
| RSH-035 one-unit authority | 1/1 — consumed |
| Release gates green | 0/13 |
| Findings OPEN / MITIGATED / CLOSED | 12 / 8 / 22 |

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

RSH-021 through RSH-035 are accepted on validated merge. Save schema version 3 and the deterministic 0→1→2→3 migration graph remain unchanged. Production builds stay exactly `vite build`. Ayalon V1 remains a fictional one-carriageway highway (id `ayalon`, width 28, 8 lanes of 3.5, 27 hashed spline samples, 50 interchange ramps, 8 open checkpoints, 9 inspired POIs, baked 8-lane asphalt, no sidewalks, 6 gantries). Daylight stays the live `summer14` look with baked `sky-day.png` and tiny non-HDRI PMREM. Night stays look `night` with baked `sky-night.png`, two headlight spots, ten street lamps and four weather specs. Default boot stays day / clear. Driving physics version 7 matches the five fictional 0–100 claims inside a ±15% band without rewriting `cars.ts`. Audio stays Web Audio oscillators with four radio stations; HUD speed is integer km/h from `speed * 3.6`; keyboard/touch/gamepad maps stay the live Version 1 lock. The unique Ayalon golden pack is the 20 non-placeholder frames with owner approval recorded; the four byte-identical HaShalom placeholders stay non-authority. The opposite carriageway stays visual-only. An unvalidated owner freeze and GIS claims remain forbidden. GitHub still does not require production checks through branch settings.

Ghosts remain byte-preserved and assigned outside this repair. The historical RSH-035 grant is consumed. The standing 5 September owner grant now controls execution. RSH-036 must complete CR-02, CR-03 and CR-04 plus exact-head CI before acceptance; existing freeze files are a candidate, not release approval. Approved runtime repairs need explicit regression evidence and preserved historical identities.

## 10. Improvement register r6.2

`MASTER-PLAN-r6.json` retains all 67 original unit IDs/titles, the 42 original findings and the exact eight V1 tracks. It includes 17 audit items and six repair bundles. These overlap existing work and are **not** 17 additional independent bugs or 17 accepted units. The earlier external r6 proposal is non-authoritative: its mismatched unit/track/finding mappings are corrected here and protected by regression tests. The unmodified previous canonical plan is at `docs/history/master-plan-before-r6.1.md`.

| ID | Severity | Finding / improvement | Units | State |
|---|---|---|---|---|
| AUD-01 | P0 | Historical unit boundaries reject the authorised RSH-036 implementation | RSH-036 | candidate_repaired |
| AUD-02 | P0 | Main branch protection is not applied | RSH-008, RSH-063, RSH-064, RSH-065, RSH-066, RSH-067 | open_external |
| AUD-03 | P0 | Public repository visibility conflicts with private product policy | RSH-002, RSH-012, RSH-065, RSH-066, RSH-067 | open_external |
| AUD-04 | P0 | Partial explicit freeze inventory does not prove transitive completeness | RSH-036 | open |
| AUD-05 | P1 | Diagnostic summaries do not establish complete exact-source acceptance evidence | RSH-008, RSH-035, RSH-036, RSH-042, RSH-064, RSH-065, RSH-066, RSH-067 | partially_repaired |
| AUD-06 | P1 | Race startup failures lack bounded recovery; native failed module imports may require a page reload | RSH-036, RSH-046 | candidate_repaired_browser_validation_pending |
| AUD-07 | P1 | Minimap canvas was not mounted; open-route drawing and preview could connect or wrap its endpoints | RSH-036, RSH-044, RSH-049, RSH-051, RSH-053, RSH-055, RSH-057, RSH-059, RSH-061 | candidate_repaired_browser_and_golden_validation_pending |
| AUD-08 | P1 | Timed-record storage acquisition or reading can throw outside the recovery boundary | RSH-036, RSH-046, RSH-063 | candidate_repaired_browser_validation_pending |
| AUD-09 | P1 | PWA error caching, offline recovery and update behavior need complete acceptance | RSH-047, RSH-064 | open |
| AUD-10 | P1 | Real-device GPU, memory and tail-latency evidence is absent | RSH-037, RSH-038, RSH-039, RSH-040, RSH-041, RSH-042, RSH-043 | open |
| AUD-11 | P2 | 125 lint warnings need risk classification rather than blanket suppression | RSH-036, RSH-040, RSH-044, RSH-046 | open |
| AUD-12 | P0 | 66 asset files remain unverified for use and distribution | RSH-011, RSH-012, RSH-065, RSH-066, RSH-067 | open_external |
| AUD-13 | P1 | Catalogue breadth must not substitute for the eight verified V1 tracks | RSH-010, RSH-049, RSH-050, RSH-051, RSH-052, RSH-053, RSH-054, RSH-055, RSH-056, RSH-057, RSH-058, RSH-059, RSH-060, RSH-061, RSH-062 | open |
| AUD-14 | P1 | Current state, future projections and historical approvals are conflated | RSH-001, RSH-003, RSH-036, RSH-063, RSH-064, RSH-065, RSH-066, RSH-067 | candidate_repaired |
| AUD-15 | P0 | Earlier r6 proposal misassigned canonical unit titles, V1 tracks and legacy finding IDs | RSH-036 | candidate_repaired |
| AUD-16 | P1 | Copied hard-coded phase fences cause recurrent transition failures | RSH-036, RSH-037, RSH-063 | partially_repaired |
| AUD-17 | P2 | Partial texture-batch failure and constructor interruption need explicit resource-ownership recovery proof | RSH-036, RSH-040, RSH-046 | open_static_followup |

## 11. Acceptance additions

The original 67-unit order, scope and release gates remain intact. Additional acceptance criteria apply to their existing units; they do not precreate future implementations.

### RSH-036 — Freeze Ayalon and hash all transitive dependencies
- Complete CR-02, CR-03 and CR-04 before accepting a freeze.
- Historical golden bytes and lock generation are not refreshed to hide a regression.

### RSH-037 — Instrument p50, p95, p99, draw calls, triangles and memory
- Collect raw percentile, GPU and memory samples with environment metadata.
- Centralise activation fences without changing historical acceptance evidence.

### RSH-038 — Define quality profiles and dynamic-quality hysteresis
- Test threshold hysteresis and cooldown to prevent oscillation.

### RSH-039 — Set bundle, asset-streaming and cache budgets
- Fail CI on documented bundle/asset/cache budget regressions.

### RSH-040 — Pass 20 race enter-exit cycles without a resource leak
- Prove flat resource ownership after 20 complete race lifecycles.

### RSH-041 — Pass WebGL context-loss and recovery tests
- Exercise repeated WebGL context loss and recovery without data loss.

### RSH-042 — Pass the 30-minute soak test
- Complete an actual uninterrupted 30-minute soak; smoke runs do not substitute.

### RSH-043 — Validate the browser and device support matrix
- Document exact tested browser/OS/device versions, unsupported cases and real-device gaps.

### RSH-044 — Unify keyboard, touch and gamepad input maps
- Test keyboard focus, gamepad disconnect, touch-action, pointer cancellation and orientation.

### RSH-045 — Complete Hebrew RTL, English LTR and the Arabic-scope decision
- Verify mixed Hebrew/English text, numbers, safe areas and language persistence.

### RSH-046 — Complete onboarding, settings, error and recovery flows
- Test initial loading, retries, failed storage, race restart, settings and onboarding errors.

### RSH-047 — Complete PWA, offline, update and manifest behaviour
- Exercise offline-first/return visits, failed fetches, cache status, multi-tab upgrades and rollback.

### RSH-048 — Pass accessibility, privacy and Alpha UX gates
- Keyboard and screen-reader checks; explicit privacy/retention/consent decisions; no unapproved telemetry.

### RSH-049 — Rothschild geometry and driving
- Independent driving/geometry validation on this exact canonical track.

### RSH-050 — Rothschild art, golden and freeze
- Unique art/golden approval, dependency closure, resource budgets and track-specific freeze proof.

### RSH-051 — Yarkon–Reading geometry and driving
- Independent driving/geometry validation on this exact canonical track.

### RSH-052 — Yarkon–Reading art, golden and freeze
- Unique art/golden approval, dependency closure, resource budgets and track-specific freeze proof.

### RSH-053 — Jaffa geometry and driving
- Independent driving/geometry validation on this exact canonical track.

### RSH-054 — Jaffa art, golden and freeze
- Unique art/golden approval, dependency closure, resource budgets and track-specific freeze proof.

### RSH-055 — Jerusalem–Scopus geometry and driving
- Independent driving/geometry validation on this exact canonical track.

### RSH-056 — Jerusalem–Scopus art, golden and freeze
- Unique art/golden approval, dependency closure, resource budgets and track-specific freeze proof.

### RSH-057 — Haifa–Carmel geometry and driving
- Independent driving/geometry validation on this exact canonical track.

### RSH-058 — Haifa–Carmel art, golden and freeze
- Unique art/golden approval, dependency closure, resource budgets and track-specific freeze proof.

### RSH-059 — Ramon geometry and driving
- Independent driving/geometry validation on this exact canonical track.

### RSH-060 — Ramon art, golden and freeze
- Unique art/golden approval, dependency closure, resource budgets and track-specific freeze proof.

### RSH-061 — Hermon geometry and driving
- Independent driving/geometry validation on this exact canonical track.

### RSH-062 — Hermon art, golden and freeze
- Unique art/golden approval, dependency closure, resource budgets and track-specific freeze proof.

### RSH-063 — Establish SemVer, changelog and release automation
- Versioned changelog and ADRs; dependency/licence re-review; regressions and evidence traceability.

### RSH-064 — Establish preview, staging, production and rollback
- Private preview/staging/production separation; successful rollback plus offline update coverage.

### RSH-065 — Publish and evaluate `v0.1.0-alpha.1`
- Private owner-controlled alpha only; all applicable evidence and licensing gates pass.

### RSH-066 — Produce RC1 and close all blocking defects
- Triage all open blockers; stable browser/device regression matrix and no unresolved P0/P1 release defects.

### RSH-067 — Publish `v1.0.0` with signed tag, dossier and rollback proof
- Private owner-controlled v1 only; signed tag, complete licence/evidence dossier and verified rollback.

## 12. Immediate checkpoint

1. Validate and publish the control-boundary repair and this plan on PR #39. Preserve 35 accepted / 32 remaining until the unit actually merges.
2. Complete CR-03 dependency-closure proof and CR-04 loading/minimap/records repairs; reproduce each defect with regression tests and preserve historical evidence.
3. Re-run exact-head lint, all tests, self-starting browser QA, build and applicable golden/freeze checks. Resolve blocking reviews before merge.
4. Only after verified RSH-036 acceptance activate RSH-037. Continue serially under the standing grant, without asking again to add improvements.

A session ends with a saved exact-head checkpoint, actual tests, open blockers and accepted/remaining counts. No future scheduled/background execution is implied. Administrative restrictions, device access and asset permissions remain explicit blockers rather than fabricated completion.

## r6.2 — Runtime repair checkpoint (5 September 2026)

All 67 original units and 42 historical findings remain; 17 overlapping audit items and six repair bundles are mapped in `MASTER-PLAN-r6.json`. Accepted 35/67; remaining 32; active RSH-036 only.

The candidate fixes structured records read denial/no-overwrite recovery, cancellable race startup with a reload option for native module failure, same-document asset retry, an accessible mounted minimap, open-route endpoint/preview behavior and explicit CI checkout identity. The local complete suite passes 567/567, including 62 additional test cases over the verified 505-case base. Browser/locked-dependency CI is required before claiming those gates passed.

The unaccepted freeze candidate no longer says `freeze_granted=true`: code and manifest now say false. Its 41 explicit source hashes are still a partial inventory. CR-03 closure proof, unchanged-golden visual acceptance and AUD-17 partial texture/constructor resource ownership remain open. Prior accepted byte identities are independently reconstructed using exact pinned reverse deltas; current code hashes and behavior have separate mandatory checks. No golden baseline or historical approval is rewritten.

The next implementation scope is full dependency closure and resource ownership verification, then exact-head visual/freeze acceptance. Do not activate RSH-037 before RSH-036 acceptance. See `RSH-036-RUNTIME-REPAIR-r6.2.md` for this checkpoint and exact evidence limits.

## r6.3 — resource failure recovery and retained visual blocker

`RSH-036-RUNTIME-REPAIR-r6.3.md` supersedes the r6.2 execution checkpoint, not
historical acceptance evidence. Road loading now has transactional rollback and
per-lane request deduplication; renderer and engine constructors release resources
when ownership transfer fails. Preparation has 18/18 new resource tests and a
1-pass/5-failure reproduction against the previous road loader. Four additional
browser cases must pass on the published exact head.

Read-only two-version investigation confirms persistent black rothschild rendering
predates r6.2; the individual-mesh bisection is inconclusive. Resolve it before
visual acceptance. Review analogous batch asset loaders. The 44-path inventory is
still partial and does not grant a freeze. All 67 original units, 42 historical
findings, 17 audit IDs and six repair bundles are preserved. Accepted 35/67;
remaining 32; RSH-036 stays active and RSH-037 stays inactive.


## r6.4 — water-clock repair and mandatory visual evidence

The active queue is unchanged: 35/67 accepted, 32 remaining; RSH-036 only.
All 67 original units, 42 historical findings and six repair bundles remain.
AUD-18 is the eighteenth audit item: the reproduced Ayalon night-switch crash.
Water materials now carry their own base colour, including the procedural canal;
clock updates no longer index the catalogue-water array. The prior regular-water
clock formula is retained. Direct tests cover 100 cycles, idempotence, multiple
materials, an empty registry and invalid input; three real-engine cases are added
to the normal browser gate. Historical world bytes remain independently checked.

Read `RSH-036-RUNTIME-REPAIR-r6.4.md` and the latest PR evidence. The 45-file freeze
inventory is still partial. The four original golden comparisons, persistent
rothschild black scene, dependency closure and analogous asset batches remain
acceptance blockers until independently validated. A new green normal-CI result
must not erase a failing golden result. Never refresh baselines to hide a defect.

## r6.4 continuation — Rothschild full-scene recovery

Read-only run33992134755 linked the black scene to a single live canopy draw with
1152 instances but only960 matrix slots. Temporary diagnostic count capping
restored lit pixels and restoring the invalid count reproduced black rendering.
The product correction allocates1536 slots for128 trees ×12 canopy components.
It retains the intended96-tree/1152-canopy scene and does not hide any geometry.
Four new bounded-storage regressions and an actual engine capacity/pixel gate
are included; the existing closed-route HUD case now also checks interior scene
pixels. Remote candidate validation is still required. This repair belongs to
existing AUD-13 and RSH-036, not activation or acceptance of a later track unit.
The explicit source inventory is46 paths, still partial. Eight asset families
remain unrepaired; all four original golden comparisons remain blocking failures.


## r6.5 — 6 September 2026: transactional asset-cache repairs

Active unit remains RSH-036, accepted35/67, remaining32; RSH-037 is inactive.
All eight batch families from the preserved RSH-036-ASSET-BATCH-REVIEW.json now
have atomic single-flight caches and complete rollback/retry tests. No partially
loaded Map is published. Unpublished GLTF rollback owns geometries, materials,
textures and bitmap resources; accepted process-owned caches stay alive.
The same48 regression cases produced5 pass/43 failures on r6.4 and48/48 after
repair;5 helper cases pass separately. Locked CI and8 actual asset-browser
cases must run on the new exact head before any validation claim.

Golden provenance: the four pixel images originate at b0e3e525 (26 August2026).
Run scripts/golden-provenance.mjs with full Git history and retain its byte-level
report. This is not proof that a particular refactor caused the differences.
No baselines, thresholds or acceptance histories are rewritten. Generated
dependency closure and all four original visual comparisons remain blockers.
See MASTER-PLAN-r6.json and RSH-036-RUNTIME-REPAIR-r6.5.md.

## r6.6 — 2026-09-06: reliable capture and generated local dependency closure

Live r6.5 baseline is8c6a3be7 (688 unit/20 browser cases), not the alternate local
716-test attachment. Retain all67 units,18 audit IDs,42 findings and6 bundles.
Golden selection now requires hydration and a ticking correct engine. Baselines,
pixel thresholds and camera/timing recipe stay unchanged; failure evidence persists.
CR-03 now includes a machine-generated whole-local-surface inventory and module
graph with drift/added/removed-input enforcement. Remote references and mutable
action tags still require qualification. See NEXT-CONTRACT20.5 and the r6.6 report.
No unit acceptance, freeze grant, release or RSH-037 activation is implied.

## r6.7 — Safe capture writers and immutable CI actions

Both golden commands now protect canonical baselines, reject linked file targets and
write diagnostics exclusively. Legacy capture defaults to artifacts/ayalon-capture;
GOLDEN_OUTPUT is the explicit non-authority output override. Captures are not passed
comparisons. Three official CI action refs are pinned to verified commit identities;
seven font/host qualifications remain open. Preserve all original 67 units, 42 legacy
findings, 18 audit IDs and six repair bundles. RSH-036 remains unaccepted at 35/67.
Read RSH-036-RUNTIME-REPAIR-r6.7.md and the latest exact-head PR evidence before resuming.


## r6.9 — font evidence and controlled visual factors (2026-09-06)

The merged-unit count remains 35/67. FontFaceSet settlement is no longer the only
font diagnostic: capture metadata records actual faces, and separate browser
probes measure platform glyph usage with stylesheet/binary denial. Remote fonts
remain mutable; fallback success does not close visual or dependency acceptance.

Controlled source/assets x camera experiments provide pairwise pixel measurements
with repeated restoration controls. No rendering/gameplay or original PNG bytes
are changed to match old references. The original golden gate remains mandatory.
Read MASTER-PLAN-r6.json, NEXT-CONTRACT.md and the exact-head PR checkpoint.


## r6.10 — Road material consistency (2026-09-06)

AUD-19 records a reproduced shader-lifecycle defect. Preserve the active weather
uniform before compilation and across cached programs instead of resetting the
road to dry. Real WebGL and Ayalon transition cases are required before acceptance.
The plan retains 67 units, 42 historic findings and six repair bundles; audit items
now total 19. RSH-036 remains unaccepted at 35/67. Neutral-illumination and opaque
normal geometry controls are diagnostic, never replacement golden authority.
See RSH-036-RUNTIME-REPAIR-r6.10.md and the latest exact-head PR checkpoint.

## r6.11 — RSH-036 ramp surface/physics conformance (2026-09-06)

The owner-authorised repair program retains all 67 units and 42 historical
findings; AUD-20 raises the supplementary audit register to 20 items, with six
existing repair bundles. RSH-036 remains unaccepted: 35/67 accepted, 32 remaining.

AUD-20 corrects the visual realization, not the accepted ramp recipe. Pitching a
centred box changes its projected footprint and leaves its top above the physics
plane. Sheared slabs preserve horizontal length/width and match y0/y1. Edge strips
follow that plane; piers stop below the surface. All 50 recipes, collision counts,
checkpoint fractions, driving code and original reference images remain unchanged.

Acceptance requires real mesh/raycast/strip/support measurements, old-source
negative controls, exact-head normal CI and the unchanged original golden gate.
The three mutable font dependencies and any image-reference transition remain
separate unresolved gates. No baseline refresh, freeze, merge or RSH-037 activation.


## r6.12 — overhead contact repair, RSH-036 still blocked

AUD-21: reject unreachable ramp surfaces above the vehicle while retaining the existing1.2-unit entry allowance. Contact checks cover the actual car and both centre/wheel queries; the legacy ramp-following smoke starts at its intended surface rather than requiring a teleport through the deck. All50 ramp recipes, calibrated physics constants, original PNGs and thresholds remain preserved. This changes vehicle support selection, not acceleration calibration.

67 original units;35 accepted;32 remaining.21 audit items;42 historical findings;6 repair bundles. RSH-036 remains active/unaccepted. Roof/body clearance, low crossings, downward/airborne attachment behavior, art/material discrepancies and3 mutable font references remain open. No reference transition, merge, freeze or RSH-037 activation.


## r6.13 — bidirectional contact repair and retained acceptance hold (2026-09-07)

The r6.12 upward-only repair is explicitly partial: raw traces measured25 downward
snaps, including seven newly regressed starts479-485. AUD-21 now includes nearer
main-road selection, coherent centre/wheel deck queries, and gravity-driven descent
instead of instant attachment or an altitude clamp. Supported slopes and reachable
upward entry remain covered; no geometry or handling constants change.

Acceptance must validate781 starts in both directions,250 supported probes, seven
moving trajectories, airborne ascent/descent/landing, and the original golden gate.
The complete raw contact trace is retained in normal CI, not only a green summary.
Body/roof clearance, support-column collision, reference/art review, three mutable
font dependencies and record/physics-version policy remain open before freeze.

67 original units;35 accepted;32 remaining.21 audit items,42 historical findings,
6 bundles. No merge, freeze, new image authority or RSH-037 activation. Read
RSH-036-RUNTIME-REPAIR-r6.13.md together with the final exact-head PR checkpoint.


## Historical candidate1/2 driving validation hold (superseded only by evidence below)
Initial locked preparation34071681721 passed941 units, all781 bidirectional route
starts (25->0 downward snaps),250 supported probes and1680 moving steps, then
FAILED the unchanged combined driving sequence. Later runtime/build/golden steps
were skipped. This is retained failed evidence, not an accepted preparation.

Controlled run34072084083 repeats that exact sequence3 times per revision: old3/3
passes; candidate3/3 failures. Candidate right-steering starts off-track at speed
1.0873345987477152 and ends reversing at-0.25944739361439206 after an earlier
impact. Its direction sign is not a forward-steering measurement. The impact and
lateral-drift behavior are not declared fixed, random or unchanged.

The revised smoke retains the original200m straight corridor and separately
measures both directions after independent reset/warmup. Every steering sample
must remain forward at>=12, grounded, on-track, without impact and with crawl mix
<=.001; wrapped angular threshold0.03 is unchanged.12 new harness fixtures test
these strict preconditions; they are not real vehicle cases. Browser cleanup and
raw result retention are guaranteed on failures. Full locked QA must run again.

Read RSH-036-DRIVING-REVIEW-r6.13.json and retain the original failed-sequence hold
for traffic/impact/evasive qualification before freeze. Isolated steering success
does not make that combined sequence pass. No acceptance or golden waiver.


## r6.13 candidate3 — grade-direction correction; earlier failures retained
Candidate2 run34072958959 passed956 units, both independent forward steering
checks and bidirectional route/motion probes, but FAILED the unchanged acceleration
regression for4/5 cars. Runtime/build/golden steps after that failure were skipped.
This is a real discovered interaction, not a new baseline or a passing workflow.

AUD-22 identifies full ramp slope being applied to perpendicular travel, plus
velocity-sign dependence of signed body gravity. Force and pitch now use the ramp
height derivative projected onto body-forward. Coefficients16.2/7.4, uphill
threshold0.04, pitch3.4, gravity18 and all car/launch calibration bytes are unchanged.
Sixteen real-car unit cases produced2 passes/14 failures before,16 passes after.
Local controlled simulation restores all five acceleration times within the
unchanged0.1-second regression band; it is not locked browser acceptance.

The original combined driving sequence and BOTH unchanged signed0.03 assertions
are restored as mandatory, in addition to the12-sample independent forward checks.
No combined-sequence waiver remains. Failed candidate1 and candidate2 evidence
is retained in the driving/grade reports. Candidate3 full locked QA, exact-head
source verification, retained runtime and original-golden checks remain pending.

Master plan retains67 units,42 historical findings,6 bundles;22 audit items after
AUD-22. Missing reverse mappings AUD-18/AUD-21 to RSH-036 were reconciled.35 units
remain accepted and32 remaining. Body/roof/column clearance, complete traffic and
airborne behavior, art/immutable fonts and physics/record-version policy remain
open; a passed sampled trace is not freeze/release/device acceptance.


### r6.13 continuation — AUD-23, 7 September 2026
Physics-clock airborne validation replaces misleading wall-time sampling without
increasing the simulation budget. Retain the contact and projected-grade repairs,
original combined driving sequence, unchanged acceleration/visual gates and all
failed preparations. Total:67 units;35 accepted;32 remaining;23 audit items;42
historical findings;6 bundles. Full final-candidate and published-head CI pending.
Low rendering throughput remains open, not fixed by deterministic test stepping.

## r6.14 — 8 September 2026

AUD-24 repairs skipped circular centre penetrations, with22 actual-car and10
report-validator tests plus real-catalogue browser checks. Previous r6.13
exact-head support, grade and landing validation is reconciled as completed,
not unit acceptance. All67 units,42 legacy findings,6 bundles and24 audit IDs
are retained. Complete clearance, physics/record compatibility, mutable fonts
and original-golden acceptance remain blocked. No RSH-037 activation.

## r6.15 — 9 September 2026: finite-height support-pier contacts

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-25 binds every
visible Ayalon support to a conservative finite-height circular obstacle, preserving
all546 legacy entries. Explicit1.6-unit car-height proxy and1.05 horizontal padding
are not a full pitched/rolled mesh envelope or multi-obstacle clearance guarantee.
The complete suite, actual route probes, original golden and immutable-font gates
remain mandatory. Do not merge, replace PNGs, change thresholds or activate RSH-037.
Details: RSH-036-PIER-REVIEW-r6.15.json and RSH-036-RUNTIME-REPAIR-r6.15.md.

## r6.16 — 9 September 2026: pitched/rolled envelope, slab and multi-obstacle exit

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-26 adds an
8-corner pitch/roll envelope, ceiling-versus-solid slab contact and a combined
exit for overlapping circles. Rest-pose height stays 1.6; the 1.05 radius and
historical single-collider +X coincidence are unchanged. This is still an arcade
box, not a mesh or route qualification. Complete suite, original golden and
immutable-font gates remain mandatory. Do not merge, replace PNGs, change
thresholds or activate RSH-037.
Details: RSH-036-ENVELOPE-REVIEW-r6.16.json and RSH-036-RUNTIME-REPAIR-r6.16.md.

## r6.17 — 9 September 2026: whole-route envelope clearance and v7 record lock

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-27 samples the
live Ayalon catalogue with the r6.16 arcade envelope: 781 centerline rest poses,
±2.2 lane samples, four-car grid versus 722 colliders, 9.4 underpass probes and
a 1-second centerline drive. Supports that sat on a climbing connector are
offset to the carriageway edge plus contact radius; 176 piers, 546 legacy
colliders, 50 ramps and 8 checkpoints stay counted. physicsVersion 7 records
load without conversion; version 6 rows are dropped. This is still not a mesh
or every-tick race qualification. Complete suite, original golden and
immutable-font gates remain mandatory. Do not merge, replace PNGs, change
thresholds or activate RSH-037.
Details: RSH-036-ROUTE-REVIEW-r6.17.json and RSH-036-RUNTIME-REPAIR-r6.17.md.

## r6.18 — 9 September 2026: Chromium install without Google Chrome apt abort

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-28 records
exact-head required CI 34385617080 failing at Playwright `--with-deps` on a
Google Chrome apt hash-sum mismatch before any product test. The installer now
falls back to the Playwright CDN binary. Ordinary install failures still fail.
continue-on-error stays forbidden. Complete suite, original golden and
immutable-font gates remain mandatory. Do not merge, replace PNGs, change
thresholds or activate RSH-037.
Details: RSH-036-CI-REVIEW-r6.18.json and RSH-036-RUNTIME-REPAIR-r6.18.md.

## r6.19 — 9 September 2026: offset supports meet the slab underside

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-28 Chromium
install succeeded on exact-head 34387082287 (1,142 units) and is retained as
an overall FAILURE: 8 ramp supports protruded (max 1.9346875033714142). AUD-29
sets pier height from the slab at the placed XZ. 176 piers, 546 legacy
colliders, 50 ramps and 8 checkpoints stay counted. Exact-head required CI
34389785192 later passed 1,149/1,149 with maxProtrusion 0; that PASS is not
freeze or original-golden acceptance. Complete suite, original golden and
immutable-font gates remain mandatory. Do not merge, replace PNGs, change
thresholds or activate RSH-037.
Details: RSH-036-SUPPORT-REVIEW-r6.19.json, RSH-036-RUNTIME-REPAIR-r6.19.md and
docs/evidence/r6.19-published-ci-verification.json.

## r6.20 — 10 September 2026: pin product font URLs without distributing files

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-30 pins the
three Heebo/Noto product URLs and forbids vendored font files. Remote CDN
bytes stay unpinned; complete_dependency_closure and freeze_granted stay
false. Original CSS typography is unchanged. Exact-head CI, original golden
0/4, rendering performance and freeze remain open. Do not merge, replace PNGs,
change thresholds or activate RSH-037.
Details: RSH-036-FONT-REVIEW-r6.20.json and RSH-036-RUNTIME-REPAIR-r6.20.md.

## r6.21 — 10 September 2026: restore original rest chase without adapter drift

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-31 restores
live rest chase to follow 7.4 + clamp(speed/22, 0, 2.2) and height 1.92. The
accepted 9.2/2.28 adapter bytes stay behind the overlay. Exact-head required
CI 34445990921 passed 1,167/1,167; that PASS is not freeze or original-golden
acceptance. Original golden 0/4, immutable CDN bytes, rendering performance
and freeze remain open. Do not merge, replace PNGs, change thresholds or
activate RSH-037.
Details: RSH-036-CHASE-REVIEW-r6.21.json, RSH-036-RUNTIME-REPAIR-r6.21.md and
docs/evidence/r6.21-published-ci-verification.json.

## r6.22 — 10 September 2026: complete Ayalon arcade lap

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-32 drives a
complete open lap with production AI, 120 Hz steps and consumeCheckpoints.
The r6.17 120-step / 1.62 m drive fails closed as complete-race qualification.
A live 722-collider probe finished in 10,595 steps (progress 0.960,
lastCheckpoint 7, buried 0, respawns 0). 176 piers, 546 legacy colliders,
50 ramps, rest-pose 1.6 and the 1.05 radius stay. This is still not a
render-mesh. Original golden 0/4, immutable CDN bytes, rendering performance
and freeze remain open. Do not merge, replace PNGs, change thresholds or
activate RSH-037.
Details: RSH-036-RACE-REVIEW-r6.22.json, RSH-036-RUNTIME-REPAIR-r6.22.md and
docs/evidence/r6.21-published-ci-verification.json.

## r6.23 — 10 September 2026: visual-mesh Ayalon clearance

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-33 tests
the live car-mesh hull, not the 1.05 arcade circle. Visual half-length is
2.17–2.54 versus arcade 1.25. A 1.6 m front pole is missed by the arcade
circle and hit by every hull. Live 722-collider rest poses and 160 yawed
AI samples reported 0 visual hits. Freeze path count stays 85. Original
golden 0/4, immutable CDN bytes, rendering performance and freeze remain
open. Do not merge, replace PNGs, change thresholds or activate RSH-037.
Details: RSH-036-MESH-REVIEW-r6.23.json and RSH-036-RUNTIME-REPAIR-r6.23.md.

## r6.24 — 10 September 2026: original golden protocol after chase restore

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-34 runs the
original pixel-golden protocol. Required-ci capture is non-authority
(comparisons 0). PNG bytes last changed 26 August 12:00:42Z, 85 minutes before
spaghetti ramps. Live comparison after the 7.4/1.92 restore: 0/4
(61.58 / 50.56 / 31.22 / 64.73%). Freeze path count stays 85. Immutable CDN
bytes, rendering performance and freeze remain open. Do not merge, replace
PNGs, change thresholds or activate RSH-037.
Details: RSH-036-GOLDEN-REVIEW-r6.24.json, RSH-036-RUNTIME-REPAIR-r6.24.md and
docs/evidence/r6.23-published-ci-verification.json.

## r6.25 — 10 September 2026: rest-camera attribution after chase restore

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-35 measures
live rest chase after snapCamera(true). The r6.8 0.36/1.8 camera delta and
HUD-on-black page captures fail closed as post-restore scene evidence. Live
camera matches historical 7.4/1.92 at g01/g05/g07/g08; WebGL buffers are lit.
Remaining original-golden 0/4 is world (50 ramps / 722 colliders vs historical
32/541). Freeze path count stays 85. Immutable CDN bytes, rendering
performance and freeze remain open. Do not merge, replace PNGs, change
thresholds or activate RSH-037.
Details: RSH-036-GOLDEN-ATTRIBUTION-r6.25.json and RSH-036-RUNTIME-REPAIR-r6.25.md.

## r6.26 — 10 September 2026: world-layer isolation after catalogue attribution

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-36 isolates
live world layers after snapCamera(true). Catalogue 50/722 without layer samples
fails closed as pixel attribution. Classified membership is 50 decks / 100
strips / 176 piers. g07 ramps contribute 69% of samples; g05 and g08 ramps
contribute 0%; other meshes dominate three of four poses. Camera stays 7.4/1.92.
Freeze path count stays 85. Immutable CDN bytes, rendering performance and
freeze remain open. Do not merge, replace PNGs, change thresholds or activate
RSH-037.
Details: RSH-036-WORLD-LAYER-r6.26.json, RSH-036-RUNTIME-REPAIR-r6.26.md and
docs/evidence/r6.24-published-ci-verification.json.

## r6.27 — 10 September 2026: physical-material water is not water

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-37 isolates
named residual layers after snapCamera(true). Physical-material-only water
labels fail closed. Live ior-water is 1 mesh and carriageway is 2; both
contribute 0% of samples. Ground dominates g05 and g08 (51%). g07 remains
ramp-dominated (69%). Residual 695 stays an unnamed leftover. Camera stays
7.4/1.92. Freeze path count stays 85. Immutable CDN bytes, rendering
performance and freeze remain open. Do not merge, replace PNGs, change
thresholds or activate RSH-037.
Details: RSH-036-WORLD-RESIDUAL-r6.27.json, RSH-036-RUNTIME-REPAIR-r6.27.md and
docs/evidence/r6.26-published-ci-verification.json.

## r6.28 — 10 September 2026: live contribution is not golden mismatch

RSH-036 / PR39 remains unaccepted (35/67 accepted;32 remain). AUD-38 restores
the r6.27 smoke import of verifyWorldLayers and isolates live PNG mismatch
after snapCamera(true). Live changedFraction (ground 51%) is not original-golden
mismatch. 7×7 vs locked PNG: g01 49/49, g05 49/49, g07 48/49, g08 48/49. No
named layer reduces mismatch when hidden. Camera stays 7.4/1.92. Freeze path
count stays 85. r6.27 lint no-undef is retained, not relabelled a pass.
Immutable CDN bytes, rendering performance and freeze remain open. Do not
merge, replace PNGs, change thresholds or activate RSH-037.
Details: RSH-036-WORLD-MISMATCH-r6.28.json, RSH-036-RUNTIME-REPAIR-r6.28.md and
docs/evidence/r6.27-published-ci-verification.json.




