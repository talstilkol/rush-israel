# RUSH Israel — NEXT Contract

**Version:** 8.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-019 implementation base:** `bf1af8015a36cbe3ef34494f6d2b24eace3f153b`
**State effective on:** merge of the RSH-019 pull request
**Next unit:** `RSH-020` — deferred and not authorised

## Authority

The current plain `next` instruction authorised exactly RSH-019. That authority is
consumed on validated merge and does not extend to RSH-020.

## RSH-019 acceptance boundary

- exactly one ownership ledger governs CSM, post stacks and render targets;
- engine, world, post stack, audio and input teardown are idempotent;
- racers, traffic, police and both ghost visual families are disposed;
- shared asset-cache textures are not destroyed per engine;
- menu→race smoke accounts for both texture and geometry deltas;
- RSH-015/RSH-017 historical sources remain exactly reconstructable;
- tracks, physics, saves, assets and dependencies change by zero;
- RSH-040 through RSH-042 release reliability gates remain deferred;
- no RSH-020 implementation structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 19 |
| Deferred | 48 |
| Remaining | 48 |
| Queue head | RSH-020 |
| RSH-020 authorised | No |
| Current authority remaining | 0 |
| Release gates | 0/13 |
| Unverified asset files | 66 |

A new explicit owner instruction is required before RSH-020 may be created or executed.
