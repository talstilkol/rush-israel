# RSH-036 — r6.6 readiness and generated dependency inventory

Date: 2026-09-06, Asia/Jerusalem. Base: `8c6a3be70fc22cbe35dc4a4e40fa14b0ef83c85f`.
Main remains `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a`. Accepted35/67. No freeze/merge/release.

## Reconciliation
The live r6.5 source, not the older chat attachment, is authoritative. Its normal
CI run33995840557 passed688 tests and20 browser cases. All727 baseline Git blobs
were verified against the downloaded exact-source artifact9978022662. The local
716-test alternate bundle is not substituted for the live tree.

## Readiness repair
The GameApp root stays inert until React hydration and saved-setting initialization
finish. Nonvisual data attributes expose app/screen/track readiness. Golden capture
waits for actual controls, the actual Ayalon engine, a progressing engine tick and
visible minimap, and rejects wrong quality/weather/backend/photo mode.
Original frame order, 1280x800 viewport, camera calls and450/400/500ms post-pose waits
are unchanged. This intentionally does not claim deterministic pixel content.
Capture diagnostics record engine/pose/viewport/font state, failed requests and
page errors; try/finally closes the browser on failure. Stale output reports are
removed before a new attempt. No original image is rewritten; UPDATE_GOLDEN=1 and
output directories overlapping the baseline, including symlinks, fail closed.

## Generated closure
Whole src/server/scripts/public/golden-baseline/workflow trees and toolchain/build
configuration are enumerated and hashed. Static/dynamic/alias/package imports and
the known local virtual provider are classified. All public bytes cover computed
asset URLs conservatively, without asserting minimal Ayalon-only reachability.
Added/deleted/modified files, unresolved imports, malformed model dependency data,
symlinks and undeclared packages cannot pass. Remote references and mutable action
tags remain explicit qualifications; the overall closure and freeze remain false.
The inventory is consumed by the Ayalon validator and normal CI, not merely written.

## Validation status at preparation
New local unit suites:14 readiness +24 dependency cases passed. Local execution
uses the available TypeScript installation and is not a locked dependency install.
Five browser harness cases cover delayed UI/engine readiness and negative cases;
they still require execution. Full normal CI and separate original golden gate
must run against the exact published tree. Read the later PR checkpoint for actual
results; this document is not a fabricated acceptance record.

## Preservation
Original PNGs,20 unique frames,4 non-authority placeholders, generation11 lock,
owner approval, assets, track geometry, physics, rendering and package lockfiles
remain unchanged. Existing688 tests and20 browser cases remain enabled. Historical
projections are exact and separately guarded against production-source rollback.

## Remaining
Golden0/4 was the verified prior result. New results are not predicted. External
resource qualification, frame/configuration attribution and full visual acceptance
remain mandatory. All13 release gates open;66 asset licences unverified.
