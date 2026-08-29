# RUSH Israel — NEXT Contract

**Version:** 3.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-014 implementation base:** `0273520da4924cb3e71ff41b2ea75788a45bf757`
**State effective on:** merge of the RSH-014 pull request
**Next unit:** `RSH-015` — deferred and not authorised

## Authority

GitHub is the sole source of truth. RSH-014 is the second and final unit authorised by the owner instruction `next 2`. After its validated merge, the bounded RSH-010–RSH-014 batch is closed.

## RSH-014 acceptance boundary

- exactly **56** files contain one track definition each;
- each module default-exports `defineTrack(object)`;
- `src/game/tracks/index.ts` constructs the catalogue with `defineTracks` in the exact accepted runtime order;
- `TRACK-MODULE-MANIFEST.json` pins every module, facade, shared source and index;
- the modular tree reconstructs the accepted RSH-013 `tracks.ts` Git blob `e26454223f8a598cdf516af7c7c3f494162e2616` byte-for-byte;
- ordered digest remains `a1ccf6f71ca7c4bad7fbc1280aecb04cdc4390ca400cf183cd3fde916d14294d`;
- aggregate digest remains `1f10ef1b656fb61b414aed82a1918ade65c5093fcedf486b2aa3b37527d5dfb7`;
- runtime data/order, IDs, MVP mapping, assets and dependencies change by **0**;
- exact-head required CI and Codex review must pass before merge.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 14 |
| In review | 0 |
| Eligible | 0 |
| Deferred | 53 |
| Remaining | 53 |
| Queue head | RSH-015 |
| RSH-015 authorised | No |
| Batch completed | 5/5 |
| Release gates | 0/13 |
| Unverified asset files | 66 |

A new explicit owner instruction is required before RSH-015 may be created or executed.
