# Honest audit — Codex Web graphics master plan vs RUSH

Date: 2026-08-26. Verified against `/workspace/src`, not against chat claims.

**Overall: ~10% of the 26-section plan. Ship gates 0/13.**

Verdict labels: DONE (real, working, verified) | PARTIAL | FAKED | NOT DONE.

---

## Codex §1 strategy (4 layers)

| Item | Status | Evidence |
|---|---|---|
| 1.1 Ultra WebGPU | NOT DONE | No `WebGPURenderer` import anywhere |
| 1.1 Balanced WebGPU/WebGL2 | NOT DONE | One WebGL2 path only |
| 1.1 Compat WebGL2 | PARTIAL | The game *is* a WebGL2 prototype, not a designed Compat layer |
| 1.1 Photo/Cinematic WebGPU | FAKED | `enterPhoto()` exists; not a separate renderer, 30fps cinematic, or SS from same TSL |
| Stay on Web (no Unreal) | DONE | Still Three.js WebGL |

## Codex §2–3 content / assets

| Item | Status | Evidence |
|---|---|---|
| Hero car glTF | PARTIAL | `public/game/car-gt.gltf` + GLTFLoader. Same extrude, not a scan |
| KTX2 / Meshopt pipeline | NOT DONE | lockfile has meshoptimizer via three; no loader, no `.glb/.ktx2` in repo |
| One photogrammetry road strip | PARTIAL | Baked PNG (`public/game/asphalt-8.png`) — still procedural, not a scan |
| Authored facades | NOT DONE | `canvasInventory.ts` lists all sites `runtime` |
| GIS / OSM / DEM Israel | NOT DONE | Spline + GPS-ish `tlv()` offsets |
| Zero generic buildings (Ayalon) | PARTIAL | Instanced scatter skipped; remaining landmarks are primitives |

## Codex §4 color / lighting

| Item | Status | Evidence |
|---|---|---|
| Linear + ACES | DONE | `ColorPipeline.ts` + verified in facade |
| Physical exposure lookdev | PARTIAL | `LOOKS` presets; no calibrated EV, no HDRI |
| Day sun usable | PARTIAL | dir 1.45, still one light, no CSM |
| Night actually night | PARTIAL | Dimmed 2026-08-26; canvas sky + discs |
| HDRI environment | NOT DONE | `bakeEnv()` tiny PMREM scene |
| CSM | PARTIAL | Second tight directional map (±18m). Not three.js `CSM` class, not 3 cascades |
| Reflection probes | PARTIAL | CubeCamera 96px on player paint every 8 frames. Not world probes |
| Volumetrics / SSGI | NOT DONE | — |

## Codex §5–7 renderer

| Item | Status | Evidence |
|---|---|---|
| RendererFacade | PARTIAL | Class exists; always constructs `WebGLRenderer` |
| CapabilityProbe | PARTIAL | `navigator.gpu` check; unused to pick a backend |
| TSL / MRT | NOT DONE | — |
| TRAA / TAAU | NOT DONE | SMAA on High only (`postfx.ts`) |
| Forced-WebGL CI | NOT DONE | No CI job |
| Debug hooks stripped in shipping | PARTIAL | Localhost/`?qa=1` only. Hosted prod has no hook |

## Codex §8–10 world streaming

| Item | Status | Evidence |
|---|---|---|
| World cells | NOT DONE | One `createWorld()` dump |
| LOD / HLOD | NOT DONE | Some instancing; no HLOD |
| BatchedMesh | NOT DONE | InstancedMesh only |
| Streaming | NOT DONE | — |

## Codex §11–14 materials

| Item | Status | Evidence |
|---|---|---|
| Road dielectric | DONE | `metalness: 0` dry/wet |
| Road dry/wet high quality | PARTIAL | Params exist; canvas maps |
| Car paint flakes + clearcoat | PARTIAL | Procedural flake canvas, not scanned paint |
| Glass dielectric | PARTIAL | Azrieli/ToHa/IBM `metalness: 0` |
| Planar SSR / wet GT-style | NOT DONE | Weak planar mirror + additive discs |

## Codex §15–20 post / weather / photo

| Item | Status | Evidence |
|---|---|---|
| Bloom gated to night High | DONE | `UnrealBloomPass` night+high only |
| Weather system | PARTIAL | rain/storm/hamsin flags; not volumetric |
| Photo mode marketing-safe | PARTIAL | Mode exists; not labeled, not same-shader cinematic |

## Codex §21–24 QA / CI / soak

| Item | Status | Evidence |
|---|---|---|
| Golden cameras array | DONE | `AYALON_GOLDEN` 12 poses + `gotoGolden` |
| Golden PNGs as runtime truth | PARTIAL | 6 PNGs; they show a prototype, not a pass |
| Telemetry P50/P95 | PARTIAL | Ring buffer; headless P95=100 artifact |
| Dynamic quality | PARTIAL | Controller class; not proven on device |
| Soak 100 menu↔race | PARTIAL | Script default 8 cycles |
| 30 min drive soak | FAKED | `soak-30min.mjs` exists; not a green CI gate |
| WebGPU + WebGL2 CI green | NOT DONE | — |

## Codex §25 top-10 (the only things that matter)

