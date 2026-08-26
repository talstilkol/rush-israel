# Execution plan — finish the Codex Web track

None of A1–G gates are 100. Do **not** bake more procedural PNGs. Do **not** add cities. Do **not** claim GIS.

Overall: **~12%**. Target here: Asphalt-like WebGL, not GT7.

---

## Phase 0 — Stop lying (this week)

0.1 Track copy: every card says "inspired, not GIS".  
0.2 Strip `?qa=1` from production builds; keep hook behind `VITE_QA=1` only.  
0.3 Records: `physicsVersion` + hash; reject mismatch.  
0.4 Ban new `@ts-nocheck`. Plan removal of `world.ts` / `game-app.tsx` nocheck.  
0.5 Honest README: Three.js WebGL prototype.

## Phase 1 — Frame budget (G0)

1.1 DEV HUD: CPU ms, GPU estimate, draw calls, P95.  
1.2 If fps<50: planar off → bloom off → CSM off → pixelScale.  
1.3 Low: compositor off (already). Verify 60 on a real phone.  
1.4 Lease CSM shadow maps in ResourceRegistry.

## Phase 2 — Road picture (P0 + G1)

2.1 Dedicated road shader (dry/wet, lane UV, no extra canvas).  
2.2 Planar reflector High+night only, 512–768, follow car (started).  
2.3 `laneWidth ≈ 3.5` documented per track; Ayalon 8-lane UV, not a second fake highway.  
2.4 Drop remaining runtime canvases in `world.ts` (facade/window/ads) — move NYC-only into `nyc-landmarks.ts`.

## Phase 3 — Car (B)

3.1 Keep 5 bodies. Replace extrusion glTF with **one** authored mid-poly GT (external). Until then do not claim hero.  
3.2 Flake: TSL or GLSL clearcoat flakes, not `flake.png` bump.  
3.3 Hood camera: hide windshield, show dash only.  
3.4 Telemetry: % kinematic vs tire; no hidden mix.  
3.5 0–100 CI on Ayalon, TCS off, ±15%.

## Phase 4 — Physics (C)

4.1 Tire-only yaw (kill 34% kinematic) or label arcade.  
4.2 4-post suspension independent of spline Y.  
4.3 Grade from spline * g stays until DEM exists — do not say DEM.  
4.4 Rotated OBB on **all** landmark hits, not only tunnels.  
4.5 Airborne 12ms, no tunneling.

## Phase 5 — Ayalon freeze (gate 1) — **no other cities until this is green**

5.1 Photo still vs Hashalom interchange. Human QA.  
5.2 Azrieli: measured 169/187/154m ratios already; photo glass, not BoxGeometry.  
5.3 Savidor unique; 4 interchanges: driveable ramp or delete.  
5.4 Opposite carriageway + rail stay visual-only unless spline allows crossing.  
5.5 Freeze Ayalon file after QA. Do not edit silhouettes "a bit more".

## Phase 6 — Israel quality slices (only after 5.5)

Order, each: 8 GPS landmarks + offset off-road + chase still.

6.1 Rothschild — ficus LOD, Independence Hall, no generic bauhaus (scatter already off).  
6.2 Hayarkon/Reading — tunnel passable, chimney off-road (started).  
6.3 Jaffa — clock, ochre vaults, alleys not modern boxes.  
6.4 Jerusalem A→B — Herodian, gate off-road, spline hills (started). No DEM claim.  
6.5 Ramon A→B — desert only, cliff, grade.  
6.6 Hermon A→B — snow line, climb.  
6.7 Carmel — Baháʼí off-road (started), forest, descent.

## Phase 7 — Renderer (D) — after Phase 2

7.1 WebGPURenderer **optional** behind `?webgpu=1`, fallback WebGL2. Do not make it default until CSM/post have GPU paths.  
7.2 TSL materials for road + car only.  
7.3 CSM 3 cascades High; 1 cascade Mid; 0 Low.  
7.4 SMAA default High/Mid (done). TRAA only with reprojection — do not ship Three `TAARenderPass`.  
7.5 No SSGI until Ayalon+hero are green.

## Phase 8 — Assets (E)

8.1 Author or drop KTX2. Loader without files is not E1.  
8.2 Zero runtime canvas except CapabilityProbe.  
8.3 Meshopt glTF stays.  
8.4 World cells 256m: add/remove landmark groups by player cell.

## Phase 9 — Ship (G)

9.1 `qa:drive` + `qa:webgl2` (done, partial).  
9.2 Pixel-diff golden g01/g07/g08 vs committed PNG (threshold).  
9.3 WebGPU CI only if 7.1 ships.  
9.4 Strip QA hook from prod.  
9.5 13 gates: Ayalon still, 5 cars 0–100, no canvas, WebGL2, fps budget, Esc, Hebrew, no GIS claim, dispose soak, no nocheck on new files, records hash, Low path, High CSM.

---

## Explicitly out of sandbox

Unreal 5.8. OSM/DEM/EPSG:2039. Scanned cars. Nanite/Lumen/RT. Broker secret rotation. 50 cars. Online. Garage upgrades.

---

## Next coding slice (do in order)

1. ~~Move NYC canvases out of `world.ts`~~ — **PARTIAL** (`nyc-canvas.ts`; Israel still imports the module).  
2. DEV ms HUD (1.1) — **PARTIAL** (`?qa=1` p95).  
4. ~~Tire-only yaw or label arcade~~ — **PARTIAL** (highway = tire+ESC; crawl still kinematic).  
5. Ayalon freeze QA still (5.1) — **block other map work**.  
6. Stop.
