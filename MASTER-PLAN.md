> **עדכון 15.10.2026:** מצב ההשלמה הפעיל נמצא ב־[COMPLETION-PLAN.md](COMPLETION-PLAN.md) וב־[PRODUCT-READINESS.json](PRODUCT-READINESS.json). טבלאות ACCEPTED והשערים להלן הן היסטוריה; הן אינן קבלת המוצר הנוכחי או אישור שחרור.

# RUSH Israel — Master Plan and Historical Program Record

**Schema:** 50.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-067 implementation base:** `66afc517c52faff8aa93bb9ee8b1f0c21a92dd2d`
**State effective on:** merge of the RSH-067 pull request
**Active continuation:** MP-001–MP-046 in `COMPLETION-PLAN.md`, authorised by the current user request.
**Historical RSH queue head:** none (archived program ledger only)
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
`ENGINE-ADAPTER-MANIFEST.json`, `GAME-APP-DECOMPOSITION-MANIFEST.json`, `RESOURCE-OWNERSHIP-MANIFEST.json`, `DEPENDENCY-BOUNDARY-MANIFEST.json`, `DEPENDENCY-POLICY.md`, `SAVE-SCHEMA-MANIFEST.json`, `SAVE-RECOVERY-MANIFEST.json`, `RSH-022-SAVE-RECOVERY-CONTRACT.md`, `TIMED-RECORDS-MANIFEST.json`, `RSH-023-TIMED-RECORDS-CONTRACT.md`, `PRODUCTION-SECURITY-MANIFEST.json`, `RSH-024-PRODUCTION-SECURITY-CONTRACT.md`, `AYALON-ACCEPTANCE-MANIFEST.json`, `RSH-025-AYALON-ACCEPTANCE-CONTRACT.md`, `AYALON-GEOMETRY-MANIFEST.json`, `RSH-026-AYALON-GEOMETRY-CONTRACT.md`, `AYALON-COLLIDER-MANIFEST.json`, `RSH-027-AYALON-COLLIDER-CONTRACT.md`, `AYALON-LANDMARK-MANIFEST.json`, `RSH-028-AYALON-LANDMARK-CONTRACT.md`, `AYALON-ASPHALT-MANIFEST.json`, `RSH-029-AYALON-ASPHALT-CONTRACT.md`, `HERO-CAR-MANIFEST.json`, `RSH-030-HERO-CAR-CONTRACT.md`, `DAYLIGHT-SKY-MANIFEST.json`, `RSH-031-DAYLIGHT-CONTRACT.md`, `NIGHT-WEATHER-MANIFEST.json`, `RSH-032-NIGHT-CONTRACT.md`, `PHYSICS-CALIBRATION-MANIFEST.json`, `RSH-033-PHYSICS-CONTRACT.md`, `AUDIO-HUD-INPUT-MANIFEST.json`, `RSH-034-AUDIO-HUD-CONTRACT.md`, `AYALON-GOLDEN-MANIFEST.json`, `RSH-035-AYALON-GOLDEN-CONTRACT.md`, `AYALON-FREEZE-MANIFEST.json`, `RSH-036-AYALON-FREEZE-CONTRACT.md`, `PERF-INSTRUMENT-MANIFEST.json`, `RSH-037-PERF-INSTRUMENT-CONTRACT.md`, `QUALITY-PROFILES-MANIFEST.json`, `RSH-038-QUALITY-PROFILES-CONTRACT.md`, `PERF-BUDGETS-MANIFEST.json`, `RSH-039-PERF-BUDGETS-CONTRACT.md`, `LEAK-CYCLES-MANIFEST.json`, `RSH-040-LEAK-CYCLES-CONTRACT.md`, `CONTEXT-LOSS-MANIFEST.json`, `RSH-041-CONTEXT-LOSS-CONTRACT.md`, `THIRTY-SOAK-MANIFEST.json`, `RSH-042-THIRTY-SOAK-CONTRACT.md`, `DEVICE-MATRIX-MANIFEST.json`, `RSH-043-DEVICE-MATRIX-CONTRACT.md`, `INPUT-MAPS-MANIFEST.json`, `RSH-044-INPUT-MAPS-CONTRACT.md`, `RTL-SCOPE-MANIFEST.json`, `RSH-045-RTL-SCOPE-CONTRACT.md`, `ONBOARDING-MANIFEST.json`, `RSH-046-ONBOARDING-CONTRACT.md`, `PWA-MANIFEST.json`, `RSH-047-PWA-CONTRACT.md`, `A11Y-MANIFEST.json`, `RSH-048-A11Y-CONTRACT.md` , `ROTHSCHILD-GEOMETRY-MANIFEST.json`, `RSH-049-ROTHSCHILD-CONTRACT.md` , `ROTHSCHILD-GOLDEN-MANIFEST.json`, `RSH-050-ROTHSCHILD-GOLDEN-CONTRACT.md` , `NAMAL-GEOMETRY-MANIFEST.json`, `RSH-051-NAMAL-CONTRACT.md` , `NAMAL-GOLDEN-MANIFEST.json`, `RSH-052-NAMAL-GOLDEN-CONTRACT.md` , `JAFFA-GEOMETRY-MANIFEST.json`, `RSH-053-JAFFA-CONTRACT.md` , `JAFFA-GOLDEN-MANIFEST.json`, `RSH-054-JAFFA-GOLDEN-CONTRACT.md` , `SCOPUS-GEOMETRY-MANIFEST.json`, `RSH-055-SCOPUS-CONTRACT.md` , `SCOPUS-GOLDEN-MANIFEST.json`, `RSH-056-SCOPUS-GOLDEN-CONTRACT.md` , `HAIFA-GEOMETRY-MANIFEST.json`, `RSH-057-HAIFA-CONTRACT.md` , `HAIFA-GOLDEN-MANIFEST.json`, `RSH-058-HAIFA-GOLDEN-CONTRACT.md` , `RAMON-GEOMETRY-MANIFEST.json`, `RSH-059-RAMON-CONTRACT.md` , `RAMON-GOLDEN-MANIFEST.json`, `RSH-060-RAMON-GOLDEN-CONTRACT.md` , `HERMON-GEOMETRY-MANIFEST.json`, `RSH-061-HERMON-CONTRACT.md` , `HERMON-GOLDEN-MANIFEST.json`, `RSH-062-HERMON-GOLDEN-CONTRACT.md` , `SEMVER-RELEASE-MANIFEST.json`, `RSH-063-SEMVER-RELEASE-CONTRACT.md` , `PREVIEW-STAGING-MANIFEST.json`, `RSH-064-PREVIEW-STAGING-CONTRACT.md` , `ALPHA-PUBLISH-MANIFEST.json`, `RSH-065-ALPHA-PUBLISH-CONTRACT.md` , `RC1-MANIFEST.json`, `RSH-066-RC1-CONTRACT.md` , `V1-PUBLISH-MANIFEST.json`, `RSH-067-V1-PUBLISH-CONTRACT.md` and `REPOSITORY-GOVERNANCE.md` control program state.

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
9. The standing owner instruction to finish the master plan authorised remaining deferred units serially. RSH-067 is consumed on validated merge; none is not authorised until that merge.

