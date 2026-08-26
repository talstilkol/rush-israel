# Codex audit — 26 Aug 2026 late morning (honest)

**~12%.** Ship gates **0/13**. Not GT7. Not Asphalt.

## 1. Strategy
| Item | Status | 100? |
|---|---|---|
| Ultra WebGPU | NOT DONE | no |
| Balanced WebGPU/WebGL2 | PARTIAL | no — SMAA High only |
| Compat WebGL2 | PARTIAL | no |
| Photo Mode | NOT DONE | no |

## 25. Top ten
| # | Item | Status | 100? |
|---|---|---|---|
| 1 | Hero car | PARTIAL | no — extrude GLB Meshopt |
| 2 | Real road | FAKED if checked | procedural PNG |
| 3 | Physical lighting | PARTIAL | dielectric, no HDRI |
| 4 | glTF/KTX2/Meshopt | PARTIAL | Meshopt DONE; **zero .ktx2** |
| 5 | World cells | NOT DONE | |
| 6 | Wet road | PARTIAL | |
| 7 | WebGPU+TSL | NOT DONE | |
| 8 | CSM+probes | PARTIAL | 2 dir lights, CubeCamera 96 |
| 9 | TRAA | NOT DONE | SMAA only |
| 10 | SSGI/weather | NOT DONE | |

## G0–G6
| Item | Status |
|---|---|
| G0 Low→screen | DONE |
| G1 road specular | PARTIAL |
| G3 flakes+probe | PARTIAL |
| G4 blob | PARTIAL |
| G5 facade photos | FAKED |
| G6 headlights | PARTIAL |

## P0–P5
| Item | Status |
|---|---|
| P0 road mesh | PARTIAL |
| P1 HDRI | NOT DONE (2D sky) |
| P2 5 cars | PARTIAL |
| P3 4-wheel physics | PARTIAL — Pacejka + visual travel. Not 4 independent dampers |
| P4 Ayalon | PARTIAL — silhouettes + 18m median. Not GIS |
| P4 Rothschild | PARTIAL — ficus/Habima/Independence Hall primitives |
| P4 Hayarkon/Reading | PARTIAL — plant off-road, chimneys stay |
| P4 Jaffa | PARTIAL — clock + vault boxes |
| P4 Jerusalem/Ramon/Hermon/Carmel | PARTIAL |
| P5 UI+Esc | DONE |
| P5 60fps soak | NOT DONE |
| P5 real track photos | NOT DONE |

## Still canvas in src (~28 createElement)
Fallbacks + mkSign + NYC LED + buildings motza. **E3 NOT DONE.**

## Since last audit (did not raise %)
Median 18m, pitch visual, wheel travel visual, Rothschild ficus/Habima, Reading off-road, Jaffa vaults. All primitives.

## FAKED if anyone ticked
Photogrammetry · GIS · WebGPU · KTX2 files · “no generic buildings” globally · world-class graphics.
