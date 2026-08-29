# RSH-015 — World-core extraction contract

- Unit: `RSH-015`
- Verified base commit: `076dabb754dba1676c6685a4a8d6f6d3c0b153ea`
- Evidence generated: `2026-08-29T21:30:59.957Z`
- Source baseline: `src/game/world.ts` — **9034 lines**, **353285 bytes**
- Source SHA-256: `db0fd7cada42d3f3479fa6fffca61d3668a6ce3e7977152935480c7dce124056`
- Source Git blob SHA-1: `07b7e0b559e66f89641357db5aa2be8bcd8c3135`

## 1. Purpose

Extract the reusable, track-agnostic world contract and lifecycle assembly from `src/game/world.ts` while preserving every observable runtime behaviour.

## 2. Canonical ownership after RSH-015

1. `src/game/world-core.ts` is the sole owner of the exported world API types and the typed world lifecycle assembly.
2. `src/game/world.ts` remains the concrete composition root for scene construction, physics bodies and colliders, rendering resources, checkpoints, track selection and every existing track-specific builder.
3. `src/game/world.ts` remains the compatibility facade imported by current consumers. It re-exports the world API types and exports `createWorld`.
4. The core is pure assembly: it receives completed implementations and returns the canonical world object in the accepted key order. It creates no rendering, physics, track, storage or QA side effects.
5. Each responsibility has one owner. `world.ts` must not duplicate the public World/WorldMeshes type declarations after extraction.

## 3. Frozen public boundary

Exports before extraction: `World`, `createWorld`.

Final public return key order:

1. `group`
2. `sun`
3. `sky`
4. `dir`
5. `dirNear`
6. `waterMesh`
7. `colliders`
8. `streets`
9. `ramps`
10. `night`
11. `weather`
12. `followShadows`
13. `followMirror`
14. `setPlanar`
15. `sunDir`
16. `tick`
17. `setTime`
18. `setClock`
19. `clock`
20. `setWeather`
21. `setLod`
22. `dispose`

Direct consumers:

- `src/game/engine.ts:27` imports `createWorld`, `World` from `./world`.

## 4. Lifecycle and disposal preservation

The implementation must preserve the exact lifecycle method names and order recorded above. The accepted pre-extraction dispose call sequence is:

1. No local dispose function was resolved.

`engine.ts` remains wired through `./world`; its 120 Hz physics step and its call/disposal order are unchanged.

## 5. Track boundary

RSH-015 does **not** move or duplicate track-specific construction. It must preserve:

- exactly **56** per-track modules;
- exactly **56** track IDs in accepted runtime order;
- **8** MVP and **48** deferred tracks;
- runtime digest `a1ccf6f71ca7c4bad7fbc1280aecb04cdc4390ca400cf183cd3fde916d14294d`;
- aggregate digest `1f10ef1b656fb61b414aed82a1918ade65c5093fcedf486b2aa3b37527d5dfb7`.

No `world-builders`, `track-builders`, `src/game/world/builders` or equivalent RSH-016 structure may be created.

## 6. Resource and side-effect boundary

`world-core.ts` may use type-only imports needed to express the public contract. It must not import:

- `./tracks`, `./track-modules`, any per-track module or track schema runtime value;
- Rapier runtime values;
- rendering or physics constructors;
- storage, records or QA runtime modules.

Concrete resource creation, scene mutation, collider/body ownership and disposal remain in `world.ts` for this unit. Existing `ResourceRegistry` and `AssetRegistry` authorities are not duplicated.

## 7. Validation contract

RSH-015 must fail closed on:

1. track-specific implementation entering the core;
2. duplicate public world-contract ownership;
3. missing or reordered public lifecycle keys;
4. altered dispose-call sequence;
5. altered exports or consumer wiring;
6. unauthorized RSH-016 paths;
7. `world.ts` bypassing the extracted core or regrowing duplicate ownership;
8. track, physics, asset, dependency, save/record, rendering or QA drift.

The complete required CI, all unit tests, all self-starting QA smoke tests and deterministic development build must pass on the exact final PR head.

## 8. Explicit non-changes

RSH-015 makes no track-data, physics tuning, renderer-default, asset, dependency, save/record, product-scope, distribution or release-gate change. Public distribution remains unauthorized. The 66 unverified asset files and 0/13 release-gate state remain unchanged.

## 9. Deferred authority

RSH-016 remains deferred and unauthorized. This contract does not create, activate or partially implement it.
