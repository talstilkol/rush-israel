# Codex / EXECUTION_PLAN audit — 26 Aug 2026 16:36 IDT (brutal)

**~13% of the Web graphics master plan. Ship gates 2/13 green. Not GT7. Not Asphalt. Not Unreal. Not GIS.**

Legend:
- **DONE** = in code, runs, verified against a *small* written spec
- **PARTIAL** = started, not the spec
- **NOT DONE** = not touched, or only a stub
- **FAKED** = a V / claim that does not match the spec — do not ship that sentence

Nothing GIS / photogrammetry / WebGPU-as-renderer / HDRI / scanned car / UASTC KTX2 / Ayalon freeze is 100.

**Delta since last audit:** Ayalon primitive landmarks (ToHa, City Gate, Midtown, Electra, Savidor, HaHagana, University, Galuyot ramps, Platinum, TAU, Sarona, Hakirya, Shalom Meir). `AYALON_LOCK=11` is a *content hash*, not freeze. **None of that closes 6.1 / 6.5 / ship gates.** Recent sessions **violated 0.3/0.7** (many landmarks instead of stopping for the Hashalom still).

---

## Codex §1 strategy

| Item | Status | 100? | Evidence |
|---|---|---|---|
| Ultra WebGPU | **NOT DONE** | no | Game canvas = `WebGLRenderer`. `?webgpu=1` only probes `three/webgpu` |
| Balanced WebGPU/WebGL2 | **PARTIAL** | no | Mid SMAA, no WebGPU path |
| Compat WebGL2 | **PARTIAL** | no | Low skips composer — still not a baked-IBL compat layer |
| Photo/Cinematic WebGPU | **PARTIAL** | no | Orbit + DPR bump, same WebGL |
| Stay on Web | **DONE** (constraint) | yes | Three.js only. No Unreal |

## Codex §25 top ten

| # | Item | Status | 100? | Honest note |
|---|---|---|---|---|
| 1 | Hero scanned glTF | **PARTIAL** | no | 5 Meshopt extruded `.glb`. **FAKED** if "hero scan" |
| 2 | One real road | **FAKED** if claimed real | no | Procedural PNG + spline ribbon. Not photogrammetry, not GIS |
| 3 | Physical lighting | **PARTIAL** | no | ACES + one sun. No HDRI. Sky = 2D PNG |
| 4 | glTF/KTX2/Meshopt | **PARTIAL** | no | Meshopt on cars **DONE** tiny. **1** uncompressed `blob.ktx2`, not UASTC atlas |
| 5 | World cells | **NOT DONE** | no | No 256m cells / HLOD |
| 6 | Dry/wet road | **PARTIAL** | no | MeshPhysical + PNG + `uWet` + dashes. Not layered wet BRDF |
| 7 | WebGPU+TSL | **NOT DONE** | no | Probe only. TSL not on WebGL |
| 8 | CSM + probes | **PARTIAL** | no | CSM 2×1024 High. Cube probe ~96. No cascade 3/1/0 matrix |
| 9 | TRAA | **NOT DONE** | no | SMAA mid/high. `traa.ts` documents TRAANode is WebGPU-only and **not wired** |
| 10 | SSGI/volumetrics | **NOT DONE** | no | Constraint kept off = **DONE as constraint**. Rain = points |

## G0–G6 (mobile graphics plan)

| ID | Status | 100? |
|---|---|---|
| G0 perf | **PARTIAL** | p95 + drawCalls on `?qa=1`. Cascade planar→bloom→CSM→pixelScale. No phone 60 proof |
| G1 road shader | **PARTIAL** | MeshPhysical + Reflector 768 + instanced dashes. Not UV-lane shader |
| G2 HDRI | **NOT DONE** | Baked `sky-day.png` / `sky-night.png` |
| G3 flakes | **PARTIAL** | `flake.png` on MeshPhysical. Not flake shader |
| G4 blob | **PARTIAL** | Blob plane + `blob.ktx2` optional |
| G5 facade atlas | **FAKED** if claimed for Israel | Israel skips generic boxes. NYC still runtime canvases |
| G6 headlight cookies | **PARTIAL** | Spots, no cookie atlas |

## P0–P5 (Israel racer plan)

| Item | Status | 100? |
|---|---|---|
| P0 road mesh + UV lanes | **PARTIAL** | Ribbon; Ayalon width 28m implied 8×3.5; dashes are meshes |
| P1 HDRI+ACES | **PARTIAL** | ACES only |
| P2 5 cars | **PARTIAL** | Five extrusion clones, not 5 authored bodies |
| P3 4-wheel | **PARTIAL** | Pacejka + `kin * crawl + tire`; Y = spline/ramp snap |
| P4 Ayalon | **PARTIAL** | Many **primitive** silhouettes + GPS-ish coords. No user still. **Not freeze** |
| P4 Rothschild | **PARTIAL** | Ficus icosahedra. Illegal to deepen until Ayalon freeze |
| P4 Hayarkon/Reading | **PARTIAL** | Overpass + chimney offset |
| P4 Jaffa | **PARTIAL** | Clock PNG on box |
| P4 Jerusalem | **PARTIAL** | Stone boxes + spline hills |
| P4 Ramon/Hermon/Carmel | **PARTIAL** | Nature primitives + spline elevation |
| P5 Esc UI | **DONE** (tiny) | Resume / home / day-night / quality / sound |
| P5 60fps soak | **NOT DONE** | Scripts exist; no user 60Hz proof |
| P5 photo stills | **NOT DONE** | Agent PNGs ≠ user Hashalom still |

