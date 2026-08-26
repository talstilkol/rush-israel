# Codex / EXECUTION_PLAN audit — 26 Aug 2026 17:26 IDT (brutal)

**~13% of the Web graphics master plan. Ship gates 2/13. Not GT7. Not Asphalt Legends. Not Unreal. Not GIS.**

Legend:
- **DONE** = in code, runs, verified against a *small* written spec (often marked tiny)
- **PARTIAL** = started, not the spec
- **NOT DONE** = not touched, or only a stub
- **FAKED** = a V / sentence that does not match the spec

**Nothing** GIS / photogrammetry / WebGPU-as-game-renderer / HDRI / scanned car / UASTC atlas / Ayalon **freeze** is 100.

Checked against: `engine.ts`, `world.ts`, `vehicle.ts`, `roadShader.ts`, `RendererFacade.ts`, `package.json`, `TASKS.md`, `EXECUTION_PLAN.md`.

Stale Vs this audit **corrects**:
- `world.ts` / `game-app.tsx` **no longer** `@ts-nocheck` (only generated `routeTree.gen.ts`).
- Road dashes are **shader UV**, not InstancedMesh (TASKS 2.3 was stale).
- CSM 3/1/0 via light visibility (TASKS 7.3 tiny).
- 4-corner ride, CCD 2-cut, accel CI, airborne CI, 200m corridor — tiny DONE, not 6DoF/PhysX.
- `AYALON_LOCK` hash ≠ freeze.

---

## Codex §1 strategy

| Item | Status | 100? | Evidence |
|---|---|---|---|
| Ultra WebGPU | **NOT DONE** | no | Game canvas = `WebGLRenderer`. `?webgpu=1` only probes `three/webgpu` |
| Balanced WebGPU/WebGL2 | **PARTIAL** | no | Mid SMAA, no WebGPU game path |
| Compat WebGL2 | **PARTIAL** | no | Low skips composer — not a baked-IBL compat layer |
| Photo/Cinematic WebGPU | **PARTIAL** | no | Orbit + DPR bump, same WebGL |
| Stay on Web | **DONE** (constraint) | yes | Three.js only. No Unreal |

## Codex §25 top ten

| # | Item | Status | 100? | Honest note |
|---|---|---|---|---|
| 1 | Hero scanned glTF | **PARTIAL** | no | 5 Meshopt extruded `.glb`. **FAKED** if "hero scan" |
| 2 | One real road | **FAKED** if claimed real | no | Procedural PNG + spline ribbon. Not photogrammetry, not GIS |
| 3 | Physical lighting | **PARTIAL** | no | ACES + one sun + CSM. No HDRI. Sky = 2D PNG |
| 4 | glTF/KTX2/Meshopt | **PARTIAL** | no | Meshopt cars **DONE** tiny. 1 uncompressed `blob.ktx2`, not UASTC atlas |
| 5 | World cells | **NOT DONE** | no | No 256m cells / HLOD |
| 6 | Dry/wet road | **PARTIAL** | no | MeshPhysical + PNG + `uWet` roughness. No SSR wet |
| 7 | WebGPU+TSL | **NOT DONE** | no | Probe only |
| 8 | CSM + probes | **PARTIAL** | no | High 3 / Mid 1 / Low 0 visibility. Cube probe ~96. Not rebuilt on quality change |
| 9 | TRAA | **NOT DONE** | no | SMAA mid/high. TRAANode not wired |
| 10 | SSGI/volumetrics | **NOT DONE** | no | Constraint off = **DONE as constraint**. Rain = points |

## G0–G6

| ID | Status | 100? |
|---|---|---|
| G0 perf | **PARTIAL** | p95 + drawCalls on `?qa=1`. Cascade planar→bloom→CSM→pixelScale. No phone 60 proof |
| G1 road shader | **PARTIAL** | MeshPhysical + Reflector 768 + **UV dashes** (8m). Not GT asphalt |
| G2 HDRI | **NOT DONE** | Baked `sky-day.png` / `sky-night.png` |
| G3 flakes | **PARTIAL** | `flake.png` on MeshPhysical. Not flake shader |
| G4 blob | **PARTIAL** | Blob plane + optional `blob.ktx2` |
| G5 facade atlas | **FAKED** if claimed for Israel | Israel skips generic boxes. NYC facade/ads still canvas |
| G6 headlight cookies | **PARTIAL** | Spots, no cookie atlas |

## P0–P5

| Item | Status | 100? |
|---|---|---|
| P0 road mesh + UV lanes | **PARTIAL** | Ayalon width 28m = 8×3.5. UV dashes. Edge stripe meshes still exist |
| P1 HDRI+ACES | **PARTIAL** | ACES only |
| P2 5 cars | **PARTIAL** | Five extrusion clones, not 5 authored bodies |
| P3 4-wheel | **PARTIAL** | Pacejka + tire yaw >12 m/s. 4-corner Y from spline. Not 6DoF |
| P4 Ayalon | **PARTIAL** | Primitive silhouettes + GPS-ish. **No user still. Not freeze** |
| P4 Rothschild…Carmel | **PARTIAL** | Playable. Illegal to deepen until freeze |
| P5 Esc UI | **DONE** (tiny) | Resume / home / day-night / quality / sound |
| P5 60fps soak | **NOT DONE** | Scripts exist; no user 60Hz proof |
| P5 photo stills | **NOT DONE** | Agent PNGs ≠ user Hashalom still |

