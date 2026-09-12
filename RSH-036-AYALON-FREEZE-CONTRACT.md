# RSH-036 — Freeze Ayalon and hash all transitive dependencies

**Unit:** RSH-036
**Implementation base:** `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a`
**Base tree:** `566e932c949ccc246883c28e6e1778fdc9f734a3`
**Branch:** `agent/rsh-036-ayalon-freeze`
**State effective on:** validated merge of the RSH-036 pull request

## Acceptance boundary

RSH-036 records the Ayalon vertical-slice freeze and SHA-256 hashes of every
transitive Ayalon dependency that later G6–G9 units must not silently rewrite.
It does **not** regenerate golden PNGs, bump `ayalon.lock`, rewrite track /
world / physics / cars / audio / HUD / input sources or `package.json`, claim
GIS / navigation accuracy, authorise public distribution, or flip release gates.

The RSH-035 unique-pack record stays historical: `AYALON-OWNER-APPROVAL.json`
and `src/game/ayalon-golden/pack.ts` keep `freeze_granted=false`. Freeze
authority for this unit lives at `src/game/ayalon-freeze/`.

## Locked identity (must remain exact)

| Field | Required value |
|---|---|
| Track id | `ayalon` |
| Freeze granted | `true` |
| Unique authority frames | 20 |
| Non-authority placeholders | 4 (`hashalom-g04/g05/g06/ramp.png`) |
| Placeholder SHA-256 | `38a303adb7188d398628e58223973cb31d37ccf37d597da33c8ac442b4052094` |
| Pixel-golden frames | `ayalon-day-g01/g05/g07`, `ayalon-night-g08` |
| Pixel threshold / fail | `0.12` / `8%` |
| `ayalon.lock` generation | `11` |
| GIS / navigation claim | forbidden |
| Public distribution | forbidden |
| Owner-settings freeze | forbidden |
| Release gates green | `0/13` |

## Runtime preservation

Golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD /
input sources and `package.json` change by `0`.

## Deferred boundary

RSH-037 — Instrument p50, p95, p99, draw calls, triangles and memory — remains
deferred, unauthorized and uncreated. RSH-036 does not add
`src/game/perf-instrument/` or `src/game/quality-profiles/`.
