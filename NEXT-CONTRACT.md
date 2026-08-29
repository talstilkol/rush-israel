# RUSH Israel — NEXT Contract

**Version:** 4.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-015 implementation base:** `076dabb754dba1676c6685a4a8d6f6d3c0b153ea`
**State effective on:** merge of the RSH-015 pull request
**Next unit:** `RSH-016` — deferred and not authorised

## Authority

GitHub is the sole source of truth. The owner authorised exactly RSH-015. That one-unit authority is consumed on its validated merge; it does not extend to RSH-016.

## RSH-015 acceptance boundary

- `src/game/world-core.ts` is the sole owner of the typed `World` contract and lifecycle assembly;
- `src/game/world.ts` remains the concrete composition root and compatibility facade;
- the facade still exports exactly `World` and `createWorld`;
- the core returns exactly 22 public keys in the accepted order;
- the concrete disposer still iterates `bag` in insertion order and calls every `dispose()` once;
- `world.ts` falls from 9034 lines / 353285 bytes to 9006 lines / 352625 bytes;
- `world-core.ts` contains 116 lines / 2604 bytes;
- reconstruction returns the accepted pre-extraction world SHA-256 `db0fd7cada42d3f3479fa6fffca61d3668a6ce3e7977152935480c7dce124056` byte-for-byte;
- `WORLD-CORE-MANIFEST.json` and `scripts/check-world-core.mjs` fail closed on ownership, lifecycle, disposal, facade, RSH-016 and preservation drift;
- track data/order, physics, assets, dependencies, rendering, save/record and QA behaviour change by **0**;
- exact-head required CI and Codex review must pass before merge.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 15 |
| In review | 0 |
| Eligible | 0 |
| Deferred | 52 |
| Remaining | 52 |
| Queue head | RSH-016 |
| RSH-016 authorised | No |
| Current one-unit authority remaining | 0 |
| Release gates | 0/13 |
| Unverified asset files | 66 |

A new explicit owner instruction is required before RSH-016 may be created or executed.
