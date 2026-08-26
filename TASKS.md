# Remaining work — none of A1–G are 100

Do **not** bake more procedural PNGs. Do **not** add cities. Do **not** claim GIS.  
**Block:** any non-Ayalon map work until **6.1 + 6.5** are green.

Overall **~13%**. Ship **2/13**. Target: Asphalt-like WebGL, not GT7.

Status: **DONE** | **PARTIAL** | **NOT DONE** | **FAKED**.  
V only where the *small* spec is 100. Full evidence: [MASTER_PLAN_AUDIT.md](/workspace/MASTER_PLAN_AUDIT.md).

---

## Already 100 (do not redo)

- 1.1 Inspired suffix on 56 cards + honest README
- 1.3 PHYSICS_VERSION=3 + SHA-256 records (tiny)
- 2.1 QA HUD p95 + drawCalls + kin
- 2.2 fps cascade planar→bloom→CSM→pixelScale
- 3.6 NYC `await import` only if nyc
- 4.5 kin mix on `?qa=1`
- 8.6 SSGI kept off (constraint)
- 9.3 Meshopt on cars
- 10.10 Esc
- 10.11 Hebrew + inspired

---

## Phase 0 — Stop lying
- [x] 0.1 Inspired copy — **DONE**
- [x] 0.2 Prod: no `?qa=1` without `VITE_QA` — **DONE** (tiny: client static has 0 `finishNow`/`__controlsTest`; DEV localhost hook kept)
- [x] 0.3 Record hash — **DONE** (tiny) — *was wrongly listed NOT DONE*
- [x] 0.4 No `@ts-nocheck` in `world.ts` / `game-app.tsx` — **DONE** (`tsc --noEmit` clean; generated `routeTree.gen.ts` still nocheck)
- [x] 0.5 Honest README — **DONE**

## Phase 1 — G0 frame
- [x] 1.1 HUD ms + draw calls — **DONE** (tiny)
- [x] 1.2 fps<50 cascade — **DONE** (tiny)
- [ ] 1.3 Low 60 on phone — **NOT DONE** (needs user machine)
- [x] 1.4 Lease CSM maps in ResourceRegistry — **DONE** (tiny: `retain("csm")` + `release` on engine dispose; GPU free not measured)

## Phase 2 — Road
- [ ] 2.1 Dry/wet **shader** — **PARTIAL** (MeshPhysical + PNG + uWet)
- [ ] 2.2 Planar follow — **PARTIAL** (768 + yaw)
- [ ] 2.3 3.5m / 8-lane **UV** — **PARTIAL** (width 28; dashes are meshes)
- [x] 2.4 Dynamic-import NYC canvas — **DONE** (tiny)

## Phase 3 — Car
- [ ] 3.1 Authored GT — **NOT DONE** (**FAKED** if "hero scan")
- [ ] 3.2 Flake **shader** — **NOT DONE** (`flake.png`)
- [ ] 3.3 Hood windshield — **PARTIAL**
- [x] 3.4 Mix % HUD — **DONE** (tiny)
- [x] 3.5 0–100 CI ±15% in `qa` — **DONE** (tiny: extrusion, not hero; table in `golden-baseline/accel.json`)

## Phase 4 — Physics
- [x] 4.1 Tire-only yaw at speed — **DONE** (tiny: crawl=0 when speed>12; `qa:drive` asserts `getKinMix`)
- [ ] 4.2 4-post Y — **PARTIAL** (ramp snap; spline spring)
- [ ] 4.3 Never say DEM — **PARTIAL** (code ok; keep copy honest)
- [x] 4.4 Ayalon 200m no building hit — **DONE** (tiny: `qa:drive` corridor; most `hit()` still circles)
- [x] 4.5 Airborne 12ms — **DONE** (tiny: ramp not airborne; 2.2m drop is; `qa:airborne` in `qa`)
- [x] 5.5 CCD 2-cut above 25 m/s — **DONE** (tiny: not PhysX; 120Hz already <12ms)

## Phase 5 — Ayalon freeze (GATE 1)
- [ ] 5.1 Hashalom **user** still — **NOT DONE** (**blocks freeze**)
- [ ] 5.2 Azrieli photo glass — **NOT DONE** (primitives + bands)
- [ ] 5.3 Savidor + ramps + named towers — **PARTIAL** (silhouettes exist)
- [ ] 5.4 Opposite carriageway — **PARTIAL**
- [ ] 5.5 Freeze sources — **NOT DONE** (`AYALON_LOCK=11` is not freeze; **FAKED** if claimed frozen)

## Phase 6 — Israel (illegal until 5.5)
- [ ] 6.1 Rothschild 8 GPS + still — **PARTIAL**
- [ ] 6.2 Hayarkon/Reading — **PARTIAL**
- [ ] 6.3 Jaffa — **PARTIAL**
- [ ] 6.4 Jerusalem A→B — **PARTIAL**
- [ ] 6.5 Ramon — **PARTIAL**
- [ ] 6.6 Hermon — **PARTIAL**
- [ ] 6.7 Carmel — **PARTIAL**

## Phase 7 — Renderer
- [ ] 7.1 WebGPU **game** flag — **NOT DONE** (probe ≠ renderer)
- [ ] 7.2 TSL — **NOT DONE**
- [x] 7.3 CSM 3/1/0 — **DONE** (tiny: High 3@1024, Mid 1@512, Low 0 at boot; applyQuality does not rebuild; no photo)
- [ ] 7.4 SMAA / no fake TAA — **PARTIAL** (SMAA yes, TRAA no)
- [x] 7.5 No SSGI — **DONE** (constraint)