---

## EXECUTION_PLAN.md 0–10 (the numbered tree)

### 0. Rules
| ID | Status | Note |
|---|---|---|
| 0.1–0.5 constraints | **DONE** as policy | Repeatedly **violated** (landmark marathon) |
| 0.6 V only vs tiny spec | **PARTIAL** | This audit exists because V's drifted |
| 0.7 one number / session | **FAKED** in many sessions | Multiple leftovers per `המשך` |
| 0.8 truth files | **DONE** | engine/world/vehicle/RendererFacade |

### 1. Honesty
| ID | Status | 100? | Evidence |
|---|---|---|---|
| 1.1 Inspired copy | **DONE** (tiny) | cards yes | 56/56 descriptions contain בהשראת. **No stored card screenshot** (1.1.3) |
| 1.2 Prod hook | **DONE** (tiny) | no 100 | `check:qa` in `qa:ci`. Hook still on DEV+localhost |
| 1.3 Records hash | **DONE** (tiny) | yes tiny | `PHYSICS_VERSION=3` + SHA-256 |
| 1.4 `@ts-nocheck` | **DONE** (tiny) | no 100 | `world.ts` / `game-app.tsx` clean. Generated `routeTree.gen.ts` still nocheck |

### 2. Frame budget
| ID | Status | 100? |
|---|---|---|
| 2.1 Telemetry HUD | **DONE** (tiny) | p95 + dc/tri/geo/tex + kin on `?qa=1`. **No Ayalon High screenshot** |
| 2.2 Auto quality | **DONE** (tiny) | planar→bloom→CSM→pixelScale. Unit test, not 90-frame soak |
| 2.3 60Hz target | **NOT DONE** | No user-machine number |
| 2.4 CSM maps in ResourceRegistry | **DONE** (tiny) | `retain("csm")` + release on dispose. GPU free not measured |

### 3. Road
| ID | Status | 100? |
|---|---|---|
| 3.1 API facts | **DONE** | TSL≠WebGL documented |
| 3.2 UV ribbon | **PARTIAL** | UV dashes + 28m Ayalon. Edge meshes remain |
| 3.3 Dry/wet | **PARTIAL** | `uWet` albedo+roughness. MeshPhysical cap. No SSR |
| 3.4 Planar | **PARTIAL** | 768 + yaw |
| 3.5 Opposite + rail | **PARTIAL** | Visual clone + rail. Not GIS |
| 3.6 NYC canvas out of Israel | **DONE** (tiny) | `await import` if `city===nyc` |

### 4. Car
| ID | Status | 100? |
|---|---|---|
| 4.1 Don't claim Kenney as hero | **DONE** (constraint) | LICENSES.md |
| 4.2 Hero one car | **NOT DONE** | **FAKED** if "hero". User must supply glTF |
| 4.3 Flake paint | **PARTIAL** | flake.png, not flake shader |
| 4.4 Hood | **PARTIAL** | Dash boxes, no windshield |
| 4.5 Mix telemetry | **DONE** (tiny) | `kin` on QA HUD |
| 4.6 0–100 | **DONE** (tiny) | `qa:accel` in `qa`. Extrusion ±15%, not hero |

### 5. Physics
| ID | Status | 100? |
|---|---|---|
| 5.1 Yaw | **DONE** (tiny) | crawl=0 above 12 m/s. Mix still on below ~10 |
| 5.2 Suspension | **DONE** (tiny) | 4 spline/ramp corners, twist ≤0.12m unloads grip. **Not 6DoF/DEM** |
| 5.3 Grade | **PARTIAL** | Spline ΔY × g. Not DEM |
| 5.4 OBB | **PARTIAL** | Hashalom/Savidor yaw. Other tracks yaw=0. `hit()` always sets hx/hz |
| 5.5 CCD | **DONE** (tiny) | 2 cuts above 25 m/s. Not PhysX |

### 6. Ayalon freeze — **GATE 1, blocks everything after**
| ID | Status | 100? |
|---|---|---|
| 6.1 Hashalom **user** still | **NOT DONE** | **Blocks freeze.** Agent PNGs are not the user still |
| 6.2 Azrieli 187/169/154 glass | **PARTIAL** | Primitive cylinders + bands. Not photo glass |
| 6.3 ToHa / City Gate / Midtown / Savidor | **PARTIAL** | Silhouettes. Primitives |
| 6.4 Interchanges | **PARTIAL** | Decks + `qa:ramp`. Not GIS spaghetti |
| 6.5 Freeze sources | **NOT DONE** | `AYALON_LOCK` is a content hash that **moves**. **FAKED** if "frozen" |

