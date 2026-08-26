# Codex audit — 26 Aug 2026 13:56 IDT (brutal)

**~12% of the Web graphics master plan. Ship gates 0/13. Not GT7. Not Asphalt. Not Unreal.**

Legend: **DONE** = in code, runs, verified against a *small* spec. **PARTIAL** = started, not the spec. **NOT DONE** = not touched. **FAKED** = a V / claim that does not match the spec.

Nothing GIS / photogrammetry / WebGPU / HDRI / scanned car / KTX2 shipping is 100.

Delta since 13:47: NYC canvases left `world.ts`; `?qa=1` p95; highway yaw tire+ESC; Ayalon piers off spline; dashed lane quads. **None of those close a ship gate.**

---

## Codex §1 strategy

| Item | Status | 100? | Evidence |
|---|---|---|---|
| Ultra WebGPU | **NOT DONE** | no | `RendererFacade` = `WebGLRenderer` |
| Balanced WebGPU/WebGL2 | **PARTIAL** | no | Mid SMAA, no WebGPU |
| Compat WebGL2 | **PARTIAL** | no | Low skips composer |
| Photo/Cinematic WebGPU | **PARTIAL** | no | orbit + DPR, same WebGL |
| Stay on Web | **DONE** (constraint) | yes | Three.js only |

## Codex §25 top ten

| # | Item | Status | 100? |
|---|---|---|---|
| 1 | Hero scanned glTF | **PARTIAL** | 5 extruded `.glb` |
| 2 | One real road | **FAKED** if claimed real | PNG + spline |
| 3 | Physical lighting | **PARTIAL** | ACES, no HDRI |
| 4 | glTF/KTX2/Meshopt | **PARTIAL** | Meshopt yes, **0 `.ktx2`** |
| 5 | World cells | **NOT DONE** | |
| 6 | Dry/wet road | **PARTIAL** | roughness + planar + dashes |
| 7 | WebGPU+TSL | **NOT DONE** | |
| 8 | CSM + probes | **PARTIAL** | 2×1024 High; cube 96 |
| 9 | TRAA | **NOT DONE** | SMAA only |
| 10 | SSGI/volumetrics | **NOT DONE** | rain points; SSGI kept off |

## G0–G6

| ID | Status | 100? |
|---|---|---|
| G0 perf | **PARTIAL** | p95 on `?qa=1`; no 16.6ms budget, no phone 60 |
| G1 road shader | **PARTIAL** | MeshPhysical + Reflector + **instanced dashes** (not UV shader) |
| G2 HDRI | **NOT DONE** | baked PNG sky |
| G3 flakes | **PARTIAL** | `flake.png` maps |
| G4 blob | **PARTIAL** | blob plane |
| G5 facade atlas | **FAKED** if claimed | Israel skips; NYC still canvases |
| G6 headlight cookies | **PARTIAL** | spots, no cookie atlas |

## P0–P5

| Item | Status | 100? |
|---|---|---|
| P0 road mesh + UV lanes | **PARTIAL** | ribbon + dashes, not GIS UV |
| P1 HDRI+ACES | **PARTIAL** | ACES only |
| P2 5 cars | **PARTIAL** | extrusion clones |
| P3 4-wheel | **PARTIAL** | Pacejka + **crawl kinematic**; spline Y |
| P4 Ayalon | **PARTIAL** | silhouettes, piers offset, ramps exist, **no still QA** |
| P4 Rothschild | **PARTIAL** | ficus icosahedra |
| P4 Hayarkon/Reading | **PARTIAL** | overpass + chimney offset |
| P4 Jaffa | **PARTIAL** | |
| P4 Jerusalem | **PARTIAL** | |
| P4 Ramon/Hermon/Carmel | **PARTIAL** | primitives + spline hills |
| P5 Esc UI | **DONE** (tiny) | |
| P5 60fps soak | **NOT DONE** | |
| P5 photo stills | **NOT DONE** | |

## Phase 0–9 (TASKS execution plan)