## 5. Current product state versus historical program acceptances

| Metric | Current interpretation |
|---|---|
| Historical RSH artifact acceptances | 67; preserved as historical program evidence |
| Fully accepted current product units | **0/67** |
| Current release readiness | **false**; see `PRODUCT-READINESS.json` |
| Remaining RSH product acceptance | **67 units require full or partial revalidation** |
| Active completion work | MP-001–MP-046, preserving the existing dependency graph |
| Observed main | `b2c0d46dd43c3bd8f27dc0009e4809c27c54c60e` |
| PR 83 | open at `6395474913c071cb25bc2720238a7b8072045288` |
| Completion branch | `fix/rush-completion-2026-10-15` |

## 6. Historical stage map (artifact acceptance, not product completion)

| Stage | Units | Count | Purpose | Historical artifact state |
|---|---:|---:|---|---|
| G0 | RSH-001–003 | 3 | Control and governance | ACCEPTED |
| G1 | RSH-004–008 | 5 | Reproducible toolchain and CI | ACCEPTED; live `main` protected |
| G2 | RSH-009–012 | 4 | Scope, licensing and assets | ACCEPTED |
| G3 | RSH-013–020 | 8 | Architecture decomposition | ACCEPTED |
| G4 | RSH-021–024 | 4 | Data integrity and production security | ACCEPTED |
| G5 | RSH-025–036 | 12 | Ayalon vertical slice | ACCEPTED |
| G6 | RSH-037–043 | 7 | Performance and reliability | ACCEPTED |
| G7 | RSH-044–048 | 5 | UX, accessibility and mobile | ACCEPTED |
| G8 | RSH-049–062 | 14 | Seven additional MVP tracks | ACCEPTED |
| G9 | RSH-063–067 | 5 | Release | ACCEPTED |

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

## 8. Active release gates — 15 October 2026

All gates must be evidenced on the same final candidate before release. Local code checks, a settings observation and a historical artifact acceptance do not establish a released product.

