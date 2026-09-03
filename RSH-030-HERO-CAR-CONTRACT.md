# RSH-030 — Deliver the Version 1 Hero Car, LODs and Silhouette Gate

**Unit:** RSH-030
**Implementation base:** `a42a99bed98c4a55b343e744cf374e68d3b51899`
**Base tree:** `6337499af1a77cdc6f5516758b8f2c845aad3c43`
**Branch:** `agent/rsh-030-hero-car`
**State effective on:** validated merge of the RSH-030 pull request

## Acceptance boundary

RSH-030 delivers the Version 1 hero-car identity, LOD table and silhouette
gate from the live five fictional extruded Meshopt cars. It does **not**
import a scanned or licensed real vehicle, rewrite `car-mesh.ts` /
`cars.ts` / `car-assets.ts`, calibrate 0–100 (RSH-033), lock lighting
(RSH-031/RSH-032), or grant owner freeze / GIS accuracy.

The frozen Version 1 product remains five fictional vehicles. The sandbox
has no user-supplied hero glTF; generating a fake scan is forbidden.
Existing `public/game/car-{gt,hatch,muscle,rally,super}.glb` bodies stay
the Version 1 hero. LOD policy is recorded for later G6 import. The
silhouette gate pins a 64×24 binary side profile per body kind.

## Locked hero-car identity (must remain exact)

| Field | Required value |
|---|---|
| Car count | `5` |
| IDs | `sabra`, `carmel`, `kfir`, `negev`, `yam` |
| Bodies | `gt`, `hatch`, `muscle`, `rally`, `super` |
| Identity | fictional |
| Scanned / photogrammetry claim | forbidden |
| Licensed real models | forbidden |
| User-supplied hero glTF | absent |
| Body mesh name | `body` |
| Asset pattern | `/game/car-${kind}.glb` |
| LOD0 / LOD1 / LOD2 triangle caps | `40000` / `12000` / `4000` |
| LOD distances | `<40` / `40–90` / `>90` |
| Player car LOD | always LOD0 |
| Live body triangles | `276/256/276/256/256` (gt/hatch/muscle/rally/super) |
| Silhouette gate | `64×24`, 5 distinct hashes |
| GIS / navigation claim | forbidden |
| Owner freeze | forbidden |

Published 0–100 numbers stay the live table and are **not** calibrated here.

## Runtime preservation

Track source, world, builders, physics, rendering, saves, Ayalon locks and
`golden-baseline/ayalon.lock` are not rewritten. The lock module at
`src/game/hero-car/` is the canonical record later G5/G6 units may import.
Fail-closed checking proves the live tokens still match the lock.

| Domain | Change |
|---|---:|
| `src/game/cars.ts` | `0` |
| `src/game/car-mesh.ts` | `0` |
| `src/game/car-assets.ts` | `0` |
| Track / world / builders | `0` |
| Physics | `0` |
| Rendering | `0` |
| Save / records / recovery | `0` |
| `golden-baseline/ayalon.lock` hash | `0` |
| Assets under `public/` | `0` |
| Direct dependencies | `0` |
| Release gates green | `0` |

## Deferred boundary

RSH-031 — Lock daylight, sky and image-based lighting — is accepted on
validated merge. RSH-032 — Lock night lighting, headlights and weather —
remains deferred, unauthorized and uncreated.
