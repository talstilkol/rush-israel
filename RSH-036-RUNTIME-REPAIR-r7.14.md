# RSH-036 r7.14 — Walls and Old Jaffa: stone fill for every stone/jaffa track

Candidate, 12 September 2026. Base `3d3c378` (r7.13).
No merge or freeze; 35/67 accepted; 32 remain. Pixel leftover g07
0.2027 unchanged. `freeze_granted=false`. No PNG refresh, no RSH-037
queue activation.

Slope mesh was id-gated, so Walls (stone) and Old Jaffa (jaffa) had no
hill fill. Now `theme === "stone" || theme === "jaffa"` gets the same
200 m / +52 m walls. Walls width 22→26.

Ayalon is neither. Unchanged.

## Live

Walls day: 21/19 km/h, Jaffa Gate and the city wall in frame.
Old Jaffa day: 21/19 km/h, port streets, no water on the road.
