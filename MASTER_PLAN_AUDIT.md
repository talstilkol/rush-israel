# Codex audit — 26 Aug 2026 13:47 IDT (brutal)

**~12% of the Web graphics master plan. Ship gates 0/13. Not GT7. Not Asphalt. Not Unreal.**

Legend: **DONE** = in code, runs, verified against a *small* spec. **PARTIAL** = started, not the spec. **NOT DONE** = not touched. **FAKED** = a V that does not match the spec.

Nothing GIS / photogrammetry / WebGPU / HDRI / scanned car is 100.

---

## Codex §1 strategy

| Item | Status | 100? | Evidence |
|---|---|---|---|
| 1.1 Ultra WebGPU | **NOT DONE** | no | `RendererFacade` is `WebGLRenderer` only |
| 1.1 Balanced WebGPU/WebGL2 | **PARTIAL** | no | Mid = SMAA, no WebGPU |
| 1.1 Compat WebGL2 | **PARTIAL** | no | Low skips composer; still WebGL |
| 1.1 Photo/Cinematic WebGPU | **PARTIAL** | no | Orbit cam + pixel-ratio bump. Same WebGL shaders |
| Stay in Web, no Unreal | **DONE** (constraint) | yes | Three.js only |

## Codex §25 — if you can fund only ten

| # | Item | Status | 100? |
|---|---|---|---|
| 1 | Hero car (scanned glTF) | **PARTIAL** | exported extrusion `.glb`, not a scan |
| 2 | One real road segment | **FAKED** if claimed real | procedural PNG + spline |
| 3 | Color/exposure/physical lighting | **PARTIAL** | ACES-ish, no HDRI, no GI |
| 4 | glTF/KTX2/Meshopt pipeline | **PARTIAL** | Meshopt+KTX2Loader wired; **0 `.ktx2` files** |
| 5 | World cells + LOD/HLOD | **NOT DONE** | no cells, no streaming |
| 6 | Dry/wet road material | **PARTIAL** | roughness/clearcoat/planar, not photogrammetry |
| 7 | WebGPURenderer + TSL + fallback | **NOT DONE** | comment only |
| 8 | CSM + reflection probes | **PARTIAL** | Three CSM 2×1024 High; cube probe 96px |
| 9 | TRAA/TAAU | **NOT DONE** | SMAA only; TAARenderPass not used (no reprojection) |
| 10 | Weather/SSGI/volumetrics | **NOT DONE** | rain points; no SSGI (kept off on purpose) |

## G0–G6 (mobile graphics track)

| ID | Status | 100? | Truth |
|---|---|---|---|
| G0 perf / Low→screen | **PARTIAL** | no | Low skips composer; no measured 16.6ms budget |
| G1 road shader + planar | **PARTIAL** | no | MeshPhysical + Reflector 768 follow-yaw |
| G2 HDRI sky | **NOT DONE** | no | baked PNG gradient, Sky() unused |
| G3 car paint flakes | **PARTIAL** | no | `flake.png` maps, not a flake shader |
| G4 blob shadow | **PARTIAL** | no | baked blob plane |
| G5 facade atlas Ayalon/Rothschild | **FAKED** if claimed | no | Israel skips generic facades; remaining canvases are NYC |
| G6 headlight cookies on road | **PARTIAL** | no | spots exist; not a road cookie atlas |

## P0–P5 (user priorities)

| Item | Status | 100? |
|---|---|---|
| P0 road as mesh + UV lanes | **PARTIAL** | ribbon mesh + baked albedo, not GIS lanes |
| P1 HDRI + ACES | **PARTIAL** | ACES tone map; no HDRI |
| P2 5 car meshes | **PARTIAL** | 5 extruded glTF clones |
| P3 4-wheel physics | **PARTIAL** | Pacejka + 34% kinematic mix; spline Y |
| P4 Ayalon landmarks | **PARTIAL** | silhouettes; not measured glass |
| P4 Rothschild | **PARTIAL** | median + denser ficus icosahedra |
| P4 Hayarkon/Reading | **PARTIAL** | Hilton offset, chimney offset, overpass |
| P4 Jaffa | **PARTIAL** | clock offset, vaults |
| P4 Jerusalem A→B | **PARTIAL** | gate off-road, fake hills, thinner fog |
| P4 Ramon A→B | **PARTIAL** | desert primitives, spline elevation |
| P4 Hermon A→B | **PARTIAL** | snow primitives, spline elevation |
| P4 Carmel | **PARTIAL** | Baháʼí offset, not gardens scan |
| P5 UI minimal + Esc | **DONE** (tiny spec) | title → track → race; Esc overlay |
| P5 60fps soak | **NOT DONE** | no 30-min GPU soak signed |
| P5 real track stills | **NOT DONE** | cards are still not photo-matched |

