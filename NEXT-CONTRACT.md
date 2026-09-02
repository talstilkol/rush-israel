# RUSH Israel — NEXT Contract

**Version:** 13.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-024 implementation base:** `10d0624fce7813b7ad7082adc3c4e92e56c1b851`
**State effective on:** merge of the RSH-024 pull request
**Next unit:** `RSH-025` — deferred and not authorised

## Authority

The current plain `next` instruction authorised exactly RSH-024. That authority is consumed on validated merge and does not extend to RSH-025.

## RSH-024 acceptance boundary

- canonical save schema version remains `3` and migration graph remains exactly `0→1→2→3`;
- `npm run build` remains exactly `vite build`; database-migration and auth-check scripts stay absent;
- secret scanning covers tracked text under `src/`, `scripts/`, `server/` and `.github/` with eight fail-closed patterns;
- production client bundles still fail `check:qa` if they contain `finishNow` or `__controlsTest`;
- GitHub branch-protection application remains an owner setting; finding P1-01 stays mitigated and release gate 5 stays red;
- timed records, recovery, tracks, physics, rendering, assets, dependencies and public-distribution policy remain unchanged;
- no RSH-025 implementation structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 24 |
| Deferred | 43 |
| Remaining | 43 |
| Queue head | RSH-025 |
| RSH-025 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Secret-scan roots | 4 |
| Secret-scan patterns | 8 |
| Release gates | 0/13 |
| Unverified asset files | 66 |

A new explicit owner instruction is required before RSH-025 may be created or executed.
