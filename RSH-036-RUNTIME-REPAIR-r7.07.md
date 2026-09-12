# RSH-036 r7.07 — Eilat sea at night; Acre moonlight; jaffa night fill

Candidate, 12 September 2026. Base `0014237` (r7.06).
No merge or freeze; 35/67 accepted; 32 remain. Pixel leftover g07
0.2027 unchanged. `freeze_granted=false`. No PNG refresh, no RSH-037
queue activation.

## Product

Jaffa-theme nights (Acre, Old Jaffa) still used city gray ground and dim
fill. Hint overlay lingered past 16 km/h. Acre/Caesarea ribbon was 20 m.

| item | repair |
|---|---|
| moonlight | jaffa joins desert/snow/stone night fill |
| fog | jaffa uses stone nightCol, not city |
| acre / caesarea | width 20→24 |
| hint | hide above 8 km/h or 6 s |

Ayalon is not jaffa. City applyLights defaults unchanged.

## Live

Eilat night: 21/19 km/h, Red Sea left of the ribbon, road in frame.
Acre night: 21/19 km/h, walls and harbor street in frame.
