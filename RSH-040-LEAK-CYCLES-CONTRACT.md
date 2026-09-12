# RSH-040 — Pass 20 race enter-exit cycles without a resource leak

**Unit:** RSH-040
**Implementation base:** `da690504d360a5b06f53783e9f86e0d7bf73cc01`
**Base tree:** `5555ead41e9eb263accaac1bb51bdcb02d71900b`
**Branch:** `agent/rsh-040-leak-cycles`
**State effective on:** validated merge of the RSH-040 pull request

## Acceptance boundary

RSH-040 locks the live 20-cycle menu→race enter-exit leak contract that
later G6 units consume. It records the existing ResourceRegistry
idempotent `disposeAll`, Object3D disposal tracker, engine/world dispose
order, and the Playwright 20-cycle soak harness (`dTex≤2`, `dGeo≤2`).
Required CI keeps the 2-cycle soak-smoke; `package.json` stays frozen so
the 20-cycle Playwright job is not added to the required gate.

It does **not** recover WebGL context loss (RSH-041), run the 30-minute
soak (RSH-042), accept a real-device baseline (P1-13), close P2-09, rewrite
frozen Ayalon / engine-adapter / HUD / stream-flag / package sources, or
flip release gates.

Live surfaces already exist in `src/rendering/ResourceRegistry.ts`,
`src/rendering/disposeObject3D.ts`, `scripts/soak-menu-race.mjs` and
`scripts/soak-smoke.mjs`. This unit canonicalises those surfaces at
`src/game/leak-cycles/` and fail-closes if they disappear or drift.

## Locked identity (must remain exact)

| Field | Required value |
|---|---|
| Enter-exit cycles | 20 |
| Required-CI soak-smoke cycles | 2 |
| Texture delta max | 2 |
| Geometry delta max | 2 |
| `disposeAll` idempotent | true (`dead=true`, second call `alreadyDisposed`) |
| Context-loss enforced | false |
| 30-minute soak enforced | false |
| Real-device baseline accepted | false |
| P1-13 | remains OPEN |
| P2-09 | remains OPEN (no JS/asset byte-size CI check) |
| GIS / navigation claim | forbidden |
| Public distribution | forbidden |
| Ayalon freeze | remains granted, 36 hashes unchanged |
| Release gates green | `0/13` |

## Runtime preservation

Golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio /
HUD / input sources, engine adapters, quality-profile live sources,
`game-cache.ts`, `cache-headers-smoke.mjs`, `stream-flag.ts`,
`ResourceRegistry.ts`, `disposeObject3D.ts`, soak harnesses and
`package.json` change by `0`.

## Deferred boundary

RSH-041 — Pass WebGL context-loss and recovery tests — remains deferred,
unauthorized and uncreated. RSH-040 does not add `src/game/context-loss/`.
