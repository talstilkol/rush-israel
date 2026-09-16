# RUSH Israel — Milestone Register

**Version:** 50.0.0
**Established by:** RSH-003
**Canonical source:** `MASTER-PLAN.md` and `QUEUE.json`
**RSH-067 implementation base:** `66afc517c52faff8aa93bb9ee8b1f0c21a92dd2d`
**State effective on:** merge of the RSH-067 pull request
**Next eligible unit:** none
**Next scheduled unit:** none — deferred and not authorised

## Version 1 milestones

| ID | Name | Units | Count | Post-merge state | Exit gate |
|---|---|---:|---:|---|---|
| M0 | Control and governance | RSH-001–RSH-003 | 3 | ACCEPTED | Canonical state, queue, governance, baselines and registers agree. |
| M1 | Reproducible toolchain and CI | RSH-004–RSH-008 | 5 | ACCEPTED — live `main` protected | A clean clone passes required CI and `main` is technically protected. |
| M2 | Product scope, licensing and assets | RSH-009–RSH-012 | 4 | ACCEPTED | Scope, package identity, root licence and every shipped asset’s legal status are explicit. |
| M3 | Architecture decomposition | RSH-013–RSH-020 | 8 | ACCEPTED | Core, UI, resources and dependencies have explicit owners and boundaries. |
| M4 | Data integrity and production security | RSH-021–RSH-024 | 4 | ACCEPTED | Save data is recoverable and production has no debug or secret exposure. |
| M5 | Ayalon vertical slice | RSH-025–RSH-036 | 12 | ACCEPTED | Ayalon is owner-approved, golden-locked and dependency-frozen. |
| M6 | Performance and reliability | RSH-037–RSH-043 | 7 | ACCEPTED | Performance, leak, recovery, soak and compatibility targets pass. |
| M7 | UX, accessibility and mobile | RSH-044–RSH-048 | 5 | ACCEPTED | Keyboard, touch and gamepad flows pass UX, accessibility and privacy gates. |
| M8 | Eight-track Version 1 content | RSH-049–RSH-062 | 14 | ACCEPTED | Eight of eight MVP tracks are driveable, golden-approved and frozen. |
| M9 | Release | RSH-063–RSH-067 | 5 | ACCEPTED | All 13 release gates pass and `v1.0.0` has rollback proof. |

## Post-merge program evidence

| Metric | Value |
|---|---:|
| Accepted units | 67 |
| Units in review | 0 |
| Eligible units | 0 |
| Queue head | none — deferred/not authorised |
| Active PR | none |
| Remaining units | 0 |
| RSH-067 one-unit authority | consumed 1/1 |
| Verified release gates | 8/13 live (`LIVE-GITHUB-STATUS.json`); RSH-067 snapshot stays 0/13; post-merge CI after PR #78 is run `35095481235` success on `a0850f9` |
| Git tags | 0 |
| GitHub Releases | 0 |

## Accepted boundaries

| Unit range | Result |
|---|---|
| RSH-013–RSH-018 | Track, world, engine and UI decomposition accepted |
| RSH-019 | Resource ownership and leak accounting accepted |
| RSH-020 | Auth/DB/multiplayer/template isolation and 74→30 direct package reduction accepted |
| RSH-021 | Save schema v3, deterministic 0→1→2→3 migrations and non-destructive fail-closed loading accepted |
| RSH-022 | Verified one-generation backup, bounded rejected-byte quarantine, explicit recovery and accessible visible failure handling accepted |
| RSH-023 | Timed-record hash verification, serial writes, deduplication and storage limits accepted |
| RSH-024 | Expanded secret scanning, production QA-hook pin and build/migration separation accepted on validated merge |
| RSH-025 | Ayalon V1 acceptance criteria and existing golden/reference pack inventory accepted |
| RSH-026 | Ayalon road geometry, width 28 and 8 lanes locked on validated merge |
| RSH-027 | Ayalon ramps, barriers, colliders and checkpoints locked on validated merge |
| RSH-028 | Ayalon landmark placement locked on validated merge |
| RSH-029 | Ayalon asphalt, sidewalks, markings and signs locked on validated merge |
| RSH-030 | Version 1 hero car, LODs and silhouette gate delivered on validated merge |
| RSH-031 | Daylight, sky and image-based lighting locked on validated merge |
| RSH-032 | Night lighting, headlights and weather locked on validated merge |
| RSH-033 | Driving physics calibration accepted on validated merge |
| RSH-034 | Audio, HUD, keyboard, touch and gamepad behaviour locked on validated merge |
| RSH-035 | Unique Ayalon golden pack and owner approval recorded on validated merge |
| RSH-036 | Ayalon freeze and 36 transitive dependency hashes recorded on validated merge |
| RSH-037 | Instrument p50, p95, p99, draw calls, triangles and memory locked on validated merge |
| RSH-038 | Quality profiles and dynamic-quality hysteresis locked on validated merge |
| RSH-039 | Bundle, streaming and cache budgets locked on validated merge |
| RSH-040 | 20 enter-exit leak cycles locked on validated merge |
| RSH-041 | WebGL context-loss recovery locked on validated merge |
| RSH-042 | 30-minute soak contract locked on validated merge |
| RSH-043 | browser and device support matrix locked on validated merge |
| RSH-044 | keyboard, touch and gamepad input maps unified on validated merge |
| RSH-045 | Hebrew RTL, English LTR and Arabic-scope decision locked on validated merge |
| RSH-046 | onboarding, settings, error and recovery flows locked on validated merge |
| RSH-047 | PWA, offline, update and manifest behaviour locked on validated merge |
| RSH-048 | accessibility, privacy and Alpha UX gates locked on validated merge |
| RSH-049 | Rothschild geometry and driving locked on validated merge |
| RSH-050 | Rothschild art, golden and source freeze locked on validated merge |
| RSH-051 | Yarkon–Reading geometry and driving locked on validated merge |
| RSH-052 | Yarkon–Reading art, golden and source freeze locked on validated merge |
| RSH-053 | Jaffa geometry and driving locked on validated merge |
| RSH-054 | Jaffa art, golden and source freeze locked on validated merge |
| RSH-055 | Jerusalem–Scopus geometry and driving locked on validated merge |
| RSH-056 | Jerusalem–Scopus art, golden and source freeze locked on validated merge |
| RSH-057 | Haifa–Carmel geometry and driving locked on validated merge |
| RSH-058 | Haifa–Carmel art, golden and source freeze locked on validated merge |
| RSH-059 | Ramon geometry and driving locked on validated merge |
| RSH-060 | Ramon art, golden and source freeze locked on validated merge |
| RSH-061 | Hermon geometry and driving locked on validated merge |
| RSH-062 | Hermon art, golden and source freeze locked on validated merge |
| RSH-063 | SemVer, changelog and private release automation locked on validated merge |
| RSH-064 | preview, staging, production and rollback channels locked on validated merge |
| RSH-065 | private v0.1.0-alpha.1 identity locked on validated merge |
| RSH-066 | private RC1 identity locked; blocking program defects remain owner-gated |
| RSH-067 | private v1.0.0 dossier and rollback proof locked; public distribution forbidden |

No none branch, PR or implementation structure is authorised by this state.