| # | Item | Status |
|---|---|---|
| 1 | Hero car | NOT DONE |
| 2 | One real road segment | NOT DONE |
| 3 | Color/exposure physical | PARTIAL |
| 4 | glTF/KTX2/Meshopt | NOT DONE |
| 5 | World cells + LOD | NOT DONE |
| 6 | Road dry/wet high | PARTIAL |
| 7 | WebGPURenderer + fallback | NOT DONE |
| 8 | CSM + probes | NOT DONE |
| 9 | TRAA/TAAU | NOT DONE |
| 10 | Weather/SSGI/volumetrics | NOT DONE |

## G0–G6 (older wave list)

| ID | Item | Status |
|---|---|---|
| G0-01 | Telemetry | PARTIAL |
| G0-02 | Golden cameras + PNGs | PARTIAL |
| G0-03 | Capability probe | PARTIAL |
| G0-04 | Deterministic QA hooks | PARTIAL |
| G0-05 | Lookdev exposure | PARTIAL |
| G0-06 | Shader warmup compile | PARTIAL (`renderer.compile` was added; not a variant matrix) |
| G0-07 | Canvas inventory | DONE (inventory only — replacements NOT DONE) |
| G1-01 | Facade | PARTIAL |
| G1-05 | ResourceRegistry | PARTIAL (class exists) |
| G1-08 | Lazy engine import | PARTIAL |
| G2 car meshes | NOT DONE (extrude) |
| G3 flakes | PARTIAL |
| G4 blob shadow | PARTIAL (disc, not contact-hardened) |
| G5 facade atlas Ayalon/Rothschild | NOT DONE |
| G6 headlight projector | FAKED (additive circle, not cookie projector) |

## P0–P5 (gameplay / Israel)

| ID | Item | Status |
|---|---|---|
| P0 road as mesh + lane UV | PARTIAL | Mesh + canvas UV, not unique 8-lane geo |
| P1 HDRI sky | NOT DONE | Gradient canvas / Sky hidden |
| P2 5 hero cars | NOT DONE | 5 *layouts*, same extrude family |
| P3 4-wheel physics | PARTIAL | Pacejka helper + 2.5D spline car, not 4 contacts |
| P4 Ayalon landmarks | PARTIAL | Silhouettes (Azrieli/ToHa/IBM/Yovel), not scans |
| P4 Rothschild / Jaffa / Jerusalem / Ramon / Hermon / Carmel | NOT DONE as quality slice |
| P5 minimal UI | PARTIAL | Race HUD stripped; menu still has career/settings chrome |
| Track bounds clear | PARTIAL | Paint + curbs; user still complained |
| Building vs car collision | PARTIAL | Cylinders, not OBB |

Anything previously checked as done in chat that is **FAKED**: WebGPU path, GIS Israel, photogrammetry, CSM, SSR, 100-cycle soak as a gate, 30-min soak as a gate, hero GLB, “world’s best racing game”.

---

## Execution plan (only this order)

Do **not** add tracks, career, online, or garage.

### Phase A — stop lying to the renderer (1 week of real work)
1. Keep WebGL2. Do not start WebGPU until A4 is green.
2. Kill remaining runtime debug in production builds (`__controlsTest` behind `import.meta.env.DEV`).
3. Forced-WebGL2 Playwright job: boot Ayalon, `gotoGolden g05`, PNG + JSON dump.
4. Replace `bakeEnv` toy PMREM with one authored HDR (even 512²) or keep canvas sky but **stop calling it HDRI**.
5. Shader warmup list: scene compile once, log ms.

### Phase B — one honest vertical slice: Ayalon 400m (the only art)
1. Author **one** road glTF strip (even 50m tiled) with real albedo/rough/normal. Kill canvas asphalt on that slice.
2. Author **one** car glTF (the Sabra/GT). Kill extrude for the player only.
3. Azrieli + ToHa: unique meshes (still hand-built is OK) with correct silhouette + dielectric glass. No more stacked boxes that read as IBM clones.
4. 8-lane UV that matches Ayalon width in meters. Jersey + rails stay in the median.
5. Golden g01/g05/g08 must be compared to a reference photo. Fail the slice if grey boxes dominate.

### Phase C — lighting that matches the slice
1. One sun + hemi + IBL from the HDR. Exposure table: day 0.7 / golden 0.8 / night 1.0.
2. CSM 2–3 cascades **or** admit single map and tighten frustum (already ±58).
3. Night: lamp meshes + one real spotlight per nearby lamp (cap 4), not only discs.
4. Road wet: roughness/clearcoat only until planar RT is budgeted.

### Phase D — physics that matches the picture
1. Four wheel traces vs spline height. Pacejka already exists — wire per wheel.
2. OBB vs landmark colliders (Azrieli footprint). Cylinder vs traffic stays.
3. Grade from sample.y (already mostly there). Verify Ramon/Hermon A→B separately **after** Ayalon.

### Phase E — WebGPU only if B+C pass
1. `WebGPURenderer` behind CapabilityProbe. Same glTF. TSL Physical.
2. Compat = current WebGL2. If probe fails, never enter GPU path.
3. SMAA stays; TRAA only on Ultra after a frame-time budget (16.6ms).

### Phase F — Israel quality, one track at a time
Order frozen: Ayalon → Rothschild → Hayarkon/Reading → Jaffa → Jerusalem A→B → Ramon A→B → Hermon A→B → Carmel.
Each track: 15 GPS landmarks, zero generic instanced towers, golden cameras, photo QA.

### Out of scope until F
Unreal, Nanite, Lumen, 50 cars, online, upgrades, New York expansion, “100% Israel map”.
