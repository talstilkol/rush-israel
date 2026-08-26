# Codex audit — 26 Aug 2026 (honest)

**~12%.** Ship gates **0/13**. Not GT7. Not Asphalt Legends.

Statuses: DONE / PARTIAL / FAKED / NOT DONE.

## 1. Strategy layers
| Item | Status | Evidence |
|---|---|---|
| Ultra WebGPU | NOT DONE | no `WebGPURenderer` in `src/` |
| Balanced WebGPU/WebGL2 | PARTIAL | quality profiles + SMAA on High |
| Compat WebGL2 | PARTIAL | Low skips composer |
| Photo/Cinematic mode | NOT DONE | no Photo Mode |

## 2–10. Renderer / lighting / assets
| Item | Status | Evidence |
|---|---|---|
| RendererFacade | PARTIAL | WebGL only (`RendererFacade.ts`) |
| CapabilityProbe | PARTIAL | probes WebGPU, does not switch backend |
| Color / ACES | PARTIAL | `ColorPipeline` + dielectric; no HDRI |
| LookDev presets | PARTIAL | golden/rain flags; not calibrated |
| glTF cars | PARTIAL | 5 Meshopt GLB ~6.5KB extrudes |
| KTX2 textures | NOT DONE | loader hooked; **zero `.ktx2` files** |
| Meshopt | DONE | cars load `.glb` meshopt |
| ResourceRegistry | PARTIAL | exists; not all RTs leased |
| DynamicQuality | PARTIAL | exists; not device-validated 60fps |
| World cells / HLOD | NOT DONE | |
| OSM / DEM / GIS | NOT DONE | GPS-ish constants only |
| Photogrammetry road | FAKED if marked done | baked procedural PNG |
| 2D baked sky | PARTIAL | `sky-day.png` / `sky-night.png`; not HDRI |
| Dual directional shadows | PARTIAL | not Three.js CSM |
| CubeCamera probe | PARTIAL | 96px every 8 frames |
| SMAA | PARTIAL | High only |
| TRAA / TAAU | NOT DONE | |
| SSGI / volumetrics | NOT DONE | |
| Planar road reflector | PARTIAL | |
| Blob shadow | PARTIAL | radial PNG |
| Flake paint | PARTIAL | noise PNG, not flakes |
| CI WebGPU+WebGL | NOT DONE | no `.github/` |

## G0–G6
| Item | Status |
|---|---|
| G0 Low direct-to-screen | DONE |
| G1 road specular | PARTIAL |
| G3 car paint + probe | PARTIAL |
| G4 blob | PARTIAL |
| G5 facade atlas (photos) | FAKED | curtain drawings |
| G6 headlight cookie | PARTIAL | `beam.png` |

## P0–P5 Israel
| Item | Status |
|---|---|
| P0 road mesh + UV lanes | PARTIAL |
| P1 HDRI | NOT DONE (2D sky instead) |
| P2 5 cars | PARTIAL (extrude) |
| P3 4-wheel physics | PARTIAL (Pacejka on spline) |
| P4 Ayalon landmarks | PARTIAL | silhouette only: Azrieli ratio, ToHa twist, City Gate hole, Savidor vault, Midtown twins, thick ramps, IR nose, HaShalom tube. **Not scans.** |
| P4 Rothschild / Hayarkon / Jaffa / Jerusalem / Ramon / Hermon / Carmel | PARTIAL | identity, not photogrammetry |
| P4 zero generic buildings (Ayalon) | PARTIAL | NYC scatter/crowd/ads off |
| P5 minimal UI + Esc | DONE |
| P5 60fps soak | NOT DONE |
| P5 real track-card photos | NOT DONE |

## Runtime canvas (still present = not 100)
Fallbacks remain in `world.ts`, `engine.ts` (`paintSky`), `car-mesh.ts`, `nyc-landmarks.ts`, `buildings.ts` (Hebrew signs), `mkSign`.

## What changed since last audit (still not a % bump)
Azrieli height ratio, ToHa diamonds, City Gate hole, Savidor vault, Midtown/Electra, thick ramps, IR nose, HaShalom ribs. All primitives.

## Ship gates (all red)
Hero car scan, real road segment, physical lighting, KTX2 content, world cells, wet road, WebGPU, CSM, TRAA, weather/SSGI, GIS Israel, golden-camera CI, no canvas in shipping.
