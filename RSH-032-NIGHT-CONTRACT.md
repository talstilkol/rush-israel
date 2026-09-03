# RSH-032 — Lock night lighting, headlights and weather

**Unit:** RSH-032
**Implementation base:** `04d922adc712a73cb0ccc7bd444a64b7b9157afd`
**Base tree:** `56b1c30df3411c828ae06dc2b03e2f46093a6902`
**Branch:** `agent/rsh-032-night-weather`
**State effective on:** validated merge of the RSH-032 pull request

## Acceptance boundary

RSH-032 locks the live Version 1 night lighting, car headlights and
weather table. It does **not** rewrite `world.ts` / `postfx.ts` /
`car-mesh.ts` / `physics.ts` / `engine.ts`, replace baked `sky-night.png`,
import an HDRI, calibrate 0–100 (RSH-033), lock audio/HUD/input
(RSH-034), or grant owner freeze / GIS accuracy.

The frozen Version 1 night remains look `night` with baked
`sky-night.png`, tiny non-HDRI PMREM, two car spots, ten street lamps
and four weather specs. Daylight stays the accepted RSH-031 `summer14`
lock. Default boot stays day / clear.

## Locked night identity (must remain exact)

| Field | Required value |
|---|---|
| Night look | `night` `1.22` / `0.22` / `1` / `0.9` |
| Nightrain look | `1.18` / `0.7` / `1` / `0.76` |
| Rain look | `0.58` / `1` / `0.08` / `0.55` |
| Hemisphere | `0x6a88b0` / `0x2a241c` / `0.52` |
| Key directional | `0xc8d4e8` / `0.38` |
| Fill (street-warm) | `0xffc070` / `0.48` |
| Ambient | `0x4a6080` / `0.28` |
| Env intensity (boot / upgrade) | `0.42` / `0.52` |
| City fog night | density `0.000045`, far `10000`, `0x2a4058` |
| Night background | `0x182436` |
| Night clock | `0.92` |
| Night sky asset | `/game/sky-night.png` 1024×512, 80 stars |
| IBL | tiny PMREM, no disc/ground at night |
| Headlight spots | `0xfff1c8` intensity `28`, dist `48` |
| Headlight emissive | night `5.2` / day `0.85` |
| Street lamps | 10 × `0xffc070` intensity `200` |
| Weather ids | `clear,rain,storm,hamsin` |
| Default boot | day / `clear` |
| HDRI / real-sky IBL | forbidden |
| GIS / navigation claim | forbidden |
| Owner freeze | forbidden |

## Runtime preservation

Track source, world, builders, physics, cars, Ayalon locks, daylight
lock and `golden-baseline/ayalon.lock` are not rewritten. The lock
module at `src/game/ayalon-night/` is the canonical record later G5
units may import. Fail-closed checking proves the live tokens still
match the lock.

| Domain | Change |
|---|---:|
| `src/game/sky-assets.ts` | `0` |
| `src/game/postfx.ts` | `0` |
| `src/rendering/EnvironmentState.ts` | `0` |
| `src/game/world.ts` | `0` |
| `src/game/engine.ts` | `0` |
| `src/game/car-mesh.ts` | `0` |
| `src/game/physics.ts` | `0` |
| `src/game/ayalon-light/` | `0` |
| Track / builders / cars | `0` |
| Save / records / recovery | `0` |
| `golden-baseline/ayalon.lock` hash | `0` |
| Assets under `public/` | `0` |
| Direct dependencies | `0` |
| Release gates green | `0` |

## Deferred boundary

RSH-033 — Calibrate driving physics and the five-car performance table —
remains deferred, unauthorized and uncreated. RSH-032 does not add
`src/game/ayalon-physics/` or RSH-033 transport files.
