# RSH-017 — Engine adapter contract

- Unit: `RSH-017`
- Owner instruction: plain `next`, authorising exactly one queue-head unit
- Verified `main` base: `ec35e159a9722812d945eaab984f9dc92645205f`
- Base tree: `8aff09cb4cc582a240f99a8711d56780fd60acb9`
- Branch: `agent/rsh-017-engine-adapters`
- Source baseline: `src/game/engine.ts` — **2,815 lines / 99,577 bytes**
- Baseline SHA-256: `3f4d54bbe0b68f9654ae8a92a2f56ce378a59a9790e8fbbe2ee05199ced192c1`
- Baseline Git blob: `692663c6d05ab59c1d99c7a357999839b9ebb0ec`

## Boundary

1. `src/game/engine.ts` remains the sole concrete `RaceEngine` state, constructor, assembly and disposal owner.
2. Exactly four concern adapters exist: loop, rendering, physics and QA.
3. Exactly **58** existing methods are extracted without changing their bodies; the facade delegates through `Function.call` to the same concrete instance.
4. No adapter owns persistent engine state, instantiates a second engine or imports another adapter.
5. The accepted RSH-016 `engine.ts` reconstructs byte-for-byte from the facade wrappers and adapter bodies.
6. Public `RaceEngine` methods, QA hook shape, fixed 120 Hz physics, rendering, save/record, track, asset and dependency behaviour remain unchanged.
7. RSH-018 UI/HUD/race-controller decomposition is not created or authorised.

## Canonical adapter set

| Concern | Path | Methods | Lines | Bytes | SHA-256 |
|---|---|---:|---:|---:|---|
| loop | `src/game/engine/loop-adapter.ts` | 5 | 166 | 4,975 | `88d8f39ff363664cc0a0ab965f7d9a174377961b8683d0752b200769439262c8` |
| rendering | `src/game/engine/rendering-adapter.ts` | 28 | 850 | 31,856 | `079e0b2c1d1e73b5605686ba03d137528746396e8d3a9d425bc746aa757aa10f` |
| physics | `src/game/engine/physics-adapter.ts` | 23 | 747 | 26,040 | `5dac2313c067ec4a84424bdeea3baabe640cec1ab416392ba156b8f337c0d620` |
| qa | `src/game/engine/qa-adapter.ts` | 2 | 442 | 13,198 | `973b8606f5e417e9477bf4b07a2bf8fba49b500003833a9e0d76396ad903730c` |

Support authority: `src/game/engine/adapter-host.ts` — 206 lines / 7,539 bytes.

## Exact source dimensions

| Metric | Before | RSH-017 candidate | Change |
|---|---:|---:|---:|
| `engine.ts` lines | 2,815 | 1,202 | −1,613 |
| `engine.ts` bytes | 99,577 | 40,417 | −59,160 |
| Adapter files | 0 | 4 | +4 |
| Extracted methods | 0 | 58 | +58 |
| Adapter source | 0 | 2,209 lines / 77,220 bytes | added |
| Complete engine source including facade/support | 2,815 lines / 99,577 bytes | 3,622 lines / 126,462 bytes | structural decomposition |

## Preservation

- runtime-behaviour changes: **0**;
- public API changes: **0**;
- physics changes: **0**;
- rendering-behaviour changes: **0**;
- QA-interface changes: **0**;
- track-data and track-order changes: **0**;
- asset and dependency changes: **0**;
- save/record changes: **0**;
- physics remains **120 Hz**;
- catalogue remains **56** tracks: **8 MVP / 48 deferred**;
- unverified public asset files remain **66**;
- public distribution remains unauthorised;
- release gates remain **0/13**.

## Validation

`ENGINE-ADAPTER-MANIFEST.json`, `scripts/load-engine-adapters.mjs`, `scripts/check-engine-adapters.mjs` and `scripts/check-engine-adapters.test.mjs` fail closed on adapter count/order/identity, missing or duplicate methods, adapter cross-imports, facade bypass, wrapper drift, historical reconstruction drift, preserved-source drift, transfer-file residue, unmanifested engine files and RSH-018 precreation.

The unit becomes accepted only after exact-head `required-ci / validate`, exact-head Codex review with no blocking findings, resolved review threads, merge, and successful post-merge required CI.

## Exact Type Boundary

- the host declares exactly **199** adapter-visible RaceEngine members;
- every host member uses its exact `RaceEngine["member"]` type;
- every adapter parameter is bound to `Parameters<RaceEngine["method"]>[index]`;
- adapter return types are inferred from the preserved accepted method bodies;
- every facade wrapper crosses one explicit `engineAdapterHost(this)` bridge;
- index signatures, ambient module overloads and `any` are forbidden in the host boundary.
