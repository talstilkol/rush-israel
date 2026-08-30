# RSH-018 — Game application decomposition contract

- Unit: `RSH-018`
- Owner instruction: plain `next`, authorising exactly one queue-head unit
- Verified `main` base: `d3bd207a98989398ead0e6804519d4a0d2eb19a1`
- Base tree: `3535dfaaf96f01a64f6ec79a09358aff4e6cf4c8`
- Branch: `agent/rsh-018-game-app-decomposition`
- Source baseline: `src/components/game-app.tsx` — **1540 lines / 57429 bytes**
- Baseline SHA-256: `04f0c06e69a7a8c91bc4524eba1fcc066a05e7f4a5199d7492b330ee70e7829e`
- Baseline Git blob: `956cfa131200b3c9d9d0902a1b2d6d4d9a8d8728`

## Accepted boundary

| Source | Responsibility | Lines | Bytes | SHA-256 |
|---|---|---:|---:|---|
| `src/components/game-app.tsx` | application state and orchestration facade | 179 | 4431 | `4569f67f6a8659252e3c3cf332fa377f263d3f41fcd03ced60a007aa0148cc4b` |
| `src/components/game-app/screens.tsx` | screens | 822 | 32524 | `37e532f6920a249564eeacfc3473d14b6731da97cff1763eec5e78a1c6cce91d` |
| `src/components/game-app/hud.tsx` | hud | 218 | 9432 | `97eae819cf490729bf36de0dbaf9f79a6154e52b844f42a5dd76e159e76eca35` |
| `src/components/game-app/race-controller.tsx` | race-controller | 512 | 15009 | `e01c955f700b0f7c1fa20f876a8f3ad8b294f3edbdf3bcdf4ed16e6821188670` |

| Metric | Exact value |
|---|---:|
| Canonical modules | 3 |
| Manifest-bound source blocks | 16 |
| Extracted module lines | 1552 |
| Extracted module bytes | 56965 |
| Complete facade + modules | 1731 lines / 61396 bytes |
| Runtime behaviour changes | 0 |
| Public API changes | 0 |
| Track/physics/render/save/asset/dependency changes | 0 |

The accepted RSH-017 game application reconstructs byte-for-byte from the manifest-bound
blocks. RSH-019 remains absent, deferred and unauthorised.
