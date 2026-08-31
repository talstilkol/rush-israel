# RUSH Israel — NEXT Contract

**Version:** 11.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-022 implementation base:** `9bd606a0e6b054b0edafd4eeb6c7d614b3102b4b`
**State effective on:** merge of the RSH-022 pull request
**Next unit:** `RSH-023` — deferred and not authorised

## Authority

The current plain `next` instruction authorised exactly RSH-022. That authority is consumed on validated merge and does not extend to RSH-023.

## RSH-022 acceptance boundary

- canonical save schema version remains `3` and migration graph remains exactly `0→1→2→3`;
- `rush-v1-backup` is verified before any unsafe current-key overwrite;
- the exact previous current bytes are rotated into the single-generation backup;
- migration and repair preserve exact source bytes before canonical v3 replacement;
- rejected current bytes use two bounded verified quarantine slots;
- invalid backup bytes are quarantined before the backup slot is reused;
- restore and fresh-start actions are explicit; automatic restore/reset is forbidden;
- a fresh start requires two-step confirmation and cannot discard a valid active save or valid backup;
- failure status is dispatched as `rush-save-status` and rendered in an accessible bilingual notice;
- no recovery path deletes a key or clears storage;
- timed records and ghosts remain byte-identical;
- tracks, physics, rendering, assets, dependencies and public-distribution policy remain unchanged;
- no RSH-023 implementation structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 22 |
| Deferred | 45 |
| Remaining | 45 |
| Queue head | RSH-023 |
| RSH-023 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Backup generations | 1 |
| Rejected-current quarantine slots | 2 |
| Release gates | 0/13 |
| Unverified asset files | 66 |

A new explicit owner instruction is required before RSH-023 may be created or executed.
