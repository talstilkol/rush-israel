# G0 Sprint 1 — 2026-08-26

## Done (real)

- QualityProfile schema v1 (`compat/balanced/high`; ultra/photo reserved)
- RenderTelemetry rolling P50/P95/P99
- CapabilityProbe: WebGL2 + optional WebGPU adapter (no 2–4s bench)
- 12 golden cameras on Ayalon (`AYALON_GOLDEN`) — poses = spline `t`, no reference photos
- Canvas texture inventory listed, **not** replaced
- `window.render_game_to_text` on localhost / `VITE_QA`
- Day exposure 0.50 → 0.68 (no extra bloom)
- Three.js pinned `0.185.1` (no caret)

## Not done

- WebGPURenderer, TSL, CSM, TRAA, SSGI, glTF/KTX2 cooker, GIS cells, hero GLB
- Forced-WebGL2 CI, 100 soak cycles, golden screenshot suite
- Runtime canvas textures still exist

## Known artifacts

- Corridor is still procedural boxes, not GIS
- Telemetry has no GPU timer query
- `ultra`/`photo` profiles are schema only