---

## EXECUTION_PLAN.md tree (the numbered plan)

### 0. Rules
| ID | Status | Note |
|---|---|---|
| 0.1–0.5 constraints | **DONE** as policy | Repeatedly **violated in practice** (landmark marathon, extra maps earlier) |
| 0.6 V only vs tiny spec | **PARTIAL** | This audit exists because V's drifted |
| 0.7 one number / session | **FAKED** in recent sessions | Many landmarks per "המשך" |
| 0.8 truth files | **DONE** | engine/world/vehicle/RendererFacade |

### 1. Honesty / copy / QA / records
| ID | Status | 100? | Evidence |
|---|---|---|---|
| 1.1 Inspired copy | **DONE** (tiny) | cards yes | 56/56 `tracks.ts` descriptions contain בהשראת. README honest. **No stored screenshot of the card** (1.1.3) |
| 1.2 Prod hook | **PARTIAL** | no | `check-qa-hook.mjs` exists. Hook still on localhost/`VITE_QA`. Not proven dead in grok host prod |
| 1.3 Records hash | **DONE** (tiny) | yes for tiny spec | `PHYSICS_VERSION=3` + SHA-256 payload. Old V of "NOT DONE" was **stale** |
| 1.4 `@ts-nocheck` | **NOT DONE** | no | `world.ts`, `game-app.tsx` (plus generated `routeTree.gen.ts`) |

### 2. Frame budget G0
| ID | Status | 100? |
|---|---|---|
| 2.1 Telemetry HUD | **DONE** (tiny) | p95 + drawCalls + kin on `?qa=1` |
| 2.2 Auto quality | **DONE** (tiny) | planar→bloom→CSM mute→pixelScale, 5s hysteresis |
| 2.3 60Hz target | **NOT DONE** | No user-machine number. Headless ≠ 60 |
| 2.4 CSM maps in ResourceRegistry | **NOT DONE** | env/probe/composer leased; CSM maps not |

### 3. Road
| ID | Status | 100? |
|---|---|---|
| 3.1 API facts | **DONE** | Documented: TSL≠WebGL, Reflector=planar |
| 3.2 UV ribbon | **PARTIAL** | Length UV exists; **not** 3.5m lane UV |
| 3.3 Dry/wet material | **PARTIAL** | MeshPhysical + PNG + uWet |
| 3.4 Planar | **PARTIAL** | 768 + yaw follow |
| 3.5 Opposite + rail Ayalon | **PARTIAL** | Visual clone + rail mesh; not GIS |
| 3.6 NYC canvas out of Israel bundle | **DONE** (tiny) | `await import` only if `city===nyc` |

### 4. Car
| ID | Status | 100? |
|---|---|---|
| 4.1 Don't load Kenney as hero | **DONE** (constraint) | Extrusion labeled in LICENSES.md |
| 4.2 Hero one car | **NOT DONE** | **FAKED** if "hero". User must supply glTF |
| 4.3 Flake paint | **PARTIAL** | flake.png |
| 4.4 Hood | **PARTIAL** | Dash boxes, no windshield glass |
| 4.5 Mix telemetry | **DONE** (tiny) | `kin` on QA HUD |
| 4.6 0–100 | **PARTIAL** | `qa:accel` script exists, **not** in `qa:ci`, no ±15% table in git |

### 5. Physics
| ID | Status | 100? |
|---|---|---|
| 5.1 Yaw | **PARTIAL** | `yawRate = kin * crawl + tire`. Highway closer to tire. Not tire-only |
| 5.2 Suspension | **PARTIAL** | Ramp snap + spline spring. Not 4-post travel |
| 5.3 Grade | **PARTIAL** | Spline Y, **not DEM**. Copy must not say DEM |
| 5.4 OBB | **PARTIAL** | Some landmarks pass yaw; not all |
| 5.5 CCD | **NOT DONE** | 12ms airborne not gated |

### 6. Ayalon freeze (GATE 1 — blocks everything after)
| ID | Status | 100? |
|---|---|---|
| 6.1 Hashalom still from **user** | **NOT DONE** | **Blocks freeze.** Agent PNGs in `golden-baseline/hashalom-*.png` are **not** the user still |
| 6.2 Azrieli 187/169/154 glass | **PARTIAL** | Primitive cylinders/box + InstancedMesh bands. **Not photo glass** |
| 6.3 ToHa / City Gate / Midtown / Savidor | **PARTIAL** | Silhouettes exist (ToHa gold stack, Moshe Aviv diamond, Midtown twins, Electra teal, Savidor hall, Sarona slab, Hakirya khaki, Shalom Meir mosaic). Primitives |
| 6.4 Interchanges | **PARTIAL** | 6 decks + Galuyot extra ramps + `qa:ramp` green. Not spaghetti GIS |
| 6.5 Freeze sources | **NOT DONE** | `AYALON_LOCK=11` **changes every landmark session**. **FAKED** if "frozen" |

