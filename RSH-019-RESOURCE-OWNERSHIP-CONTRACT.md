# RSH-019 — Resource ownership, disposal and leak accounting

**Implementation base:** `bf1af8015a36cbe3ef34494f6d2b24eace3f153b`  
**Branch:** `agent/rsh-019-resource-ownership`  
**State:** effective only on validated merge

## Contract

Every per-engine resource has one explicit owner and one idempotent teardown path.
The engine stops scheduling work first, detaches listeners, releases registry leases in
reverse creation order, disposes the world and all car-visual families, sweeps remaining
scene geometries/materials exactly once, and disposes the renderer last.

Global asset-cache textures are process-lifetime shared resources and are intentionally
excluded from per-engine Object3D disposal.

## Verification

- ResourceRegistry ref-count, reverse-order, late-retain and error-continuation tests.
- Static fail-closed source/manifest validator.
- Exact RSH-015 world and RSH-016/RSH-017 engine reconstruction after stripping the
  authorized RSH-019 overlay.
- Menu→race leak smoke checks both texture and geometry deltas.
- RSH-040, RSH-041 and RSH-042 reliability gates remain deferred.
- RSH-020 is not authorized or started.
