# RUSH Israel — NEXT Contract

**Version:** 6.0.0  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**RSH-017 implementation base:** `ec35e159a9722812d945eaab984f9dc92645205f`  
**State effective on:** merge of the RSH-017 pull request  
**Next unit:** `RSH-018` — deferred and not authorised

## Authority

GitHub is the sole source of truth. The plain `next` instruction authorised exactly
RSH-017 under the canonical one-unit queue rule. That authority is consumed on the
validated RSH-017 merge and does not extend to RSH-018.

## RSH-017 acceptance boundary

- `src/game/engine.ts` remains the sole `RaceEngine` state, constructor, assembly and disposal owner;
- exactly four concern adapters exist under `src/game/engine`: loop, rendering, physics and QA;
- exactly 58 existing methods are delegated to those adapters;
- `engine.ts` falls from **2,815 lines / 99,577 bytes** to **1,207 lines / 41,703 bytes**;
- adapter source totals **2,209 lines / 77,220 bytes**;
- the accepted RSH-016 `engine.ts` reconstructs byte-for-byte with SHA-256 `3f4d54bbe0b68f9654ae8a92a2f56ce378a59a9790e8fbbe2ee05199ced192c1`;
- runtime behaviour, public API, physics, rendering behaviour, QA interfaces, tracks, assets, dependencies and save/record behaviour change by **0**;
- all temporary source-transfer files are absent from the final tree;
- exact-head required CI and Codex review must pass before merge;
- no RSH-018 structure may be created.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 17 |
| In review | 0 |
| Eligible | 0 |
| Deferred | 50 |
| Remaining | 50 |
| Queue head | RSH-018 |
| RSH-018 authorised | No |
| Current one-unit authority remaining | 0 |
| Release gates | 0/13 |
| Unverified asset files | 66 |

A new explicit owner instruction is required before RSH-018 may be created or executed.