## TASKS.md checkboxes (the V list)

| ID | Checkbox | Honest | 100? |
|---|---|---|---|
| A1 GIS road | unchecked | **NOT DONE** | |
| A2 Azrieli measured | unchecked | **NOT DONE** | primitives + ratios |
| A3 Aerial 8+8+rail | unchecked | **PARTIAL** | one carriageway 28m + offset clone + rail; not aerial |
| A4 Human QA vs still | unchecked | **NOT DONE** | |
| B1 External scanned glTF | unchecked | **NOT DONE** | we exported our own extrusion |
| B2 Shader flakes | unchecked | **PARTIAL** | texture, not shader |
| B3 Wheels+steer | V PARTIAL | **PARTIAL** | wheels rotate; not a rig |
| B4 Cockpit | unchecked | **PARTIAL** | dash boxes always on; not a cabin LOD |
| C1 Pacejka | V PARTIAL | **PARTIAL** | formula used; mixed with kinematic yaw |
| C2 Suspension Y | V PARTIAL | **PARTIAL** | spring on spline, not 4-post |
| C3 Grade*g | V PARTIAL | **PARTIAL** | spline slope, not DEM |
| C4 OBB | V PARTIAL | **PARTIAL** | yaw box on tunnels/gates; most hits still AABB |
| D1 WebGPURenderer | unchecked | **NOT DONE** | |
| D2 TSL | unchecked | **NOT DONE** | |
| D3 CSM | V PARTIAL | **PARTIAL** | 2 cascades @1024 High only |
| D4 SMAA / TRAA | V PARTIAL | **PARTIAL** | SMAA mid/high; no TRAA |
| D5 No SSGI | V kept | **DONE** (constraint) | we did not add SSGI |
| E1 .ktx2 | unchecked | **NOT DONE** | loader wired, **zero files** |
| E2 Canvas fallbacks | V PARTIAL | **PARTIAL** | leftover: world facade/window/ads, nyc billboard, probe |
| E3 Zero canvas except probe | unchecked | **NOT DONE** | |
| E4 Lease RTs | V PARTIAL | **PARTIAL** | env+probe+composer; not CSM maps |
| F Israel 15 GPS+still | unchecked | **PARTIAL** | GPS-ish points, no still QA |
| G Golden CI | V PARTIAL | **PARTIAL** | capture + size>20KB; no pixel diff |
| G WebGL2 CI | V PARTIAL | **PARTIAL** | `qa:webgl2` gets a context; not a matrix |
| G WebGPU CI | unchecked | **NOT DONE** | |
| G Strip `?qa=1` | unchecked | **NOT DONE** | hook lives in DEV/localhost |
| G 13 ship gates | 0/13 | **NOT DONE** | |

## PLAN.md 24h / week / month

| Item | Status | 100? |
|---|---|---|
| 24.1 Rotate OAuth secret | **PARTIAL** | removed from source, not rotated at broker |
| 24.2 Block QA hook in preview | **PARTIAL** | localhost/`VITE_QA` only; still on 127.0.0.1 |
| 24.3 Honest records | **PARTIAL** | no signed hash |
| 24.4 No false GIS claims | **PARTIAL** | some copy says inspired; many names still sound real |
| 24.5 Artifacts | **NOT DONE** | |
| W1.1 CI without nocheck | **NOT DONE** | `world.ts`, `game-app.tsx` still `@ts-nocheck` |
| W1.2 Save transactions | **NOT DONE** | localStorage |
| W1.3 Damage lifecycle | **PARTIAL** | dents; no CCD |
| W1.4 GPU soak | **NOT DONE** | dispose exists; no signed 30min |
| W1.5 Signed envelope | **NOT DONE** | |
| W1.6 Perf headers | **NOT DONE** | |
| M1 Unreal brief | **NOT DONE** | cannot here |
| M2 Freeze 52 tracks | **FAKED** | we kept editing tracks |
| M3 Legal | **NOT DONE** | |
| M4 CRS EPSG:2039 | **NOT DONE** | |
| M5 Vehicle lab | **PARTIAL** | no CI 0–100 |

## FAKED if anyone checked V on

- Photogrammetry / “real streets” / GIS / OSM / DEM
- WebGPURenderer / TSL / TRAA / SSGI / Lumen / Nanite
- KTX2 shipping assets
- Scanned hero car
- World-class / GT7 / Asphalt parity
- Freeze-52
- Secret rotation at the broker
- E2 “all canvases gone”
- Photo Mode as cinematic renderer

## Tiny specs that *are* 100

Esc overlay. Physics timestep 120Hz exists. GitHub repo. NYC generic boxes skipped in Israel. Bloom kept weak. Road `metalness = 0`. SSGI not added. `qa:drive` and `qa:webgl2` smokes run here.
