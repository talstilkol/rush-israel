# RSH-026 — Lock Ayalon Road Geometry, Widths and Lanes

**Unit:** RSH-026
**Implementation base:** `1714aa96dc2a0fd402eed004b591541b41bfdb83`
**Base tree:** `bc52c03279e69d0ba1bc42fe16b2235a113e2ac1`
**Branch:** `agent/rsh-026-ayalon-geometry`
**State effective on:** validated merge of the RSH-026 pull request

## Acceptance boundary

RSH-026 locks the existing Version 1 Ayalon road spline, carriageway width and
lane count. It does **not** rewrite ramps, barriers, colliders, checkpoints
(RSH-027), landmarks (RSH-028), asphalt/markings (RSH-029), physics, rendering,
saves, or grant owner freeze / GIS accuracy.

The frozen Version 1 product remains a fictional one-carriageway highway
inspired by Highway 20. The opposite carriageway is visual-only at offset
`width + 18`. The player cannot treat it as a second driveable spline.

## Locked geometry (must remain exact)

| Field | Required value |
|---|---|
| Track id | `ayalon` |
| Width | `28` |
| Lanes | `8` |
| Lane width | `3.5` (`28 / 8`) |
| Theme | `highway` |
| Open (A→B) | `true` |
| Seed | `2020` |
| West longitude | `34.795` |
| Latitude loop | `32.052` → `<= 32.106` step `0.002` |
| Sample count | `27` |
| Last sampled latitude | `32.104` |
| Opposite visual offset | `46` (`28 + 18`) |
| GIS / navigation claim | forbidden |
| Owner freeze | forbidden |

The 27-sample count is the live IEEE result of the existing inclusive loop.
This unit records that fact; it does not “fix” the loop to reach 32.106.

TLV projection used by the spline remains origin `32.075N 34.770E` with
`x = (lon - 34.77) * 94350 * 0.45` and `z = (lat - 32.075) * 111320 * 0.45`.

Elevation remains `0.5 + 1.7 * sin(tπ) + 0.85 * sin(5tπ)`.

## Runtime preservation

Track source `src/game/tracks/ayalon.ts` and `src/game/world.ts` are not
rewritten. The lock module at `src/game/ayalon-lock/` is the canonical record
later G5 units may import. Fail-closed checking proves the live tokens still
match the lock.

| Domain | Change |
|---|---:|
| Track source `src/game/tracks/ayalon.ts` | `0` |
| World / builders | `0` |
| Physics | `0` |
| Rendering | `0` |
| Save / records / recovery | `0` |
| `golden-baseline/ayalon.lock` hash | `0` |
| Assets under `public/` | `0` |
| Direct dependencies | `0` |
| Release gates green | `0` |

## Deferred boundary

RSH-027 through RSH-030 are accepted on validated merge. RSH-031 remains
deferred, unauthorized and uncreated.
