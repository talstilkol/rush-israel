# RUSH Israel — Milestone Register

**Version:** 10.0.0
**Established by:** RSH-003
**Canonical source:** `MASTER-PLAN.md` and `QUEUE.json`
**RSH-023 implementation base:** `33b280767913ef93b1dd8b73ab0e41a73636db38`
**State effective on:** merge of the RSH-023 pull request
**Next eligible unit:** none
**Next scheduled unit:** RSH-024 — deferred and not authorised

## Version 1 milestones

| ID | Name | Units | Count | Post-merge state | Exit gate |
|---|---|---:|---:|---|---|
| M0 | Control and governance | RSH-001–RSH-003 | 3 | ACCEPTED | Canonical state, queue, governance, baselines and registers agree. |
| M1 | Reproducible toolchain and CI | RSH-004–RSH-008 | 5 | BLOCKED — owner setting | A clean clone passes required CI and `main` is technically protected. |
| M2 | Product scope, licensing and assets | RSH-009–RSH-012 | 4 | ACCEPTED | Scope, package identity, root licence and every shipped asset’s legal status are explicit. |
| M3 | Architecture decomposition | RSH-013–RSH-020 | 8 | ACCEPTED | Core, UI, resources and dependencies have explicit owners and boundaries. |
| M4 | Data integrity and production security | RSH-021–RSH-024 | 4 | ACTIVE — 3/4 accepted | Save data is recoverable and production has no debug or secret exposure. |
| M5 | Ayalon vertical slice | RSH-025–RSH-036 | 12 | DEFERRED | Ayalon is owner-approved, golden-locked and dependency-frozen. |
| M6 | Performance and reliability | RSH-037–RSH-043 | 7 | DEFERRED | Performance, leak, recovery, soak and compatibility targets pass. |
| M7 | UX, accessibility and mobile | RSH-044–RSH-048 | 5 | DEFERRED | Keyboard, touch and gamepad flows pass UX, accessibility and privacy gates. |
| M8 | Eight-track Version 1 content | RSH-049–RSH-062 | 14 | DEFERRED | Eight of eight MVP tracks are driveable, golden-approved and frozen. |
| M9 | Release | RSH-063–RSH-067 | 5 | DEFERRED | All 13 release gates pass and `v1.0.0` has rollback proof. |

## Post-merge program evidence

| Metric | Value |
|---|---:|
| Accepted units | 23 |
| Units in review | 0 |
| Eligible units | 0 |
| Queue head | RSH-024 — deferred/not authorised |
| Active PR | none |
| Remaining units | 44 |
| RSH-023 one-unit authority | consumed 1/1 |
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
| RSH-023 | Timed-record hash verification, serial writes, deduplication and storage limits accepted on validated merge |

No RSH-024 branch, PR or implementation structure is authorised by this state.
