# RUSH Israel — NEXT Contract

**Version:** 7.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-018 implementation base:** `d3bd207a98989398ead0e6804519d4a0d2eb19a1`
**State effective on:** merge of the RSH-018 pull request
**Next unit:** `RSH-019` — deferred and not authorised

## Authority

GitHub is the sole source of truth. The plain `next` instruction authorised exactly
RSH-018 under the canonical one-unit queue rule. That authority is consumed on the
validated RSH-018 merge and does not extend to RSH-019.

## RSH-018 acceptance boundary

- `src/components/game-app.tsx` remains the sole application-level state and orchestration facade;
- exactly three canonical modules exist under `src/components/game-app/`: screens, HUD and race controller;
- the accepted RSH-017 `game-app.tsx` reconstructs byte-for-byte with SHA-256 `04f0c06e69a7a8c91bc4524eba1fcc066a05e7f4a5199d7492b330ee70e7829e`;
- the facade falls from **1540 lines / 57429 bytes** to **179 lines / 4431 bytes**;
- extracted module source totals **1552 lines / 56965 bytes**;
- runtime behaviour, public API, screen flow, HUD, RaceEngine lifecycle, tracks, physics, rendering, saves, assets and dependencies change by **0**;
- all temporary RSH-018 transfer/finalizer files are absent from the final tree;
- exact-head required CI and Codex review must pass before merge;
- no RSH-019 structure may be created.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 18 |
| In review | 0 |
| Eligible | 0 |
| Deferred | 49 |
| Remaining | 49 |
| Queue head | RSH-019 |
| RSH-019 authorised | No |
| Current one-unit authority remaining | 0 |
| Release gates | 0/13 |
| Unverified asset files | 66 |

A new explicit owner instruction is required before RSH-019 may be created or executed.
