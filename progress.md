# Progress

## G0 Sprint 1 — PARTIAL
Telemetry, 12 golden cameras, probe, inventory, exposure 0.68, Three pinned 0.185.1.

## G1 Sprint 2 — PARTIAL (2026-08-26)
- `RendererFacade` wraps WebGLRenderer: init/resize/setQuality/setEnvironment/render/dispose (idempotent)
- `ColorPipeline`: sRGB + ACES only
- `ResourceRegistry`: ref-count leases
- `AssetRegistry`: all current assets `license: unknown`
- RaceEngine still owns scene/post/composer. **Not** backend-agnostic. **No WebGPU.**

## Not done
WebGPURenderer, TSL, CSM, TRAA, GIS, hero GLB, soak 100, forced-WebGL CI.
