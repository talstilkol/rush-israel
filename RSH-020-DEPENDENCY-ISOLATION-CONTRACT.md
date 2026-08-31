# RSH-020 — Dependency and template isolation contract

**Implementation base:** `53a23eb22952f8ea077b6a164757f03eb1d5ac1c`  
**Base tree:** `1e7fe9add68074c0aa46ed656f3a4199603d6598`  
**Branch:** `agent/rsh-020-template-dependency-isolation`  
**State:** effective only on validated merge

## Contract

- RUSH Israel starts without an account, database, migration, multiplayer room or preview-host bridge.
- The production build is `vite build`; it performs no database mutation.
- Direct packages are reduced from 74 to 30: 10 runtime and 20 development packages.
- The exact package and lock identities are pinned by `DEPENDENCY-BOUNDARY-MANIFEST.json`.
- The product-specific PWA remains available at the accepted `/__grok/*` compatibility URLs.
- Nitro remains exact-pinned at npm's observed latest dist-tag, `3.0.260610-beta`.
- Tracks, physics, saves, records, rendering, assets and public-distribution policy do not change.
- RSH-021 is deferred, unauthorized and not pre-created.