### 7. Israel after 6.5 only
| ID | Status | 100? |
|---|---|---|
| 7.0 Track contract | **NOT DONE** | No `landmark-gps.ts` |
| 7.1–7.7 | **PARTIAL** | Playable primitives. Deepening now violates 0.3 |

### 8. Renderer
| ID | Status | 100? |
|---|---|---|
| 8.1 Research | **DONE** | TECH_RESEARCH.md |
| 8.2 Dual path WebGPU | **NOT DONE** | Probe ≠ renderer |
| 8.3 TSL | **NOT DONE** | Cannot on WebGLRenderer |
| 8.4 CSM 3/1/0 | **DONE** (tiny) | Visibility trim. No setupMaterial rebuild |
| 8.5 SMAA / TRAA | **PARTIAL** | SMAA yes. TRAA no |
| 8.6 SSGI | **DONE** (constraint) | Off |
| 8.7 Codex layers Ultra/Balanced/Compat/Photo | **PARTIAL** | Quality enum only |

### 9. Assets
| ID | Status | 100? |
|---|---|---|
| 9.1 UASTC KTX2 | **PARTIAL** | Uncompressed blob.ktx2. 0 UASTC |
| 9.2 Zero canvas except probe | **PARTIAL** | NYC facade + ads still canvas. LED/windows = DataTexture. Probe + WebGPU dummy allowed |
| 9.3 Meshopt cars | **DONE** (tiny) | |
| 9.4 256m cells | **NOT DONE** | |

### 10. Ship gates (13)
| Gate | Status |
|---|---|
| 10.1 `qa:drive` | **DONE** (tiny) — 200m corridor + kin |
| 10.2 `qa:webgl2` | **DONE** (tiny) |
| 10.3 Pixel-diff in `qa:ci` | **NOT DONE** — `qa:golden` exists, **not** in `qa:ci` (correct until user-ok stills) |
| 10.4 WebGPU CI as game path | **NOT DONE** |
| 10.5 Hook not in prod | **DONE** (tiny) |
| 10.6 Ayalon user still | **NOT DONE** |
| 10.7 5 cars 0–100 file | **DONE** (tiny) — extrusion table |
| 10.8 Zero canvas except probe | **NOT DONE** |
| 10.9 p95 Ayalon High <20ms Playwright | **NOT DONE** |
| 10.10 Esc | **DONE** (tiny) |
| 10.11 Hebrew + inspired | **DONE** (tiny) |
| 10.12 20× enter/exit no RT leak | **NOT DONE** |
| 10.13 nocheck + physicsVersion | **DONE** (tiny) — generated nocheck remains |

**Green: 10.1, 10.2, 10.5, 10.7, 10.10, 10.11, 10.13 = 7 tiny / 13. Spec 100: 0. Honest ship: 2/13** (drive+webgl2 infrastructure only).

### 11. Outside sandbox
All **NOT DONE** by design (Unreal, OSM/DEM, scans, Nanite, 50 cars, online).

### 14 GPS contracts
| Track | Status |
|---|---|
| 14.1 Ayalon 8 GPS | **PARTIAL** — coords in world.ts, no `landmark-gps.ts`, no user still QA |
| 14.2–14.8 | **PARTIAL** — names exist, contract file missing |

### 15–20
| ID | Status |
|---|---|
| 15 Golden pixel-diff | **PARTIAL** — script exists, not in CI, no user baselines |
| 16 Frame ms table | **NOT DONE** as measured on user GPU |
| 17 SSGI after budgets | **NOT DONE** (constraint) |
| 18 Golden cameras | **PARTIAL** — file exists, not pose-locked to user still |
| 20 HDRI | **NOT DONE** — 2D PNG sky |

---

## Scores vs competitors (same scale as earlier honest report)

| Domain | RUSH | vs Asphalt Legends (mobile) | vs GT7 |
|---|---|---|---|
| Sky / lighting | 3/10 | far behind | not comparable |
| Asphalt | 3.5/10 | behind (they have wet SSR-ish) | not comparable |
| Cars | 3/10 | far behind | not comparable |
| Landmarks | 4/10 silhouette | N/A | N/A |
| Physics | 4/10 tiny Pacejka | behind CarX | not Assetto |
| Track limits | 5/10 | playable spline | — |
| Israel coverage width | 7/10 | unique | — |
| Israel coverage quality | 3/10 | primitives | — |
| UI flow | 6.5/10 | OK for web | — |
| Stability | 5/10 | WebGL restore exists | — |
| **Overall vs AAA** | **~2.8/10** | | |
| **As web prototype you can drive** | **~6.5/10** | | |

Cannot be #1 in the world from this sandbox. Ceiling: **Asphalt-like WebGL**.

---

## What cannot be coded until the user

1. Hashalom **real photo** (6.1) — without it freeze is **FAKED**.
2. Hero car **licensed glTF**.
3. HDRI file + license.
4. Phone 60Hz measurement.
5. Playwright p95 on a real GPU.

---

## Honest % 

**~13%** of Codex Web plan. Not 50. Not 80. Freeze **0%**.
