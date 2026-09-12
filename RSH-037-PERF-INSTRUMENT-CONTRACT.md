# RSH-037 — Instrument p50, p95, p99, draw calls, triangles and memory

**Unit:** RSH-037
**Implementation base:** `4904161cc786061acc11942f76ed5666eb5ed61f`
**Base tree:** `2aa37f2b3508e9df3fd52a3bcf2af5533b90dab8`
**Branch:** `agent/rsh-037-perf-instrument`
**State effective on:** validated merge of the RSH-037 pull request

## Acceptance boundary

RSH-037 locks the live performance instrumentation that later G6 units
consume. It records frame-time percentiles (p50/p95/p99), draw calls,
triangles and memory sampling. It does **not** define quality profiles
(RSH-038), enforce bundle/streaming budgets (RSH-039), accept a real-device
baseline (P1-13 / RSH-043), rewrite frozen Ayalon sources, or flip release
gates.

Live sampling already exists in `src/rendering/RenderTelemetry.ts` and the
RSH-017 engine adapters. This unit canonicalises that surface at
`src/game/perf-instrument/` and fail-closes if it disappears.

## Locked identity (must remain exact)

| Field | Required value |
|---|---|
| Sample cap | 120 |
| Percentiles | 50, 95, 99 |
| Draw calls | `renderer.info.render.calls` |
| Triangles | `renderer.info.render.triangles` |
| GPU memory | `renderer.info.memory.textures` / `geometries` |
| JS heap | optional `performance.memory.usedJSHeapSize` |
| Budgets enforced | false |
| Quality profiles | false |
| Real-device baseline accepted | false |
| GIS / navigation claim | forbidden |
| Public distribution | forbidden |
| Ayalon freeze | remains granted, 36 hashes unchanged |
| Release gates green | `0/13` |

## Runtime preservation

Golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio /
HUD / input sources, engine adapters and `package.json` change by `0`.

## Deferred boundary

RSH-038 — Define quality profiles and dynamic-quality hysteresis — remains
deferred, unauthorized and uncreated. RSH-037 does not add
`src/game/quality-profiles/`.
