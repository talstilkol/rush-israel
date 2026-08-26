# Remaining work — none of A1–G are 100

Do **not** bake more procedural PNGs. Do **not** add cities. Do **not** claim GIS.  
**Block:** any non-Ayalon map work until **6.1 + 6.5** are green.

Overall **~13%**. Ship **2/13** (infra). Target: Asphalt-like WebGL, not GT7.

Status: **DONE** | **PARTIAL** | **NOT DONE** | **FAKED**.  
Full audit: [MASTER_PLAN_AUDIT.md](/workspace/MASTER_PLAN_AUDIT.md).

---

## Already 100 for the *tiny* spec (do not redo)

- 1.1 Inspired suffix on 56 cards + honest README (no card screenshot stored)
- 1.3 PHYSICS_VERSION=3 + SHA-256 records
- 1.4 no nocheck in world.ts / game-app.tsx
- 2.1 QA HUD p95 + dc/tri/geo/tex + kin
- 2.2 fps cascade planar→bloom→CSM→pixelScale
- 2.4 CSM lease
- 3.6 NYC `await import`
- 4.5 kin mix HUD
- 4.6 0–100 CI extrusion
- 5.1 crawl=0 above 12 m/s
- 5.2 4-corner ride (not 6DoF)
- 5.5 CCD 2-cut (not PhysX)
- 8.4 CSM 3/1/0 visibility
- 8.6 SSGI off
- 9.3 Meshopt cars
- 10.10 Esc · 10.11 Hebrew+inspired
- UV dashes in road shader (TASKS 2.3 was stale "meshes")

---

## Phase 0 — Stop lying
- [x] 0.1 Inspired copy — **DONE** (tiny; 1.1.3 screenshot **NOT DONE**)
- [x] 0.2 Prod hook — **DONE** (tiny)
- [x] 0.3 Record hash — **DONE** (tiny)
- [x] 0.4 No `@ts-nocheck` in world/game-app — **DONE** (generated routeTree still nocheck)
- [x] 0.5 Honest README — **DONE**

## Phase 1 — G0
- [x] 1.1 HUD — **DONE** (tiny)
- [x] 1.2 fps cascade — **DONE** (tiny)
- [ ] 1.3 Low 60 on phone — **NOT DONE**
- [x] 1.4 CSM lease — **DONE** (tiny)

## Phase 2 — Road
- [x] 2.1 Wet shader — **DONE** (tiny: uWet roughness; no SSR)
- [ ] 2.2 Planar follow — **PARTIAL** (768 + yaw)
- [x] 2.3 3.5m / 8-lane UV dashes — **DONE** (tiny: shader; edge meshes remain)
- [x] 2.4 NYC dynamic import — **DONE** (tiny)

## Phase 3 — Car
- [ ] 3.1 Authored GT — **NOT DONE** (**FAKED** if "hero scan")
- [ ] 3.2 Flake **shader** — **NOT DONE** (flake.png)
- [ ] 3.3 Hood windshield — **PARTIAL**
- [x] 3.4 Mix % HUD — **DONE** (tiny)
- [x] 3.5 0–100 CI — **DONE** (tiny: extrusion)

## Phase 4 — Physics
- [x] 4.1 Tire yaw at speed — **DONE** (tiny)
- [x] 4.2 4-post Y — **DONE** (tiny: not 6DoF)
- [x] 4.3 Never say DEM — **DONE** (tiny: zero `DEM` in `src/`)
- [x] 4.4 200m corridor — **DONE** (tiny)
- [x] 4.4b Ayalon yaw OBB cluster — **DONE** (tiny)
- [x] 4.5 Airborne 12ms — **DONE** (tiny)
- [x] 5.5 CCD — **DONE** (tiny)

## Phase 5 — Ayalon freeze (GATE 1)
- [ ] 5.1 Hashalom **user** still — **NOT DONE** (**blocks freeze**)
- [ ] 5.2 Azrieli photo glass — **NOT DONE**
- [ ] 5.3 Savidor + ramps + named towers — **PARTIAL**
- [ ] 5.4 Opposite carriageway — **PARTIAL**
- [ ] 5.5 Freeze sources — **NOT DONE** (**FAKED** if claimed frozen)

## Phase 6 — Israel (illegal until 5.5)
- [ ] 6.1–6.7 Rothschild…Carmel — **PARTIAL** each

## Phase 7 — Renderer
- [ ] 7.1 WebGPU **game** flag — **NOT DONE**
- [ ] 7.2 TSL — **NOT DONE**
- [x] 7.3 CSM 3/1/0 — **DONE** (tiny)
- [ ] 7.4 SMAA / no fake TAA — **PARTIAL**
- [x] 7.5 No SSGI — **DONE** (constraint)