### 7. Israel after 6.5 only
| ID | Status | 100? |
|---|---|---|
| 7.0 Track contract | **NOT DONE** | No `landmark-gps.ts` |
| 7.1–7.7 Rothschild…Carmel | **PARTIAL** | Exist as playable splines + primitives. **Illegal to treat as done.** Deepening them now violates 0.3 |

### 8. Renderer after 3+6
| ID | Status | 100? |
|---|---|---|
| 8.1 Research | **DONE** | TECH_RESEARCH.md locked |
| 8.2 Dual path | **NOT DONE** | WebGL only for the game |
| 8.3 TSL road+car | **NOT DONE** | Cannot on WebGLRenderer |
| 8.4 CSM 3/1/0 | **PARTIAL** | 2 High only |
| 8.5 SMAA / TRAA | **PARTIAL** | SMAA yes, TRAA no |
| 8.6 SSGI/volumetrics | **DONE** (constraint off) | |
| 8.7 Codex layers | **PARTIAL** | Profile schema exists (`compat/balanced/high/ultra/photo`) — names only |

### 9. Assets
| ID | Status | 100? |
|---|---|---|
| 9.1 KTX2 | **PARTIAL** | Loader + `blob.ktx2` uncompressed. **FAKED** if "KTX2 pipeline done". 0 UASTC atlases |
| 9.2 Zero canvas | **NOT DONE** | `nyc-canvas.ts`, `nyc-landmarks.ts`, CapabilityProbe, RendererFacade probe |
| 9.3 Meshopt | **DONE** (tiny) | Cars |
| 9.4 World cells | **NOT DONE** | |

### 10. Ship 13 gates
| Gate | Status |
|---|---|
| 10.1 `qa:drive` | **PARTIAL** (runs here; not matrix CI) |
| 10.2 `qa:webgl2` | **PARTIAL** (same) |
| 10.3 Pixel-diff | **PARTIAL** (`qa:golden` exists, **not** in `qa:ci`) |
| 10.4 WebGPU CI | **NOT DONE** (`qa:webgpu` probe script ≠ game path) |
| 10.5 Hook not in prod | **PARTIAL** (checker exists) |
| 10.6 Ayalon still user-approved | **NOT DONE** |
| 10.7 0–100 table | **NOT DONE** |
| 10.8 Zero canvas except probe | **NOT DONE** |
| 10.9 p95 Ayalon High <20ms user | **NOT DONE** |
| 10.10 Esc | **DONE** (tiny) |
| 10.11 Hebrew + inspired | **DONE** (tiny) |
| 10.12 20× enter/exit no RT leak | **NOT DONE** |
| 10.13 no nocheck + physicsVersion | **PARTIAL** (version yes; nocheck no) |

**Green: 2/13 (10.10, 10.11). Yellow: 10.1, 10.2, 10.3, 10.5, 10.13. Red: the rest.**

### 11. Out of sandbox
All **NOT DONE** and **must stay not done** here: Unreal, OSM/DEM, laser scan, Nanite/Lumen/RT, OAuth broker, 50 cars, online, garage.

---

## Tiny specs that are actually 100

Esc overlay. 120Hz physics timestep. GitHub push. Inspired suffix on 56 cards. Honest README. Bloom weak. Road `metalness=0`. SSGI not added. Meshopt decoder on car glTF. `world.ts` has **zero** `createElement("canvas")`. `qa:drive` / `qa:webgl2` / `qa:ramp` / `qa:colliders` run here. NYC canvases dynamically imported. PHYSICS_VERSION + SHA-256 records. QA HUD p95+dc+kin. Quality cascade order. CSM 2 cascades on High.

## FAKED if anyone ticks V on

- "Real Israeli streets / GIS / OSM / DEM"
- "Hero scanned car"
- "KTX2 shipping pipeline"
- "WebGPU renderer"
- "TRAA"
- "Ayalon frozen"
- "Azrieli looks like the photo"
- "Master plan complete"
- "GT7 / Asphalt quality"
- "60fps on iPhone"
- "Facade atlas for Ayalon"

## Honest percent

| Slice | % |
|---|---|
| Playable WebGL toy racer | ~60 |
| Codex Web graphics master plan | **~13** |
| Ship gates | **2/13** |
| Ayalon identity vs reality photo | **~25 silhouette / 0 photogrammetry** |

---

## What the last week of `המשך` actually did

Added **primitive** Ayalon landmarks and InstancedMesh bands. Useful for "which tower is that?" — **not** Codex §25.1–10. Did **not** wait for 6.1. Did **not** freeze. That was the wrong queue vs EXECUTION_PLAN §12.
