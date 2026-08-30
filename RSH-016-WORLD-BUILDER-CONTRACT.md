# RSH-016 — Isolated world-builder contract

- Unit: `RSH-016`
- Verified base: `973e68d6e1d3fa8ed628f4461cdfae3096d01ea3`
- Base tree: `27e88997f6127a045b0c260850cabcf0c0d650fd`
- Source baseline: `src/game/world.ts` — 9006 lines / 352625 bytes
- Source SHA-256: `64d3aed2e9d4a6dca0fcdbd7d27bb924783afc441549d76cb4079f399b11b107`

## Boundary

1. Exactly 56 runtime track builders exist under `src/game/world-builders/tracks`, one for every accepted runtime Track ID and in the exact RSH-014 runtime order.
2. Each module owns the implementation body formerly selected by its top-level `def.id` branch in `addLandmarks`.
3. `src/game/world-builders/index.ts` is the sole registry and dispatch owner.
4. `src/game/world-builders/shared.ts` owns shared track-builder setup and inferred context assembly.
5. `src/game/world.ts` remains the concrete world composition root but no longer owns the 6,240-line monolithic `addLandmarks` implementation.
6. The accepted RSH-015 `world.ts` reconstructs byte-for-byte from the facade, shared setup and 56 module bodies.
7. RSH-017 engine decomposition is not created or authorized.

## Preservation

- 56 track IDs and 56 track modules;
- 8 MVP and 48 deferred tracks;
- exact runtime and aggregate track-definition digests;
- 120 Hz physics;
- current rendering, vehicle, collider, ramp, airborne, save, record and QA behaviour;
- 66 unverified public asset files;
- public distribution remains unauthorized;
- release gates remain 0/13;
- runtime, track-data, physics, asset and dependency changes are 0.

## Validation

`WORLD-BUILDER-MANIFEST.json`, `scripts/load-world-builders.mjs` and `scripts/check-world-builders.mjs` fail closed on module count/order/identity, cross-track imports, ID branching, duplicate ownership, facade bypass, historical reconstruction drift, preserved-source drift and unauthorized RSH-017 structures.

## Authorization and implemented dimensions

- Owner instruction: plain `next`, interpreted by `QUEUE.json` as exactly one queue-head unit.
- Authorization scope: RSH-016 only; RSH-017 and later units remain unauthorized.
- `src/game/world.ts`: 9,006 lines / 352,625 bytes before; 2,790 lines / 110,205 bytes after.
- Per-track builder modules: 56.
- Per-track builder source: 6,256 lines / 230,235 bytes.
- Complete builder source including registry, shared context and types: 7,475 lines / 272,702 bytes.
- Observable runtime-behaviour changes: 0.
- State becomes accepted only on validated merge and successful post-merge required CI.
