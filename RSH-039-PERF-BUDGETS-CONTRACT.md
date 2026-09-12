# RSH-039 — Set bundle, asset-streaming and cache budgets

**Unit:** RSH-039
**Implementation base:** `817ab7ed71d396b200188b16c27d627a1f2d7814`
**Base tree:** `dae1cddef51270ccdcf085df12db52164fff383b`
**Branch:** `agent/rsh-039-perf-budgets`
**State effective on:** validated merge of the RSH-039 pull request

## Acceptance boundary

RSH-039 locks the live bundle, streaming and cache budgets that later G6
units consume. It records the existing cache-header contract, forbids
production `finishNow` / mesh-or-glTF streaming, and pins the Ayalon
draw-call target. It does **not** claim desktop/mobile performance gates
are green, run leak cycles (RSH-040), accept a real-device baseline
(P1-13 / RSH-043), rewrite frozen Ayalon / engine-adapter / HUD / package
sources, or flip release gates 8–9.

Live cache already exists in `server/middleware/game-cache.ts` and
`scripts/cache-headers-smoke.mjs`. This unit canonicalises that surface at
`src/game/perf-budgets/` and fail-closes if it disappears or drifts.

## Locked identity (must remain exact)

| Field | Required value |
|---|---|
| Cache paths | `/game/`, `/basis/` |
| Asset cache | `public, max-age=31536000, immutable` |
| HTML cache | `no-cache` |
| glTF / mesh streaming | false |
| Streaming music | false |
| Draw-call target | 80 |
| Production `finishNow` | forbidden |
| Leak cycles enforced | false |
| Real-device baseline accepted | false |
| GIS / navigation claim | forbidden |
| Public distribution | forbidden |
| Ayalon freeze | remains granted, 36 hashes unchanged |
| Release gates green | `0/13` |

## Runtime preservation

Golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio /
HUD / input sources, engine adapters, quality-profile live sources,
`game-cache.ts`, `cache-headers-smoke.mjs` and `package.json` change by `0`.

## Deferred boundary

RSH-040 — Pass 20 race enter-exit cycles without a resource leak — remains
deferred, unauthorized and uncreated. RSH-039 does not add
`src/game/leak-cycles/`.
