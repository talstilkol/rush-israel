# Remaining work — none of A1–G are 100

Do **not** bake more procedural PNGs. Do **not** add cities. Do **not** claim GIS.  
**Block:** any non-Ayalon map work until 5.1+5.5 are green.

Overall **~12%**. Target: Asphalt-like WebGL, not GT7.

---

## Phase 0 — Stop lying
- [ ] 0.1 Every track card: "inspired, not GIS"
- [ ] 0.2 Prod: no `?qa=1` hook (`VITE_QA=1` only)
- [ ] 0.3 Records: `physicsVersion` + hash
- [ ] 0.4 No new `@ts-nocheck`; split `world.ts` / type `game-app.tsx`
- [ ] 0.5 README: Three.js WebGL prototype

## Phase 1 — G0 frame
- [ ] 1.1 HUD: ms p50/p95, draw calls (p95 on `?qa=1` exists)
- [ ] 1.2 fps<50: planar → bloom → CSM → pixelScale
- [ ] 1.3 Low 60fps on a real phone
- [ ] 1.4 Lease CSM shadow maps

## Phase 2 — Road (P0/G1)
- [ ] 2.1 Dedicated dry/wet **shader** (dashes today are meshes — not this)
- [ ] 2.2 Planar High+night only (768 follow exists)
- [ ] 2.3 Document 3.5m lanes; Ayalon 8-lane UV
- [ ] 2.4 Dynamic-import `nyc-canvas` so Israel does not bundle it

## Phase 3 — Car
- [ ] 3.1 One authored mid-poly GT (external). Current glTF = extrusion
- [ ] 3.2 GLSL/TSL flakes
- [ ] 3.3 Hood: hide windshield
- [ ] 3.4 HUD % kinematic vs tire
- [ ] 3.5 0–100 CI Ayalon TCS-off ±15%

## Phase 4 — Physics
- [ ] 4.1 Kill crawl kinematic or label arcade (highway already tire+ESC)
- [ ] 4.2 4-post Y independent of spline
- [ ] 4.3 Never say DEM
- [ ] 4.4 OBB yaw on every landmark
- [ ] 4.5 Airborne 12ms / no tunnel

## Phase 5 — Ayalon freeze (**gate 1**)
- [ ] 5.1 Human still vs Hashalom
- [ ] 5.2 Azrieli photo glass (not BoxGeometry)
- [ ] 5.3 Savidor unique; ramps stay driveable
- [ ] 5.4 Opposite carriageway visual-only
- [ ] 5.5 Freeze Ayalon sources after 5.1

## Phase 6 — Israel (only after 5.5)
- [ ] 6.1 Rothschild 8 GPS + still
- [ ] 6.2 Hayarkon/Reading 8 GPS + still
- [ ] 6.3 Jaffa 8 GPS + still
- [ ] 6.4 Jerusalem A→B 8 GPS + still
- [ ] 6.5 Ramon A→B
- [ ] 6.6 Hermon A→B
- [ ] 6.7 Carmel

## Phase 7 — Renderer (after Phase 2)
- [ ] 7.1 `?webgpu=1` + WebGL2 fallback
- [ ] 7.2 TSL road+car
- [ ] 7.3 CSM 3 / 1 / 0
- [ ] 7.4 SMAA stays; no unreprojected TAA
- [x] 7.5 No SSGI until Ayalon+hero — **DONE (constraint)**

## Phase 8 — Assets
- [ ] 8.1 Real `.ktx2` or remove KTX2Loader
- [ ] 8.2 Zero canvas except CapabilityProbe
- [x] 8.3 Meshopt on cars — **DONE (tiny)**
- [ ] 8.4 256m cells

## Phase 9 — Ship
- [ ] 9.1 Keep `qa:drive` + `qa:webgl2`
- [ ] 9.2 Pixel-diff goldens
- [ ] 9.3 WebGPU CI iff 7.1
- [ ] 9.4 Strip prod hook
- [ ] 9.5 **0/13 gates** → 13/13

## Out of sandbox
Unreal 5.8, OSM/DEM, scanned cars, Nanite/Lumen/RT, broker rotation, 50 cars, online, garage.

## Next slice (order)
1. **5.1 Hashalom still** — cannot close without a reference photo. Until then: 0.1 copy + 2.4 dynamic import + 3.4 mix HUD.  
2. No Phase 6 maps.  
3. Stop claiming freeze.
