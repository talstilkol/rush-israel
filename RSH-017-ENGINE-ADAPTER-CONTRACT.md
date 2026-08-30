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
| loop | `src/game/engine/loop-adapter.ts` | 5 | 166 | 4,975 | `ab4c7f8378d426506ae3655f4b429bfe392bde0c31783733eeeea99a53edf06c` |
| rendering | `src/game/engine/rendering-adapter.ts` | 28 | 850 | 31,856 | `11a9e1716c977e3c2d4e4050358540ee0d6eb85ee93f2d297749e447b34cdb0d` |
| physics | `src/game/engine/physics-adapter.ts` | 23 | 747 | 26,040 | `d888b4fd944ad9ebd06353a080be84187c27ac65329e5271aeeec7471f402aa2` |
| qa | `src/game/engine/qa-adapter.ts` | 2 | 442 | 13,198 | `24f3b27cbe097d5ec70646cc1760e706e44e4ecac73c434d208735ab53c6fcc0` |

Support authority: `src/game/engine/adapter-host.ts` — 4 lines / 243 bytes.

## Exact source dimensions

| Metric | Before | RSH-017 candidate | Change |
|---|---:|---:|---:|
| `engine.ts` lines | 2,815 | 1,202 | −1,613 |
| `engine.ts` bytes | 99,577 | 40,417 | −59,160 |
| Adapter files | 0 | 4 | +4 |
| Extracted methods | 0 | 58 | +58 |
| Adapter source | 0 | 2,205 lines / 76,069 bytes | added |
| Complete engine source including facade/support | 2,815 lines / 99,577 bytes | 3,411 lines / 116,729 bytes | structural decomposition |

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
