# RSH-027 — Lock Ayalon Ramps, Barriers, Colliders and Checkpoints

**Unit:** RSH-027
**Implementation base:** `dddae060b76ac2b4abe8de1046a374e8eb7725fc`
**Base tree:** `2e5ae4dcae29815561c96d69fcdfddc46e318bcb`
**Branch:** `agent/rsh-027-ayalon-colliders`
**State effective on:** validated merge of the RSH-027 pull request

## Acceptance boundary

RSH-027 locks the existing Version 1 Ayalon interchange ramps, edge barriers,
infrastructure colliders and open-track checkpoint fractions. It does **not**
rewrite landmarks (RSH-028), asphalt/markings (RSH-029), road spline/width
(RSH-026), physics, rendering, saves, or grant owner freeze / GIS accuracy.

The frozen Version 1 product remains a fictional one-carriageway highway
inspired by Highway 20. Ramps stay interchange-local. Edge barriers stay
visual/physical walls at `width/2 + 1.55`. Checkpoints stay the live open
formula `(i + 1) / (count + 0.15)`.

## Locked collider/ramp identity (must remain exact)

| Field | Required value |
|---|---|
| Track id | `ayalon` |
| Width | `28` |
| Open (A→B) | `true` |
| Checkpoint count | `8` |
| Checkpoint formula | `(i + 1) / 8.15` |
| Interchanges | `6` |
| Ramps per interchange | `7` |
| Extra Galuyot / LaGuardia / flyovers | `4` / `2` / `2` |
| Total ramps | `50` |
| Deck height | `9.4` |
| Approach length / half | `68` / `10.2` |
| Barrier wall extra | `1.55` |
| Barrier radii | `+0.62` / `-1.05` |
| GIS / navigation claim | forbidden |
| Owner freeze | forbidden |

Named interchanges, in order: Kibbutz Galuyot, HaHagana, LaGuardia, HaShalom,
Savidor Center, University.

## Runtime preservation

Track source `src/game/tracks/ayalon.ts`, `src/game/world.ts`,
`src/game/world-builders/tracks/ayalon.ts` and `src/game/spline.ts` are not
rewritten. The lock module at `src/game/ayalon-colliders/` is the canonical
record later G5 units may import. Fail-closed checking proves the live tokens
still match the lock.

| Domain | Change |
|---|---:|
| Track source `src/game/tracks/ayalon.ts` | `0` |
| World / builders | `0` |
| Spline checkpoint formula | `0` |
| Physics | `0` |
| Rendering | `0` |
| Save / records / recovery | `0` |
| `golden-baseline/ayalon.lock` hash | `0` |
| Assets under `public/` | `0` |
| Direct dependencies | `0` |
| Release gates green | `0` |

## Deferred boundary

RSH-028 — Lock Ayalon landmark placement — is accepted on validated merge.
RSH-029 — Lock Ayalon asphalt, sidewalks, markings and signs — remains deferred,
unauthorized and uncreated.
