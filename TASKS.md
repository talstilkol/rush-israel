# Remaining work — none of A1–G are 100

Do **not** bake more procedural PNGs. Do **not** add cities. Do **not** claim GIS.  
**Block:** any non-Ayalon map work until 5.1+5.5 are green.

Overall **~12%**. Ship **0/13**. Target: Asphalt-like WebGL, not GT7.

Status on every line: **DONE** | **PARTIAL** | **NOT DONE** | **FAKED**.  
V only where the *small* spec is 100.

---

## Phase 0 — Stop lying
- [ ] 0.1 Inspired copy — **PARTIAL** (some cards; not all)
- [ ] 0.2 Prod: no `?qa=1` — **NOT DONE** (localhost/`VITE_QA` still)
- [ ] 0.3 Record hash — **NOT DONE**
- [ ] 0.4 No `@ts-nocheck` — **NOT DONE** (`world.ts`, `game-app.tsx`)
- [ ] 0.5 Honest README — **PARTIAL**

## Phase 1 — G0 frame
- [ ] 1.1 HUD ms + draw calls — **PARTIAL** (p95 on `?qa=1` only)
- [ ] 1.2 fps<50 cascade — **PARTIAL** (composer tier; not planar→CSM)
- [ ] 1.3 Low 60 on phone — **NOT DONE**
- [ ] 1.4 Lease CSM maps — **NOT DONE**

## Phase 2 — Road
- [ ] 2.1 Dry/wet **shader** — **NOT DONE** (dashes = meshes; **FAKED** if called a shader)
- [ ] 2.2 Planar follow — **PARTIAL** (768 + yaw)
- [ ] 2.3 3.5m / 8-lane UV — **PARTIAL** (Ayalon width 28; no UV lanes)
- [ ] 2.4 Dynamic-import NYC canvas — **PARTIAL** (out of `world.ts`; still statically imported)

## Phase 3 — Car
- [ ] 3.1 Authored GT — **NOT DONE** (extrusion glTF — **FAKED** if "hero scan")
- [ ] 3.2 Flake shader — **NOT DONE** (`flake.png`)
- [ ] 3.3 Hood windshield — **PARTIAL** (dash boxes always on)
- [ ] 3.4 Mix % HUD — **NOT DONE**
- [ ] 3.5 0–100 CI ±15% — **NOT DONE**

## Phase 4 — Physics
- [ ] 4.1 Tire-only yaw — **PARTIAL** (`kin * crawl + tire`)
- [ ] 4.2 4-post Y — **NOT DONE** (spline spring)
- [ ] 4.3 Never say DEM — **PARTIAL** (no DEM in code; copy fuzzy)
- [ ] 4.4 OBB all landmarks — **PARTIAL**
- [ ] 4.5 Airborne 12ms — **NOT DONE**

## Phase 5 — Ayalon freeze (gate 1)
- [ ] 5.1 Hashalom still — **NOT DONE** (**blocks freeze**)
- [ ] 5.2 Azrieli photo glass — **NOT DONE** (primitives)
- [ ] 5.3 Savidor + ramps — **PARTIAL**
- [ ] 5.4 Opposite carriageway visual — **PARTIAL**
- [ ] 5.5 Freeze sources — **NOT DONE** (**FAKED** if claimed frozen)

## Phase 6 — Israel (illegal until 5.5)
- [ ] 6.1 Rothschild 8 GPS+still — **PARTIAL** (ficus; no still)
- [ ] 6.2 Hayarkon/Reading — **PARTIAL**
- [ ] 6.3 Jaffa — **PARTIAL**
- [ ] 6.4 Jerusalem A→B — **PARTIAL**
- [ ] 6.5 Ramon — **PARTIAL**
- [ ] 6.6 Hermon — **PARTIAL**
- [ ] 6.7 Carmel — **PARTIAL**

## Phase 7 — Renderer
- [ ] 7.1 WebGPU flag — **NOT DONE**
- [ ] 7.2 TSL — **NOT DONE**
- [ ] 7.3 CSM 3/1/0 — **PARTIAL** (2 cascades High only)
- [ ] 7.4 SMAA / no fake TAA — **PARTIAL** (SMAA mid/high)
- [x] 7.5 No SSGI — **DONE** (constraint kept)

## Phase 8 — Assets
- [ ] 8.1 `.ktx2` files — **NOT DONE** (loader wired, **0 files** — **FAKED** if "KTX2 done")
- [ ] 8.2 Zero canvas except probe — **NOT DONE** (`nyc-canvas.ts`, `nyc-landmarks.ts`, probe)
- [x] 8.3 Meshopt cars — **DONE** (tiny spec)
- [ ] 8.4 256m cells — **NOT DONE**

## Phase 9 — Ship
- [ ] 9.1 `qa:drive` + `qa:webgl2` — **PARTIAL** (exist; not matrix CI)
- [ ] 9.2 Pixel-diff goldens — **NOT DONE**
- [ ] 9.3 WebGPU CI — **NOT DONE**
- [ ] 9.4 Strip prod hook — **NOT DONE**
- [ ] 9.5 13/13 gates — **NOT DONE** (**0/13**)

## Codex §25 (same truth)
1 hero **PARTIAL** · 2 real road **FAKED** · 3 lighting **PARTIAL** · 4 KTX2 **PARTIAL** · 5 cells **NOT DONE** · 6 wet **PARTIAL** · 7 WebGPU **NOT DONE** · 8 CSM **PARTIAL** · 9 TRAA **NOT DONE** · 10 SSGI **NOT DONE**

## Tiny 100 only
Esc. 120Hz dt. GitHub. No NYC boxes on Israel. Bloom weak. Road metalness 0. SSGI off. Meshopt. `world.ts` has no canvas. `qa:drive` / `qa:webgl2` run here.

## Out of sandbox
Unreal 5.8, OSM/DEM, scanned cars, Nanite/Lumen/RT, broker rotation, 50 cars, online, garage.

## Next slice
1. 5.1 Hashalom still — needs a reference photo you provide.  
2. Until then: 0.1 copy, 2.4 dynamic import, 3.4 mix HUD.  
3. No Phase 6 maps. No freeze claim.
