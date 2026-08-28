# RUSH Israel — Label Register

**Version:** 1.0.0  
**Established by:** RSH-003  
**Owner:** `@talstilkol`

Labels are governance metadata. They never override `QUEUE.json`, exact Git SHAs or
release-gate evidence.

## Canonical labels

| Label | Colour | Meaning |
|---|---|---|
| `unit:rsh` | `1D76DB` | Work belongs to a numbered RSH unit. |
| `stage:g0-control` | `5319E7` | Control and governance. |
| `stage:g1-toolchain` | `0E8A16` | Toolchain and CI. |
| `stage:g2-scope` | `006B75` | Product scope, licensing and assets. |
| `stage:g3-architecture` | `0052CC` | Architecture decomposition. |
| `stage:g4-security` | `B60205` | Data integrity and production security. |
| `stage:g5-ayalon` | `D93F0B` | Ayalon vertical slice. |
| `stage:g6-performance` | `FBCA04` | Performance and reliability. |
| `stage:g7-ux` | `C2E0C6` | UX, accessibility and mobile. |
| `stage:g8-content` | `7057FF` | Version 1 track content. |
| `stage:g9-release` | `0E8A16` | Release work. |
| `state:in-review` | `D4C5F9` | The sole queue-head unit has an open PR. |
| `state:blocked` | `B60205` | Ineligible because a predecessor or owner action is unresolved. |
| `state:deferred` | `EDEDED` | Not yet eligible under the serial queue. |
| `severity:p0` | `B60205` | Critical program or release blocker. |
| `severity:p1` | `D93F0B` | High-priority defect or risk. |
| `severity:p2` | `FBCA04` | Medium-priority defect or improvement. |
| `owner-action` | `C5DEF5` | Requires an explicit owner setting or approval. |
| `release-gate` | `0E8A16` | Evidence directly affects one of the 13 gates. |
| `no-game-code` | `BFDADC` | Governance-only change with no product-code mutation. |

## Application rules

1. Every RSH PR receives `unit:rsh`, one stage label and one state label.
2. Severity labels apply only when the PR directly remediates a registered finding.
3. `owner-action` is mandatory when connector permissions cannot complete the action.
4. Labels may be mirrored in GitHub when label mutation is available; absence in the
   GitHub UI does not alter canonical state.
5. A label never constitutes approval, acceptance, merge authorisation or a release.
