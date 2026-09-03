# RUSH Israel — Milestone Register

**Version:** 13.0.0
**Established by:** RSH-003
**Canonical source:** `MASTER-PLAN.md` and `QUEUE.json`
**RSH-029 implementation base:** `e068f7a93b7a9d2febb86d25a7e9ba57f5733a39`
**State effective on:** merge of the RSH-029 pull request
**Next eligible unit:** none
**Next scheduled unit:** RSH-030 — deferred and not authorised

## Version 1 milestones

| ID | Name | Units | Count | Post-merge state | Exit gate |
|---|---|---:|---:|---|---|
| M0 | Control and governance | RSH-001–RSH-003 | 3 | ACCEPTED | Canonical state, queue, governance, baselines and registers agree. |
| M1 | Reproducible toolchain and CI | RSH-004–RSH-008 | 5 | BLOCKED — owner setting | A clean clone passes required CI and `main` is technically protected. |
| M2 | Product scope, licensing and assets | RSH-009–RSH-012 | 4 | ACCEPTED | Scope, package identity, root licence and every shipped asset’s legal status are explicit. |
| M3 | Architecture decomposition | RSH-013–RSH-020 | 8 | ACCEPTED | Core, UI, resources and dependencies have explicit owners and boundaries. |
| M4 | Data integrity and production security | RSH-021–RSH-024 | 4 | ACCEPTED | Save data is recoverable and production has no debug or secret exposure. |
| M5 | Ayalon vertical slice | RSH-025–RSH-036 | 12 | DEFERRED | Ayalon is owner-approved, golden-locked and dependency-frozen. |
| M6 | Performance and reliability | RSH-037–RSH-043 | 7 | DEFERRED | Performance, leak, recovery, soak and compatibility targets pass. |
| M7 | UX, accessibility and mobile | RSH-044–RSH-048 | 5 | DEFERRED | Keyboard, touch and gamepad flows pass UX, accessibility and privacy gates. |
| M8 | Eight-track Version 1 content | RSH-049–RSH-062 | 14 | DEFERRED | Eight of eight MVP tracks are driveable, golden-approved and frozen. |
| M9 | Release | RSH-063–RSH-067 | 5 | DEFERRED | All 13 release gates pass and `v1.0.0` has rollback proof. |

## Post-merge program evidence

| Metric | Value |
|---|---:|
| Accepted units | 29 |
| Units in review | 0 |
| Eligible units | 0 |
| Queue head | RSH-030 — deferred/not authorised |
| Active PR | none |
| Remaining units | 38 |
| RSH-029 one-unit authority | consumed 1/1 |
| Verified release gates | 0/13 |
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

No RSH-030 branch, PR or implementation structure is authorised by this state.