## Phase 8 — Assets
- [ ] 8.1 UASTC `.ktx2` atlases — **PARTIAL** (uncompressed `blob.ktx2` vk=43 loads; car GLBs Meshopt only — no fake KTX2Loader)
- [ ] 8.2 Zero canvas except probe — **NOT DONE**
- [x] 8.3 Meshopt cars — **DONE** (tiny)
- [ ] 8.4 256m cells — **NOT DONE**

## Phase 9 — Ship
- [ ] 9.1 `qa:drive` + `qa:webgl2` in matrix CI — **PARTIAL**
- [ ] 9.2 Pixel-diff in `qa:ci` — **PARTIAL** (`qa:golden` exists, not in `qa:ci`)
- [ ] 9.3 WebGPU CI as game path — **NOT DONE**
- [ ] 9.4 Strip prod hook — **PARTIAL**
- [ ] 9.5 13/13 gates — **NOT DONE** (**2/13**)

## Codex §25 (same truth)
1 hero **PARTIAL** · 2 real road **FAKED** · 3 lighting **PARTIAL** · 4 KTX2 **PARTIAL** · 5 cells **NOT DONE** · 6 wet **PARTIAL** · 7 WebGPU **NOT DONE** · 8 CSM **PARTIAL** · 9 TRAA **NOT DONE** · 10 SSGI **NOT DONE** (constraint off = OK)

---

# Execution queue — one number per session

Stop coding landmarks. Do **exactly** this order. Do not skip 1.

### 1. Wait for the user (cannot code)
1.1. User sends or approves a **real Hashalom photo** (6.1 / 5.1).  
1.2. Until then: **no more Ayalon towers**. Lock hash must stop moving.  
1.3. If user types `המשך` without a still: next code slice is **integrity leftover** (not another building). Freeze still blocked.

### 2. Integrity leftovers (can code without still)
2.1. `0.4` nocheck — **DONE**.
2.2. `0.2` prod hook — **DONE**.
2.3. `3.5` accel CI — **DONE**.
2.4. `9.2` Put `qa:golden` into `qa:ci` **after** baselines are user-ok. Until then keep it manual.
2.5. `1.4` CSM lease — **DONE**.
2.6. `2.1.2` QA HUD dc/tri/geo/tex — **DONE** (tiny: no Ayalon High screenshot).
2.7. `2.2.2` drop order planar→bloom→CSM→pixelScale — **DONE** (tiny: unit test; no 90-frame browser soak).
2.8. `21.4` NYC `import()` — **DONE** (tiny: own chunks; engine still has export-name glue; `adBoardTexture` not in index).
2.9. `21.7` road UV dashes — **DONE** (tiny: dashes at lane boundaries, 8m period, CSM chain tested; white/yellow edge meshes kept; no photo QA).
2.10. `21.8` HaShalom ramp Y — **DONE** (`qa:ramp` already in `qa`; span 3.12m).
2.11. `21.12` collider offset CI — **DONE** (tiny: Ayalon buildings ≥ width/2+12; no `landmark-gps.ts` yet).
2.12. `4.5` airborne CI — **DONE** (tiny: `qa:airborne` in `qa`).
2.13. `4.1` crawl=0 above 12 m/s — **DONE** (tiny: `qa:drive`; kinematic mix still on below ~10 m/s).
2.14. `21.15` KTX2 honesty — **DONE** (tiny: uncompressed blob gated; removed unused GLTF KTX2Loader; still 0 UASTC).
2.15. `8.4` CSM 3/1/0 at boot — **DONE** (tiny: High 3@1024, Mid 1@512; not rebuilt in applyQuality).
2.16. `5.4.5` Ayalon 200m no building hit — **DONE** (tiny: in `qa:drive`; OBB still not on every landmark).
2.17. `5.5` CCD 2-cut above 25 m/s — **DONE** (tiny).

### 3. After Hashalom still arrives
3.1. Pose-lock `hashalom` in `goldenCameras.ts` to match the still.  
3.2. `5.2` Only then: Azrieli band counts 187/169/154 vs the still (still primitives — say so).  
3.3. Stop adding new named towers. QA the **existing** set vs the still.  
3.4. `5.5` Freeze: `AYALON_LOCK` stops incrementing; world.ts Ayalon block becomes read-only except bugs.  
3.5. Commit `golden: freeze ayalon` with user ACK.

### 4. After freeze only — Israel 7.x
4.1. Create `src/game/landmark-gps.ts` (14.9).  
4.2. One track per session: Rothschild → Hayarkon → Jaffa → Jerusalem → Ramon → Hermon → Carmel.  
4.3. Each: 8 GPS + collider offset + one golden pose. No new cities.

### 5. After one Israel slice looks like a game — renderer
5.1. Do **not** switch default to WebGPU.  
5.2. `2.1` real wet shader **or** document MeshPhysical as the cap.  
5.3. CSM 3/1/0 matrix.  
5.4. KTX2: either UASTC atlases **or** delete the loader claim.  
5.5. Zero NYC canvas in Israel bundles (already dynamic). Strip remaining canvases.  
5.6. World cells 256m — only if drawCalls > budget.

### 6. Never in this sandbox
Unreal, OSM/DEM, scanned cars, Nanite/Lumen/RT, TRAA-on-WebGL, SSGI, 50 cars, online, garage, "we finished the master plan".

---

## Next slice if the user says `המשך` with no photo

Integrity leftovers without a still are CI/docs only. **Do not** add landmarks. Freeze still blocked.
