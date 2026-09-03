# RSH-031 — Lock daylight, sky and image-based lighting

**Unit:** RSH-031
**Implementation base:** `7a4451f4c55fe8aa44ad7999fc6de6e1c78c868c`
**Base tree:** `17cf5e70eac866aee7422f8f0e94279b7088683e`
**Branch:** `agent/rsh-031-daylight-sky`
**State effective on:** validated merge of the RSH-031 pull request

## Acceptance boundary

RSH-031 locks the live Version 1 daylight look, baked day sky and tiny
PMREM image-based lighting. It does **not** import an HDRI, replace the
baked `sky-day.png` with a scanned sky, rewrite `sky-assets.ts` /
`postfx.ts` / `world.ts` / engine lighting, lock night lighting
(RSH-032), calibrate 0–100 (RSH-033), or grant owner freeze / GIS
accuracy.

The frozen Version 1 daylight remains `summer14` with a non-HDRI
equirect day sky and a three-object PMREM probe. Night, headlights and
weather stay assigned to RSH-032.

## Locked daylight identity (must remain exact)

| Field | Required value |
|---|---|
| Day look | `summer14` |
| Exposure / wetness / night / vis | `0.56` / `0.18` / `0` / `1` |
| Hemisphere | `0xa8c8e8` / `0x4a5248` / `0.68` |
| Key directional | `0xfff0d0` / `1.12` |
| Fill | `0xc4d8f0` / `0.28` |
| Ambient | `0xb0c4d8` / `0.32` |
| Env intensity (boot / upgrade) | `0.7` / `0.88` |
| City fog day | density `0.00001`, far `10000`, `0x6eb4dc` |
| Day background | `0x2f8fd4` |
| Color pipeline | sRGB output + ACES filmic |
| Day sky asset | `/game/sky-day.png` 1024×512 |
| Sky mapping | EquirectangularReflectionMapping, sRGB, anisotropy 4 |
| Procedural `Sky()` mesh | present for sun aim, `visible = false` |
| Noon clock / elevation | `0.5` / `64` |
| IBL | tiny PMREM from a 3-object scene |
| HDRI / real-sky IBL | forbidden |
| GIS / navigation claim | forbidden |
| Owner freeze | forbidden |

## Runtime preservation

Track source, world, builders, physics, cars, Ayalon locks and
`golden-baseline/ayalon.lock` are not rewritten. The lock module at
`src/game/ayalon-light/` is the canonical record later G5 units may
import. Fail-closed checking proves the live tokens still match the lock.

| Domain | Change |
|---|---:|
| `src/game/sky-assets.ts` | `0` |
| `src/game/postfx.ts` | `0` |
| `src/rendering/EnvironmentState.ts` | `0` |
| `src/game/world.ts` | `0` |
| `src/game/engine.ts` | `0` |
| Track / builders / cars | `0` |
| Physics | `0` |
| Save / records / recovery | `0` |
| `golden-baseline/ayalon.lock` hash | `0` |
| Assets under `public/` | `0` |
| Direct dependencies | `0` |
| Release gates green | `0` |

## Deferred boundary

RSH-032 — Lock night lighting, headlights and weather — is accepted on
validated merge. RSH-033 remains deferred, unauthorized and uncreated.
RSH-031 does not rewrite `src/game/ayalon-night/` or RSH-033 transport files.
