# RUSH Israel — Milestone Register

**Version:** 2.0.0  
**Established by:** RSH-003  
**Canonical source:** `MASTER-PLAN.md` and `QUEUE.json`  
**RSH-014 implementation base:** `0273520da4924cb3e71ff41b2ea75788a45bf757`  
**State effective on:** merge of PR #17  
**Next eligible unit:** none  
**Next scheduled unit:** RSH-015 — deferred and not authorised

## Status vocabulary

- `ACCEPTED`: every unit in the milestone is merged and its exit gate passes.
- `ACTIVE`: exactly one queue-head unit in the milestone is eligible or in review.
- `BLOCKED`: scheduled units may be accepted, but an owner action or exit-gate requirement remains unresolved.
- `AUTHORISED-DEFERRED`: included in the bounded owner instruction but blocked by strict serial execution.
- `DEFERRED`: not eligible under the current queue.

## Version 1 milestones

| ID | Name | Units | Count | Post-merge state | Exit gate |
|---|---|---:|---:|---|---|
| M0 | Control and governance | RSH-001–RSH-003 | 3 | ACCEPTED | Canonical state, queue, governance, baselines and registers agree. |
| M1 | Reproducible toolchain and CI | RSH-004–RSH-008 | 5 | BLOCKED — owner setting | A clean clone passes required CI and `main` is technically protected. |
| M2 | Product scope, licensing and assets | RSH-009–RSH-012 | 4 | ACCEPTED | Scope, package identity, root licence and every shipped asset’s legal status are explicit. |
| M3 | Architecture decomposition | RSH-013–RSH-020 | 8 | DEFERRED — RSH-013–RSH-014 accepted; RSH-015 not authorised | Core responsibilities and resource ownership are separated. |
| M4 | Data integrity and production security | RSH-021–RSH-024 | 4 | DEFERRED | Save data is recoverable and production has no debug or secret exposure. |
| M5 | Ayalon vertical slice | RSH-025–RSH-036 | 12 | DEFERRED | Ayalon is owner-approved, golden-locked and dependency-frozen. |
| M6 | Performance and reliability | RSH-037–RSH-043 | 7 | DEFERRED | Performance, leak, recovery, soak and compatibility targets pass. |
| M7 | UX, accessibility and mobile | RSH-044–RSH-048 | 5 | DEFERRED | Keyboard, touch and gamepad flows pass UX, accessibility and privacy gates. |
| M8 | Eight-track Version 1 content | RSH-049–RSH-062 | 14 | DEFERRED | Eight of eight MVP tracks are driveable, golden-approved and frozen. |
| M9 | Release | RSH-063–RSH-067 | 5 | DEFERRED | All 13 release gates pass and `v1.0.0` has rollback proof. |

## Post-merge program evidence

| Metric | Value |
|---|---:|
| Accepted units | 14 |
| Units in review | 0 |
| Eligible units | 0 |
| Queue head | none |
| Active PR | none |
| Remaining units | 53 |
| Owner batch | RSH-010–RSH-014 — closed |
| Batch completed | 5/5 |
| Next scheduled unit | RSH-015 — deferred and not authorised |
| Verified release gates | 0/13 |
| Git tags | 0 |
| GitHub Releases | 0 |

## M1 evidence and blocker

RSH-004–RSH-008 are accepted. GitHub still reports `main` unprotected with zero
required status checks and zero rulesets. M1 remains **BLOCKED** until live repository
metadata confirms protection.

## M2 result

| Unit | Status |
|---|---|
| RSH-009 — frozen Version 1 product definition | ACCEPTED — PR #11 |
| RSH-010 — 8 MVP / 48 deferred catalogue classification | ACCEPTED — PR #13 |
| RSH-011 — complete asset provenance and licence inventory | ACCEPTED — PR #14 |
| RSH-012 — README, metadata, branding, root licence and PWA alignment | ACCEPTED — PR #15 |

M2 acceptance means legal status is explicit; it does not mean every asset is cleared.
Exactly 66 public asset files remain unverified and public distribution remains blocked.

## M3 closed owner boundary

| Unit | Status |
|---|---|
| RSH-013 — canonical track schema | ACCEPTED — PR #16 |
| RSH-014 — one module per track | ACCEPTED ON MERGE — PR #17 |
| RSH-015–RSH-020 | DEFERRED — NOT AUTHORISED |

The bounded owner instruction closes after RSH-014 with five of five units completed.
No unit remains eligible. RSH-015 requires a new explicit owner instruction.

## GitHub-native milestone policy

This file is the canonical milestone definition. GitHub-native milestone objects may
mirror it when connector support exists. A missing GitHub UI object does not change
queue eligibility, accepted-unit counts or gate status.
