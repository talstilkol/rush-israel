# RSH-036 r7.03 — Ramon night descent is no longer a black void

Candidate, 12 September 2026. Base `87058bc` (r7.02).
No merge or freeze; 35/67 accepted; 32 remain. Pixel leftover g07
0.2027 unchanged. `freeze_granted=false`. No PNG refresh, no RSH-037
queue activation.

## Product (owner screenshot: התצפית, 0 km/h, pitch black)

Ramon/Hermon had **zero** lamps. Night `setClock` recolored ground to
city gray `0x5a626c`. `applyLights` at spawn was dimmer than the tick
path. Headlights were 28 / 48 m.

| item | repair |
|---|---|
| desert/snow night | moonlight hemi 1.18 / dir 1.05 / ambient 0.78 |
| ground | ochre `0x4a3224` (snow `0x6a7888`); city stays `0x5a626c` |
| ramon/hermon lamps | samples/12 roadside posts |
| headlights | 92 / 88 m, wider cone |
| desert fog | nightCol `0x2c3c4c` |

Ayalon city night ground and applyLights defaults unchanged.

## Live (Ramon night)

Spawn התצפית: 14–21 km/h, road + lamps in frame.
Mid descent t=0.28: 27 km/h, y 168→121, onTrack, headlights on asphalt.
