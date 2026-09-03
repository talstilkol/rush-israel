# RSH-028 — Lock Ayalon Landmark Placement

**Unit:** RSH-028
**Implementation base:** `d9b25b6ad8a035041c699d64860f9dac357b774d`
**Base tree:** `3534d98bf73f21656f7344d2c03a088f1fae698a`
**Branch:** `agent/rsh-028-ayalon-landmarks`
**State effective on:** validated merge of the RSH-028 pull request

## Acceptance boundary

RSH-028 locks the existing Version 1 Ayalon landmark placement: the nine track
POIs and the live builder placement calls. It does **not** rewrite asphalt,
sidewalks, markings or signs (RSH-029), ramps/colliders (RSH-027), road
spline/width (RSH-026), physics, rendering, saves, or grant owner freeze / GIS
accuracy.

The frozen Version 1 product remains a fictional one-carriageway highway
inspired by Highway 20. Landmark names stay inspired-by, not GIS. Placement
stays the live `place*` calls and `parkOff` / `tlv` recipes.

## Locked landmark identity (must remain exact)

| Field | Required value |
|---|---|
| Track id | `ayalon` |
| Width | `28` |
| Open (A→B) | `true` |
| Track POI count | `9` |
| Builder `place*` calls | `8` |
| Extra builder landmarks | `6` |
| GIS / navigation claim | forbidden |
| Owner freeze | forbidden |

Track POIs, in order: HaHagana Station, HaShalom Station, Savidor Center,
University Station, Azrieli, ToHa Tower, Electra Tower, Moshe Aviv Tower,
Midtown TLV.

Builder `place*` calls, in order: Azrieli 1.42, ToHa 1.28 @ 32.0695,34.7894,
City Gate 1, Midtown 1.15, Electra 1.2, Sarona 1.32, HaKirya 1.1,
Shalom Meir 1.15.

Extra builder landmarks: IBM, Yovel, Platinum, TAU campus, HaShalom tube,
Ayalon mall.

## Runtime preservation

Track source `src/game/tracks/ayalon.ts`, `src/game/world.ts`,
`src/game/world-builders/tracks/ayalon.ts` and `src/game/spline.ts` are not
rewritten. The lock module at `src/game/ayalon-landmarks/` is the canonical
record later G5 units may import. Fail-closed checking proves the live tokens
still match the lock.

| Domain | Change |
|---|---:|
| Track source `src/game/tracks/ayalon.ts` | `0` |
| World / builders | `0` |
| Spline / colliders / geometry lock | `0` |
| Physics | `0` |
| Rendering | `0` |
| Save / records / recovery | `0` |
| `golden-baseline/ayalon.lock` hash | `0` |
| Assets under `public/` | `0` |
| Direct dependencies | `0` |
| Release gates green | `0` |

## Deferred boundary

RSH-029 — Lock Ayalon asphalt, sidewalks, markings and signs — and RSH-030 —
Deliver the Version 1 hero car, LODs and silhouette gate — are accepted on
validated merge. RSH-031 remains deferred, unauthorized and uncreated.
