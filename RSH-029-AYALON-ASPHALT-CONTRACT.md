# RSH-029 — Lock Ayalon Asphalt, Sidewalks, Markings and Signs

**Unit:** RSH-029
**Implementation base:** `e068f7a93b7a9d2febb86d25a7e9ba57f5733a39`
**Base tree:** `2a1878e6c49ec3bb8c06a93d737110ff724a49e4`
**Branch:** `agent/rsh-029-ayalon-asphalt`
**State effective on:** validated merge of the RSH-029 pull request

## Acceptance boundary

RSH-029 locks the existing Version 1 Ayalon road surface, sidewalk policy,
lane markings and sign/gantry recipes. It does **not** rewrite the hero car
(RSH-030), landmarks (RSH-028), ramps/colliders (RSH-027), road spline/width
(RSH-026), physics, rendering, saves, or grant owner freeze / GIS accuracy.

The frozen Version 1 product remains a fictional one-carriageway highway
inspired by Highway 20. Asphalt stays the baked 8-lane kit. Sidewalks stay
absent on Ayalon (highway theme). Markings stay live edge/dash/chevron/arrow
tokens. Signs stay the live gantry, station and speed-90 recipes.

## Locked asphalt / marking / sign identity (must remain exact)

| Field | Required value |
|---|---|
| Track id | `ayalon` |
| Width | `28` |
| Open (A→B) | `true` |
| Asphalt lanes / kit | `8` |
| Asphalt assets | `asphalt-8.png` + rough + bump |
| Road material | bump `0.36`, roughness `0.48`, clearcoat `0.28` |
| Ramp asphalt | bump `0.18`, roughness `0.45`, clearcoat `0.22` |
| Sidewalks on Ayalon | absent (`false`) |
| Shared sidewalk asset | `/game/sidewalk.png` (not placed on Ayalon) |
| Dash opposite offset | `width + 18` |
| Chevron count / scale | `48` / `1.55` |
| Arrow gantries | `7` latitudes × `2` longitudes, `8` arrows each |
| Interchange gantries | `6` |
| Station gantries | `5` |
| Interchange speed sign | `speed90` |
| GIS / navigation claim | forbidden |
| Owner freeze | forbidden |

## Runtime preservation

Track source `src/game/tracks/ayalon.ts`, `src/game/world.ts`,
`src/game/world-builders/tracks/ayalon.ts`, `src/game/road-assets.ts`,
`src/game/sign-assets.ts` and `src/game/spline.ts` are not rewritten. The
lock module at `src/game/ayalon-asphalt/` is the canonical record later G5
units may import. Fail-closed checking proves the live tokens still match
the lock.

| Domain | Change |
|---|---:|
| Track source `src/game/tracks/ayalon.ts` | `0` |
| World / builders | `0` |
| Spline / colliders / geometry / landmark lock | `0` |
| Physics | `0` |
| Rendering | `0` |
| Save / records / recovery | `0` |
| `golden-baseline/ayalon.lock` hash | `0` |
| Assets under `public/` | `0` |
| Direct dependencies | `0` |
| Release gates green | `0` |

## Deferred boundary

RSH-030 — Deliver the Version 1 hero car, LODs and silhouette gate — is accepted
on validated merge. RSH-031 is accepted on validated merge. RSH-032 is accepted on validated merge. RSH-033 remains deferred, unauthorized and uncreated.
