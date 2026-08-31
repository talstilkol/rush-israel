# RUSH Israel — NEXT Contract

**Version:** 9.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-020 implementation base:** `53a23eb22952f8ea077b6a164757f03eb1d5ac1c`
**State effective on:** merge of the RSH-020 pull request
**Next unit:** `RSH-021` — deferred and not authorised

## Authority

The current plain `next` instruction authorised exactly RSH-020. That authority is consumed on validated merge and does not extend to RSH-021.

## RSH-020 acceptance boundary

- direct packages are reduced from 74 to 30: 10 runtime and 20 development;
- auth, DB, migration, multiplayer, app-env and preview-host runtime structures are absent;
- `npm run build` is exactly `vite build` and performs no external mutation;
- the exact package map and lockfile are fail-closed authorities;
- the product-specific PWA remains on the accepted `/__grok/*` compatibility paths;
- Nitro remains exact-pinned at `3.0.260610-beta`, the npm `latest` observed on 31 August 2026;
- tracks, physics, saves, records, rendering, assets and dependencies outside the approved removals do not change;
- no RSH-021 implementation structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 20 |
| Deferred | 47 |
| Remaining | 47 |
| Queue head | RSH-021 |
| RSH-021 authorised | No |
| Current authority remaining | 0 |
| Direct packages | 30 |
| Release gates | 0/13 |
| Unverified asset files | 66 |

A new explicit owner instruction is required before RSH-021 may be created or executed.
