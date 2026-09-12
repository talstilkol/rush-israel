# RSH-036 r7.06 — countdown + drive hint; stone night moonlight; Scopus climbs

Candidate, 12 September 2026. Base `3e7561d` (r7.05).
No merge or freeze; 35/67 accepted; 32 remain. Pixel leftover g07
0.2027 unchanged. `freeze_granted=false`. No PNG refresh, no RSH-037
queue activation.

## Product

HUD never showed the 1.45 s countdown, so W looked dead at spawn. Stone
night (Scopus / Walls / Jerusalem) used city moonlight, not the desert
fill from r7.03.

| item | repair |
|---|---|
| countdown | large 3-2-1 in the HUD |
| first-drive hint | `W גז · A שמאלה · D ימינה` until 14 km/h / 9 s |
| moonlight | stone + scopus join desert/snow night fill |
| eilat | width 20→24 |

Ayalon is not stone. City applyLights defaults unchanged.

## Live (Scopus night)

Spawn: hint on screen, road visible.
Climb: 19→19→15 km/h, y 5.6→67, onTrack, camera on asphalt.