| ID | Status | 100? |
|---|---|---|
| 0.1 Inspired copy | **PARTIAL** | some cards; not all |
| 0.2 Strip qa from prod | **NOT DONE** | hook on localhost/`VITE_QA` |
| 0.3 Record hash | **NOT DONE** | |
| 0.4 Ban nocheck | **NOT DONE** | `world.ts`, `game-app.tsx` still |
| 0.5 Honest README | **PARTIAL** | |
| 1.1 DEV HUD | **PARTIAL** | p95 only, no draw calls |
| 1.2 fps<50 cascade | **PARTIAL** | drops composer tier, not planar→CSM list |
| 1.3 Low 60 on phone | **NOT DONE** | |
| 1.4 Lease CSM maps | **NOT DONE** | env/probe/composer only |
| 2.1 Road shader | **NOT DONE** | dashes are meshes |
| 2.2 Planar follow | **PARTIAL** | 768 + yaw |
| 2.3 3.5m lanes | **PARTIAL** | Ayalon 28m=8×3.5 implied |
| 2.4 NYC canvas out of world | **PARTIAL** | gone from `world.ts`; module still imported; `nyc-canvas.ts`+`nyc-landmarks.ts` remain |
| 3.1 Authored GT | **NOT DONE** | |
| 3.2 Flake shader | **NOT DONE** | |
| 3.3 Hood cabin | **PARTIAL** | dash boxes always on |
| 3.4 Mix telemetry | **NOT DONE** | |
| 3.5 0–100 CI | **NOT DONE** | |
| 4.1 Tire yaw | **PARTIAL** | `kin * crawl + tire` — highway tire-only |
| 4.2 4-post | **NOT DONE** | spline spring |
| 4.3 No DEM claim | **PARTIAL** | code ok; copy still fuzzy |
| 4.4 OBB all landmarks | **PARTIAL** | some yaw boxes |
| 4.5 Airborne 12ms | **NOT DONE** | |
| 5.1 Hashalom still | **NOT DONE** | **blocks freeze** |
| 5.2 Azrieli photo glass | **NOT DONE** | primitives |
| 5.3 Interchanges | **PARTIAL** | ramps + piers off-road |
| 5.4 Opposite carriageway | **PARTIAL** | visual clone |
| 5.5 Freeze Ayalon | **NOT DONE** | we keep editing it |
| 6.x Israel slices | **PARTIAL** | started; **must wait 5.5** |
| 7.1 WebGPU flag | **NOT DONE** | |
| 7.2 TSL | **NOT DONE** | |
| 7.3 CSM 3/1/0 | **PARTIAL** | 2 High only |
| 7.4 SMAA | **PARTIAL** | mid/high; no TRAA |
| 7.5 No SSGI | **DONE** (constraint) | |
| 8.1 KTX2 files | **NOT DONE** | 0 files |
| 8.2 Zero canvas | **NOT DONE** | 3 sites + probe |
| 8.3 Meshopt | **DONE** (tiny) | cars load meshopt |
| 8.4 World cells | **NOT DONE** | |
| 9.1 smokes | **PARTIAL** | `qa:drive`, `qa:webgl2` |
| 9.2 Pixel golden | **NOT DONE** | size>20KB only |
| 9.3 WebGPU CI | **NOT DONE** | |
| 9.4 Strip hook prod | **NOT DONE** | |
| 9.5 13 gates | **NOT DONE** | **0/13** |

## Tiny specs that are 100

Esc overlay. 120Hz timestep exists. GitHub. No NYC generic boxes on Israel tracks. Bloom weak. Road `metalness=0`. SSGI not added. `qa:drive` / `qa:webgl2` run here. Meshopt decoder on car glTF. `world.ts` has **zero** `createElement("canvas")`.

## FAKED if V on

GIS / real streets / photogrammetry / DEM / WebGPU / TSL / TRAA / shipping KTX2 / scanned hero / freeze-52 / broker secret rotation / “all canvases gone” / cinematic Photo Mode / “road shader done” (dashes ≠ shader) / Ayalon freeze.
