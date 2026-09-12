# RSH-038 — Define quality profiles and dynamic-quality hysteresis

**Unit:** RSH-038
**Implementation base:** `91754100fc6a5d7bfc852e6aafa28cd17c1762ba`
**Base tree:** `2e09ed141e6658168889e8030ea19f97f526b746`
**Branch:** `agent/rsh-038-quality-profiles`
**State effective on:** validated merge of the RSH-038 pull request

## Acceptance boundary

RSH-038 locks the live quality-profile set and dynamic-quality hysteresis
that later G6 units consume. It records five profiles (compat / balanced /
high / ultra / photo) and the existing drop/raise hysteresis. It does
**not** enforce bundle, streaming or cache budgets (RSH-039), accept a
real-device baseline (P1-13 / RSH-043), rewrite frozen Ayalon / engine-
adapter / HUD / package sources, or flip release gates.

Live profiles already exist in `src/rendering/QualityProfile.ts` and
hysteresis already exists in `src/rendering/DynamicQualityController.ts`.
This unit canonicalises that surface at `src/game/quality-profiles/` and
fail-closes if it disappears or drifts.

## Locked identity (must remain exact)

| Field | Required value |
|---|---|
| Profiles | compat, balanced, high, ultra, photo |
| Legacy map | low→compat, mid→balanced, high→high |
| Drop threshold | p95 > 20 ms |
| Drop hold | 90 frames |
| Raise threshold | p95 < 16 ms |
| Raise hold | 5 s |
| Max step | 8 |
| Drop order | planar → bloom → CSM → pixelExtra |
| Budgets enforced | false |
| Real-device baseline accepted | false |
| GIS / navigation claim | forbidden |
| Public distribution | forbidden |
| Ayalon freeze | remains granted, 36 hashes unchanged |
| RSH-037 instrument lock | unchanged (`QUALITY_PROFILES_DEFINED = false` stays historical) |
| Release gates green | `0/13` |

## Runtime preservation

Golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio /
HUD / input sources, engine adapters, `QualityProfile.ts`,
`DynamicQualityController.ts`, `src/game/perf-instrument/metrics.ts` and
`package.json` change by `0`.

## Deferred boundary

RSH-039 — Set bundle, asset-streaming and cache budgets — remains
deferred, unauthorized and uncreated. RSH-038 does not add
`src/game/perf-budgets/`.