## Phase 8 — Assets
- [ ] 8.1 UASTC — **PARTIAL**
- [x] 8.2 Zero canvas except probe — **DONE** (tiny: NYC DataTexture; probe + WebGPU dummy remain; not baked PNG)
- [x] 8.3 Meshopt — **DONE** (tiny)
- [ ] 8.4 256m cells — **NOT DONE**

## Phase 9 — Ship
- [x] 9.1 qa:drive + qa:webgl2 in qa — **DONE** (tiny; not matrix CI)
- [ ] 9.2 Pixel-diff in qa:ci — **NOT DONE** (keep manual until user stills)
- [ ] 9.3 WebGPU CI game path — **NOT DONE**
- [x] 9.4 Strip prod hook — **DONE** (tiny)
- [ ] 9.5 13/13 gates — **NOT DONE** (2/13 ship; 10.8 canvas tiny-closer, still not 13)

## Codex §25
1 hero **PARTIAL** · 2 real road **FAKED** · 3 lighting **PARTIAL** · 4 KTX2 **PARTIAL** · 5 cells **NOT DONE** · 6 wet **PARTIAL** · 7 WebGPU **NOT DONE** · 8 CSM **PARTIAL** · 9 TRAA **NOT DONE** · 10 SSGI off **OK**

---

# Execution queue — do in this order. Do not skip 1.

### 1. Wait for the user (cannot code)
1.1. Real Hashalom photo (6.1).  
1.2. Until then: **no Ayalon towers**.  
1.3. `המשך` without a still → integrity leftover only. Freeze blocked.

### 2. Integrity leftovers still open (no still)
2.24. `8.2` NYC facade + ads off canvas — **DONE** (tiny: DataTexture + 5x7 glyphs; not baked PNG).  
2.25. `5.4` yaw OBB remaining Ayalon (IBM/Yovel/Platinum/TAU/rail) — **DONE** (tiny).  
2.26. `2.2` planar 768 cap — **DONE** (tiny: `PLANAR_RT` locked; not raised). Ayalon `place*` hits use `towerHit` → road yaw.  
2.27. `4.4` other tracks still yaw=0 — do **not** until freeze.  
2.28. `9.2` golden in `qa:ci` — **forbidden** until user-ok stills.  
2.29. `1.3` phone 60Hz — needs user device.  
2.30. `10.9` p95 Playwright — needs real GPU.  
2.31. `10.12` leak soak — **DONE** (tiny: `qa:soak-smoke` 2 cycles in `qa`; 20-cycle stays `qa:soak` manual).
2.32. `8.2` canvas allowlist CI — **DONE** (tiny: `check:canvas` in `qa:ci`; probe dummy only).
2.33. `1.1` inspired + no-DEM CI — **DONE** (tiny: `check:copy` in `qa:ci`).
2.34. `1.3` records unit tests in `qa:ci` — **DONE** (tiny).
2.35. `5.1` physics unit tests in `qa:ci` — **DONE** (tiny: Pacejka/ABS/TCS/120Hz).
2.36. `7.5` SSGI-off in `qa:ci` — **DONE** (tiny).

### 3. After Hashalom still
3.1. Pose-lock `hashalom` camera.  
3.2. QA existing Azrieli bands vs still (still primitives).  
3.3. No new named towers.  
3.4. Freeze: `AYALON_LOCK` stops moving; Ayalon block read-only.  
3.5. Commit `golden: freeze ayalon` with user ACK.

### 4. After freeze — Israel 7.x (one track per session)
4.1. `src/game/landmark-gps.ts`.  
4.2. Rothschild → Hayarkon → Jaffa → Jerusalem → Ramon → Hermon → Carmel.  
4.3. Each: 8 GPS + collider offset + one golden pose. No new cities.

### 5. After one Israel slice looks like a game
5.1. Do **not** switch default to WebGPU.  
5.2. Wet: MeshPhysical is the cap unless TSL on WebGPU.  
5.3. KTX2: UASTC atlases **or** delete the loader claim.  
5.4. Strip NYC canvas.  
5.5. World cells 256m only if drawCalls > budget.  
5.6. Hero glTF if user supplies license.

### 6. Never in this sandbox
Unreal, OSM/DEM, scanned cars, Nanite/Lumen/RT, TRAA-on-WebGL, SSGI, 50 cars, online, garage, "we finished the master plan", "#1 in the world".

---

## Launch / #1 remaining (honest)

**Launch as a web toy:** freeze Ayalon vs user still, 60fps High, zero canvas in Israel, hood glass, flake shader or drop claim, soak leak, golden CI after user-ok.

**#1 in the world:** not achievable here. Needs scanned cars, photogrammetry, Unreal/custom engine, art team. Do not write that as a task.

## Next if `המשך` and no photo

`2.24` NYC facade/ads off canvas. No landmarks. Freeze still blocked.
