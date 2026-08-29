# RUSH Israel — Milestone Register

**Version:** 1.6.1  
**Established by:** RSH-003  
**Canonical source:** `MASTER-PLAN.md` and `QUEUE.json`  
**Verified base:** `69765febef85d732d9ba79fe260fec78ee76b2df`  
**Active unit:** RSH-010 / replacement PR #13  
**Closed unmerged draft:** PR #12

## Status vocabulary

- `ACCEPTED`: every unit in the milestone is merged and its exit gate passes.
- `ACTIVE`: exactly one queue-head unit in the milestone is eligible or in review.
- `BLOCKED`: all scheduled units may be accepted, but an owner action or exit-gate requirement remains unresolved.
- `AUTHORISED-DEFERRED`: included in the bounded owner instruction but blocked by strict serial execution.
- `DEFERRED`: not eligible under the current queue.

## Version 1 milestones

| ID | Name | Units | Count | Current state | Exit gate |
|---|---|---:|---:|---|---|
| M0 | Control and governance | RSH-001–RSH-003 | 3 | ACCEPTED | Canonical state, queue, governance, baselines and registers agree. |
| M1 | Reproducible toolchain and CI | RSH-004–RSH-008 | 5 | BLOCKED — owner setting | A clean clone passes one required CI command and `main` is technically protected. |
| M2 | Product scope, licensing and assets | RSH-009–RSH-012 | 4 | ACTIVE — RSH-010 | Version 1 scope and every shipped asset's legal status are explicit. |
| M3 | Architecture decomposition | RSH-013–RSH-020 | 8 | AUTHORISED-DEFERRED — RSH-013–014 only | Core responsibilities and resource ownership are separated. |
| M4 | Data integrity and production security | RSH-021–RSH-024 | 4 | DEFERRED | Save data is recoverable and production has no debug or secret exposure. |
| M5 | Ayalon vertical slice | RSH-025–RSH-036 | 12 | DEFERRED | Ayalon is owner-approved, golden-locked and dependency-frozen. |
| M6 | Performance and reliability | RSH-037–RSH-043 | 7 | DEFERRED | Performance, leak, recovery, soak and compatibility targets pass. |
| M7 | UX, accessibility and mobile | RSH-044–RSH-048 | 5 | DEFERRED | Keyboard, touch and gamepad flows pass UX, accessibility and privacy gates. |
| M8 | Eight-track Version 1 content | RSH-049–RSH-062 | 14 | DEFERRED | Eight of eight MVP tracks are driveable, golden-approved and frozen. |
| M9 | Release | RSH-063–RSH-067 | 5 | DEFERRED | All 13 release gates pass and `v1.0.0` has rollback proof. |

## Current milestone evidence

| Metric | Value |
|---|---:|
| Accepted units | 9 |
| Units in review | 1 |
| Queue head | RSH-010 |
| Active PR | #13 |
| Replaced unmerged draft | #12 |
| Remaining units | 58 |
| Active owner batch | RSH-010–RSH-014 |
| Verified release gates | 0/13 |
| Git tags | 0 |
| GitHub Releases | 0 |

## M1 evidence and blocker

| Unit | Status |
|---|---|
| RSH-004 — exact Node/npm toolchain | ACCEPTED |
| RSH-005 — portable project paths | ACCEPTED |
| RSH-006 — self-starting QA harness | ACCEPTED |
| RSH-007 — GitHub Actions CI | ACCEPTED |
| RSH-008 — required checks and CI artifacts | ACCEPTED |

RSH-007 produced successful clean-checkout GitHub-hosted validation. RSH-008 added exact-head governance validation and always-retained diagnostics. GitHub still reports `main` unprotected with zero required status checks and zero rulesets. M1's units are accepted, but its exit gate remains **BLOCKED** until live repository metadata confirms protection.

## M2 progress

| Unit | Status |
|---|---|
| RSH-009 — frozen Version 1 product definition | ACCEPTED — PR #11 |
| RSH-010 — 8 MVP / 48 deferred catalogue classification | IN REVIEW — replacement PR #13 |
| RSH-011 — complete asset provenance and licence inventory | AUTHORISED, BLOCKED BY RSH-010 |
| RSH-012 — README, metadata, branding, root licence and PWA alignment | AUTHORISED, DEFERRED |

Draft PR #12 was closed without merge solely because the connector could not execute its Ready-for-review GraphQL mutation. Replacement PR #13 carries the same branch and history.

## M3 authorised boundary

| Unit | Status |
|---|---|
| RSH-013 — canonical track schema | AUTHORISED, DEFERRED |
| RSH-014 — one module per track | AUTHORISED, FINAL BATCH UNIT |
| RSH-015–RSH-020 | NOT AUTHORISED |

The bounded owner instruction closes after RSH-014. RSH-015 requires a new explicit instruction.

## GitHub-native milestone policy

This file is the canonical milestone definition. GitHub-native milestone objects may mirror it when connector support exists. A missing GitHub UI object does not change queue eligibility, accepted-unit counts or gate status.
