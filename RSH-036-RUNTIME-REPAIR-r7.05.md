# RSH-036 r7.05 — chase cam looks at the road, not the sky

Candidate, 12 September 2026. Base `e2dde8c` (r7.04).
No merge or freeze; 35/67 accepted; 32 remain. Pixel leftover g07
0.2027 unchanged. `freeze_granted=false`. No PNG refresh, no RSH-037
queue activation.

## Product

Dead Sea night chase filled the frame with sky (owner-class defect from
Ramon/Jerusalem). look-ahead sampled a point and then *lifted* the camera
to it, so lookAt pitched up. Hotels also shoved the chase slot sideways.

| item | repair |
|---|---|
| look-ahead | shorter, lookY = asphalt + 0.22 |
| lift | only when the road ahead is actually a climb |
| pitch | lookY ≤ cam.y − 0.45 (always slightly down) |
| slot | pull XZ back to the chase slot if colliders shove > 3.4 m |
| stone/snow/carmel night fog | slightly brighter, Ayalon city fog unchanged |
| masada | width 20→26 |

## Live

Dead Sea night: 19 km/h, road + hotels in frame, not sky.
Masada night climb: 18→19→16 km/h, y 2.9→35, fortress in frame.
