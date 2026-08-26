# Codex audit — 26 Aug 2026 11:19 IDT (honest)

**~12%.** Ship gates **0/13**. Not GT7. Not Asphalt.

## 1. Strategy
| Item | Status | 100? |
|---|---|---|
| Ultra WebGPU | NOT DONE | no `WebGPURenderer` in src |
| Balanced WebGPU/WebGL2 | PARTIAL | SMAA on High |
| Compat WebGL2 | PARTIAL | Low skips composer |
| Photo Mode | NOT DONE | |

## 25. Top ten
| # | Item | Status | 100? |
|---|---|---|---|
| 1 | Hero car | PARTIAL | extrude GLB Meshopt |
| 2 | Real road | FAKED if checked | procedural PNG |
| 3 | Physical lighting | PARTIAL | dielectric, no HDRI |
| 4 | glTF/KTX2/Meshopt | PARTIAL | Meshopt yes; **zero .ktx2 files** |
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
| P1 HDRI | NOT DONE (2D baked sky) |
| P2 5 cars | PARTIAL |
| P3 physics | PARTIAL — Pacejka + visual travel + grade*g |
| P4 Ayalon | PARTIAL — silhouettes, 18m median, 8-lane UV |
| P4 Rothschild | PARTIAL — ficus/Habima/Independence Hall primitives |
| P4 Reading | PARTIAL — plant off-road, chimneys |
| P4 Jaffa | PARTIAL — clock + vault boxes |
| P4 Jerusalem | PARTIAL — Gate off-road, steeper hills, thinner fog. Not DEM |
| P4 Ramon/Hermon/Carmel | PARTIAL |
| P5 UI+Esc | DONE |
| P5 60fps soak | NOT DONE |
| P5 real track photos | NOT DONE |

## E2 canvas (not 100)
**7** `createElement("canvas")` remain: CapabilityProbe (ok), NYC LED, buildings motza, world facade/windowEmit/mkSign/board.

Asphalt/sky/flake/beam/ground/foam/signs/water/flare/blob/arrow/herodian/curtain/curb/foliage/bark/sidewalk: fail closed if bake missing. **Not** zero-canvas shipping.

## FAKED if ticked V
Photogrammetry · GIS · WebGPU · KTX2 files · “no generic buildings” globally · world-class graphics · E2 complete.
