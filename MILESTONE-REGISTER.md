# RUSH Israel — Milestone Register

**Version:** 1.0.0  
**Established by:** RSH-003  
**Canonical source:** `MASTER-PLAN.md` and `QUEUE.json`  
**Verified base:** `ef86c69ade9bc54585104f90743fb32cb4489898`

## Status vocabulary

- `ACCEPTED`: every unit in the milestone is merged and its gate evidence passes.
- `ACTIVE`: exactly one queue-head unit in the milestone may be in review.
- `BLOCKED`: a predecessor unit or owner action is unresolved.
- `DEFERRED`: not eligible under the strict serial queue.

## Version 1 milestones

| ID | Name | Units | Count | Current state | Exit gate |
|---|---|---:|---:|---|---|
| M0 | Control and governance | RSH-001–RSH-003 | 3 | ACTIVE | Canonical state, queue, governance, baselines and registers agree. |
| M1 | Reproducible toolchain and CI | RSH-004–RSH-008 | 5 | BLOCKED | A clean clone passes one required CI command and `main` is technically protected. |
| M2 | Product scope, licensing and assets | RSH-009–RSH-012 | 4 | DEFERRED | Version 1 scope and every shipped asset's legal status are explicit. |
| M3 | Architecture decomposition | RSH-013–RSH-020 | 8 | DEFERRED | Core responsibilities and resource ownership are separated. |
| M4 | Data integrity and production security | RSH-021–RSH-024 | 4 | DEFERRED | Save data is recoverable and production has no debug or secret exposure. |
| M5 | Ayalon vertical slice | RSH-025–RSH-036 | 12 | DEFERRED | Ayalon is owner-approved, golden-locked and dependency-frozen. |
| M6 | Performance and reliability | RSH-037–RSH-043 | 7 | DEFERRED | Performance, leak, recovery, soak and compatibility targets pass. |
| M7 | UX, accessibility and mobile | RSH-044–RSH-048 | 5 | DEFERRED | Keyboard, touch and gamepad flows pass UX, accessibility and privacy gates. |
| M8 | Eight-track Version 1 content | RSH-049–RSH-062 | 14 | DEFERRED | Eight of eight MVP tracks are driveable, golden-approved and frozen. |
| M9 | Release | RSH-063–RSH-067 | 5 | DEFERRED | All 13 release gates pass and `v1.0.0` has rollback proof. |

## Current milestone evidence

| Metric | Value |
|---|---:|
| Accepted units before RSH-003 | 2 |
| Unit in execution | RSH-003 |
| Remaining Version 1 units including RSH-003 | 65 |
| Verified release gates | 0/13 |
| Git tags | 0 |
| GitHub Releases | 0 |

## GitHub-native milestone policy

This file is the canonical milestone definition. GitHub-native milestone objects may
mirror it when the connected tooling exposes milestone creation. A missing GitHub
UI object must not change queue eligibility, accepted-unit counts or gate status.
