# RSH-036 r7.01 — Jerusalem night Jaffa Gate flicker

Candidate, 12 September 2026. Base `97e2fca` (r7.00).
No merge or freeze; 35/67 accepted; 32 remain. Pixel leftover g07
0.2027 unchanged. `freeze_granted=false`. No PNG refresh, no RSH-037
queue activation.

## Product (owner screenshot: Mahane Yehuda night, 1 km/h, camera in the sky)

Night ribbon flicker was horizontal puddles + additive lamp pools at
y+0.055 on a sloped road, plus 10 SpotLights at intensity 200 teleporting
every frame. Chase look-at used car Y while the camera sat on the lower
sample, so the frame was sky.

| item | repair |
|---|---|
| puddles / lamp pools | Ayalon only. Other tracks use road clearcoat, not overlay decals |
| night spots | non-ayalon: 3 × 48 (Ayalon stays 10 × 200) |
| chase cam | look-at samples the ribbon; camera stays ≥ lookY+1.2 |

Ayalon night path unchanged.

## Live (Jerusalem · Jaffa Gate, night)

Spawn Mahane Yehuda: 22 km/h, onTrack, road in frame.
Mid (t=0.35, Jaffa Gate): 32 km/h, A dYaw **+0.234**, headlights on asphalt.

## Freeze

`world.ts` hash retargeted. Checker 6/6. Typecheck clean.