| # | Gate | Current evidence state |
|---|---|---|
| 1 | licensing | **not-done** — 66 unverified image assets; source/creator/licence evidence required. |
| 2 | main protection | **verified-settings** — Live ruleset 23177340 is active and requires strict required-ci / validate, PRs, no bypass, no deletion or force push. |
| 3 | clean clone and build | **partial** — Clean f03d13f clone: npm ci --offline --no-audit and production build without QA hooks passed. Latest patched dependencies also install and build; final-head hosted verification pending. |
| 4 | CI | **partial** — Current-source unit/build/security and historical jobs passed on earlier development commits. Replaced runs were cancelled; complete required-ci / validate on the final PR head is not yet verified. |
| 5 | secrets | **partial** — Local tracked-source scan passed; repeat on staged final source and bind to final commit. |
| 6 | Ayalon freeze | **not-done** — Low Ayalon ramps and on-road supports were corrected and visually rechecked. All real-world clearance checks pass; owner golden/still acceptance is still absent. |
| 7 | driving | **partial** — Eight assisted browser V1 races reached result UI on f03d13f, without official records/stars. New current-source condition/restart UI test passed. Heavy damage and human playability acceptance remain open. |
| 8 | desktop p95 | **not-done** — Named physical Windows device, exact build and raw measurements unavailable. |
| 9 | mobile p95 | **not-done** — Named physical mobile device, exact build, thermal and raw measurements unavailable. |
| 10 | 30-minute soak | **pending** — Earlier immutable r2 soak passed 1800 seconds with 15 completed races and zero off-road ratio; it predates current runtime. A newer intermediate snapshot run was explicitly stopped after replacement. Clean f03d13f soak is running separately. Final-head required-CI soak remains pending; no earlier result accepts the final candidate. |
| 11 | save | **partial** — Current record-class roundtrips tested; current migration/recovery and owner save acceptance pending. |
| 12 | accessibility and legal | **not-done** — WCAG AA, canvas accessibility, privacy and licence acceptance unavailable; A11Y_COMPLETE=false. |
| 13 | signed release tag | **not-done** — Version is 0.0.0-private; signed tag, private staging, Alpha, RC and rollback evidence unavailable. |

The earlier 8/13 GREEN claims have been preserved in `evidence/2026-10-15/historical-release-gate-claims.md`, not carried forward as acceptance. The original claim “soak runs inside npm test” described invocation, not successful driving or final-source proof. The current workflow makes the full driving soak an explicit required job.

## 9. Historical execution boundary — superseded for changed runtime

The following paragraph records prior program claims. It does not grant a new freeze, owner approval or current release acceptance. RSH-021 through RSH-036 were accepted as artifacts on validated merge. Save schema version 3 and the deterministic 0→1→2→3 migration graph remain unchanged. Production builds stay exactly `vite build`. Ayalon V1 remains a fictional one-carriageway highway (id `ayalon`, width 28, 8 lanes of 3.5, 27 hashed spline samples, 50 interchange ramps, 8 open checkpoints, 9 inspired POIs, baked 8-lane asphalt, no sidewalks, 6 gantries). Daylight stays the live `summer14` look with baked `sky-day.png` and tiny non-HDRI PMREM. Night stays look `night` with baked `sky-night.png`, two headlight spots, ten street lamps and four weather specs. Default boot stays day / clear. Driving physics version 7 matches the five fictional 0–100 claims inside a ±15% band without rewriting `cars.ts`. Audio stays Web Audio oscillators with four radio stations; HUD speed is integer km/h from `speed * 3.6`; keyboard/touch/gamepad maps stay the live Version 1 lock. The unique Ayalon golden pack is the 20 non-placeholder frames with owner approval recorded; the four byte-identical HaShalom placeholders stay non-authority. Ayalon freeze is granted with 36 transitive SHA-256 hashes at `src/game/ayalon-freeze/`. Historical unique-pack `freeze_granted` stays false. GIS claims and public distribution remain forbidden. Live GitHub now requires `required-ci / validate` on `main` via ruleset `23177340`; the repository is private.

Ghosts remain byte-preserved and remain assigned outside this unit. The 30-minute soak contract is locked at `src/game/thirty-soak/` with duration 1800 s; required-CI soak-smoke stays 2 cycles and does not substitute. P1-12 stays OPEN. The RSH-067 one-unit authority is consumed on merge. none remains deferred and cannot start without a new explicit owner instruction after this merge. Keyboard/touch/gamepad maps stay unified at `src/game/input-maps/`; Hebrew RTL / English LTR / Arabic-scope stay locked at `src/game/rtl-scope/`. Onboarding is title-boot plus settings and save-recovery UX at `src/game/onboarding/`; there is no first-run wizard. PWA is the live `__grok` standalone manifest at `src/game/pwa/` with no service worker, offline cache, update prompt or public install. Accessibility is live aria controls, live regions and reduced-motion at `src/game/a11y/` with no WCAG AA, canvas a11y, privacy policy, telemetry or crash reporting. Rothschild geometry remains RSH-049.
