# RUSH Israel — NEXT Contract

**Version:** 5.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-016 implementation base:** `973e68d6e1d3fa8ed628f4461cdfae3096d01ea3`
**State effective on:** merge of the RSH-016 pull request
**Next unit:** `RSH-017` — deferred and not authorised

## Authority

GitHub is the sole source of truth. The plain `next` instruction authorised exactly RSH-016 under the canonical one-unit queue rule. That authority is consumed on the validated RSH-016 merge and does not extend to RSH-017.

## RSH-016 acceptance boundary

- exactly **56** builder modules exist under `src/game/world-builders/tracks`, one per accepted runtime Track ID;
- `src/game/world-builders/index.ts` is the sole registry and dispatch authority;
- `src/game/world-builders/shared.ts` is the sole shared-context authority;
- `src/game/world.ts` remains the concrete world composition root and public compatibility facade;
- `world.ts` falls from **9,006 lines / 352,625 bytes** to **2,790 lines / 110,205 bytes**;
- the extracted builder source totals **7,475 lines / 272,702 bytes**, including **6,256 lines / 230,235 bytes** in the 56 per-track modules;
- the accepted RSH-015 `world.ts` reconstructs byte-for-byte with SHA-256 `64d3aed2e9d4a6dca0fcdbd7d27bb924783afc441549d76cb4079f399b11b107`;
- track data/order, physics, assets, dependencies, rendering, save/record and QA behaviour change by **0**;
- exact-head required CI and Codex review must pass before merge;
- no RSH-017 structure may be created.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 16 |
| In review | 0 |
| Eligible | 0 |
| Deferred | 51 |
| Remaining | 51 |
| Queue head | RSH-017 |
| RSH-017 authorised | No |
| Current one-unit authority remaining | 0 |
| Release gates | 0/13 |
| Unverified asset files | 66 |

A new explicit owner instruction is required before RSH-017 may be created or executed.
