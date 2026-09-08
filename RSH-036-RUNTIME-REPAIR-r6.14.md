# RSH-036 — Circular collision repair r6.14

Date: 2026-09-08, Asia/Jerusalem. Base: `69e65048f888cbf1a273aaaec16806b27f10410b`.
Main remains `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a`. PR #39 only; 35/67 accepted,
32 remaining. No merge, freeze, release or RSH-037 activation.

## Reproduced defect and repair — AUD-24
The old circular contact phase skipped distance below 0.0001, including zero.
The same 22 actual-car regressions produce 3 passes / 19 failures on r6.13 and
22 passes / 0 failures on this candidate. This is one contact degeneracy, not
19 distinct defects. At positive distance use the existing radial normal. At
coincidence oppose incident velocity; at rest use deterministic +X. No radius
inflation, box-path edits, calibration changes or vertical support changes.
Ten report-validator cases reject partial, nonfinite and contradictory evidence.

## Required actual-world evidence
Run both stationary and moving overlap at every circular collider in the real
Ayalon catalogue. The report retains per-obstacle coordinates and finite-state
checks. It also reports existing pier-centre coverage and centreline ramp/slab
height overlaps. These are clearance observations, not roof/body acceptance.
Normal runtime CI must retain all existing route, 1,680-step contact, resource,
road-material, ramp-mesh, font, steering and landing tests.

## Reconciled prior checkpoint, not acceptance
r6.13 exact-head run34120397545/job101736885090 passed993 units,34 runtime cases,
5 readiness fixtures,3 airborne trials, all five acceleration baselines and
fullQA/typecheck/build. The original golden gate remained0/4. This update removes
stale pending summaries for those completed r6.13 checks while preserving their
failed preparation records and the unit's blocked acceptance. Historical RSH-035
execution constraints are explicitly separated from current standing authority.

## Boundaries and remaining work
Complete body/roof/column collisions, material/art/golden review, physics/record
compatibility and immutable font policy remain open. `PHYSICS_VERSION` remains7;
this is an explicit pre-freeze blocker, not a claim of compatible old records.
No record bytes, font files, assets, original PNGs, camera/ramp recipes or
thresholds are changed. Low rendering throughput is not repaired here.
All13 release gates remain open;66 asset licences remain unverified.
Final candidate CI and original-golden results must be read independently.
See `RSH-036-COLLISION-REVIEW-r6.14.json` and the exact-head PR checkpoint.
