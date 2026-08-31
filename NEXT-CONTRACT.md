# RUSH Israel — NEXT Contract

**Version:** 10.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-021 implementation base:** `7cff508a4cfa95c03ac34c5503912e70bed47b90`
**State effective on:** merge of the RSH-021 pull request
**Next unit:** `RSH-022` — deferred and not authorised

## Authority

The current plain `next` instruction authorised exactly RSH-021. That authority is consumed on validated merge and does not extend to RSH-022.

## RSH-021 acceptance boundary

- canonical save schema version remains `3`;
- deterministic migration graph is exactly `0→1→2→3`;
- current v3 migration is idempotent and canonical JSON is byte-deterministic;
- legacy migration preserves the legacy key and verifies the current key;
- corrupt, invalid and future-version source bytes fail closed without overwrite;
- read, write and repair outcomes are structured and testable;
- backup creation, recovery UI and user-visible failure handling remain deferred to RSH-022;
- timed records and ghosts remain unchanged;
- tracks, physics, rendering, assets, dependencies and public-distribution policy remain unchanged;
- no RSH-022 implementation structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 21 |
| Deferred | 46 |
| Remaining | 46 |
| Queue head | RSH-022 |
| RSH-022 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Deterministic migration edges | 3 |
| Release gates | 0/13 |
| Unverified asset files | 66 |

A new explicit owner instruction is required before RSH-022 may be created or executed.
