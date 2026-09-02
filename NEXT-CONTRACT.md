# RUSH Israel — NEXT Contract

**Version:** 12.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-023 implementation base:** `33b280767913ef93b1dd8b73ab0e41a73636db38`
**State effective on:** merge of the RSH-023 pull request
**Next unit:** `RSH-024` — deferred and not authorised

## Authority

The current plain `next` instruction authorised exactly RSH-023. That authority is consumed on validated merge and does not extend to RSH-024.

## RSH-023 acceptance boundary

- canonical save schema version remains `3` and migration graph remains exactly `0→1→2→3`;
- timed-record hashes are SHA-256 of `trackId|carId|t|physicsVersion` and are verified on every read;
- writes are serialised through one in-module persist chain;
- canonical JSON replaces the whole `rush.records.v3` key and is verified after write;
- duplicates collapse; invalid candidates are rejected; quota failures preserve the last live set;
- storage is bounded to 24 records per track/car/physics-version group and 200 records overall;
- ghosts, recovery, tracks, physics, rendering, assets, dependencies and public-distribution policy remain unchanged;
- no RSH-024 implementation structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 23 |
| Deferred | 44 |
| Remaining | 44 |
| Queue head | RSH-024 |
| RSH-024 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Timed-record limit | 200 |
| Per track/car limit | 24 |
| Release gates | 0/13 |
| Unverified asset files | 66 |

A new explicit owner instruction is required before RSH-024 may be created or executed.
