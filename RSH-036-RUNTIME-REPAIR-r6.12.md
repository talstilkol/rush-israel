# RSH-036 — r6.12 overhead-contact repair

Date:2026-09-06. Base:c0fa0572747f696ddeb74c754cb7a1a5a4a9d955. Main unchanged. Candidate not accepted.

## Reproduction and bounded repair
Actual ArcadeCar (all local runtime dependencies, no physics stubs) on flat ground beneath a9.4-unit bridge snapped from0 to9.4 in one1/120-second step. The same23 focused cases produced13 passes/10 failures before and23 passes/0 failures after the repair. This is one root contact defect, not10 separate defects.

`probeRamp` now rejects y>yHint+1.2 before scoring candidates. The1.2 entry allowance already existed in the tie-break and is retained. Every existing caller benefits: centre, wheel corners, grade and pitch. Lower-surface selection is unchanged. No mesh, ramp placement, camera, velocity/gravity/handling calibration, asset, original PNG, CSS, package-lock or normal-CI workflow changes.

The legacy `ramp-smoke.mjs` previously teleported to y=0.2 regardless of expected surface height, thereby requiring the now-reproduced overhead snap. It now teleports to the intended physical plane while retaining every ramp sample, height tolerance and span assertion. New independent contact tests explicitly prohibit underpass teleportation. This is a corrected test precondition, not disabling a failing acceptance gate.

## Validation to complete
Full local suite, locked exact-head CI, actual781 route-start probes with the full50-ramp list and250 supported-motion probes, retained QA and original golden comparisons must all be inspected. Sampling counts are not unique test-case counts or full route-clearance proof. Original pixel references, threshold0.12 and failure limit8% remain unchanged. No current golden pass is claimed at preparation time.

## Remaining
Roof/body clearance and low-crossing mesh intersections, support-column collision coverage, downward/airborne attachment, material/art review and3 mutable font dependencies remain open. No reference transition, freeze, release or RSH-037 activation. Master plan r6.12 retains67 units,42 historical findings and6 repair bundles; AUD-21 is the21st audit item. Accepted35/67;remaining32.

## Supplementary local result
906 unique unit cases passed;0 failed/skipped/cancelled.28 new cases =23 contact +5 exact current/historical guards. Local TypeScript5.8.3, not the locked remote dependency install. This does not substitute for the pending exact-head CI/browser/golden runs.
