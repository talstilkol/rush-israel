# RSH-036 — resource rollback repair, r6.3

Date: 2026-09-05. Implementation base: `1ef48b96e8385c6dd3351c9a6ec43d45c1bd7aa8`.
Canonical main remains `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a`.
Accepted: 35/67; remaining: 32. This checkpoint does not grant freeze acceptance.

## Changes

Road texture loading is an owned transaction: all requests settle before failed
batches release every unique successful texture, including late arrivals. Loader
and preparation exceptions both roll back. Concurrent requests for the same lane
share a batch; failed in-flight state is removed, allowing a clean retry. Healthy
kits remain session-owned; no shared successful texture is disposed on race exit.
Original texture paths, preparation settings and output assets are unchanged.

RendererFacade now releases its WebGL renderer if initialization fails before
ownership transfers to RaceEngine. RaceEngine releases the facade and removes its
listeners if its synchronous constructor fails before the startup controller can
own the engine. Original errors are preserved; cleanup failures are aggregated.

Four additional browser assertions exercise actual modules: road batch rollback,
real asset retry/concurrent deduplication, renderer initialization failure, engine
boot-callback failure and partial listener setup. The road checks form one case.
Test-only fault injection is restored and performs separate emergency cleanup.

## Preparation evidence (not substituted for exact-head required CI)

- New pure batch/actual-loader tests: **18 passed, 0 failed** locally.
- Same six actual-loader regressions on the previous source: **1 passed, 5 failed**.
- Selected historical/current-source and architecture checks: **57 passed, 0 failed**.
- Local TypeScript transpilation uses the preinstalled compiler; this is not the
  locked npm toolchain/typecheck. Normal GitHub CI and browser results are pending
  at preparation time and must be verified on the final published source head.

## Black scene investigation — unresolved, not dismissed as a first-frame delay

Read-only investigation run **33986957618** observed 35 renderer frames and 606
draw calls with a black central framebuffer pixel, no GL error, valid camera
matrices and normal canvas visibility. Run **33987121204** reproduced the black
scene on BOTH `ba892686...` and `1ef48b96...`. Hiding the world group restored a
blue pixel; hiding the reported individual mesh did not resolve the black scene.
The mesh bisection result is therefore **inconclusive**, not proof of a culprit.
This observation predates the r6.2 minimap repair. A green minimap/runtime check
must not be described as whole-scene visual acceptance.

## Remaining acceptance work

1. Resolve persistent scene visibility and add a whole-scene negative regression.
2. Generate and validate complete static/dynamic/runtime-asset dependency closure.
   The refreshed **44-path inventory remains partial**; `freeze_granted=false`.
3. Recheck related asset loaders (including sky/tree multi-load batches) rather
   than extrapolating the road fix to all resource families. GPU memory on physical
   devices has not been measured; disposal-call proof is not device qualification.
4. Re-run unchanged golden thresholds and resolve review blockers before acceptance.

All original golden PNG bytes, `ayalon.lock` generation 11, historical owner
approval, package metadata and lockfiles are preserved. No RSH-037 activation,
merge, public distribution or release is claimed. All 13 release gates remain
open, and 66 asset files remain unverified for licensing.
