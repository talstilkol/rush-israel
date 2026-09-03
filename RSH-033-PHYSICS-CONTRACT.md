# RSH-033 — Calibrate driving physics and the five-car performance table

**Unit:** RSH-033
**Implementation base:** `f8d055c86b80ba1a72555e41668e071f74b32536`
**Branch:** `agent/rsh-033-physics-calibration`
**State effective on:** validated merge of the RSH-033 pull request

## Acceptance boundary

RSH-033 calibrates Version 1 launch physics so the five fictional
`zeroTo100` claims stay inside the live `qa:accel` claim band. It does
**not** rewrite `cars.ts`, `package.json`, Ayalon / daylight / night
locks, import GIS/navigation accuracy, freeze owner settings, start
public distribution, or add RSH-034 audio / HUD / input structure.

`PHYSICS_VERSION` becomes `7`. The five claims stay
`8.4 / 6.6 / 4.9 / 5.8 / 3.5`. Launch uses `launchAccel` with
aero/rolling compensation below `V100_MPS` so net 0–100 matches the
claim band `±15%`. Gear dump `speed *= 0.94` is not applied while
`|speed| <= V100_MPS`. `qa:accel` fails closed on `claimGaps` as well
as regression drift.

## Locked calibration identity

| Field | Required value |
|---|---|
| Physics version | `7` |
| Physics rate | `120` Hz |
| `V100_MPS` | `27.778` |
| Claim tolerance | `0.15` |
| Sabra / Carmel / Kfir / Negev / Yam | `8.4 / 6.6 / 4.9 / 5.8 / 3.5` |
| `cars.ts` rewritten | forbidden |
| Gear dump below `V100_MPS` | forbidden |
| Launch drag compensation | required |
| GIS / navigation claim | forbidden |
| Owner freeze | forbidden |
| Public distribution | forbidden |

## Deferred boundary

RSH-034 — Lock audio, HUD and input — remains deferred, unauthorized
and uncreated. RSH-033 does not add `src/game/ayalon-feel/` or RSH-034
transport files.
