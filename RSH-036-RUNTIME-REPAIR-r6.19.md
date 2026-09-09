# RSH-036 r6.19 — offset support piers meet the slab underside

Candidate, 9 September 2026. Base 5dc27ac2f75c985fb85a2d2b235c0e5aa24bc6c2
(r6.18 Chromium install retry). No merge or freeze; 35/67 accepted; 32 remain.
r6.17 and r6.18 exact-head failures are retained. Do not relabel them as passes.

AUD-28 is closed only for the install helper: exact-head required CI 34387082287
/ job 102585948504 installed Chromium in 24s, ran 1,142/1,142 units, then
**FAILED** at runtime-recovery ramp supports. Artifact required-ci-34387082287-1
id 10118315128 SHA-256 `5c10b6eb4fbf12dcde41073852637d16b360f16700edac5249ba5882df62b31c`.
Checkout `5dc27ac` / tree `3278c5ef` verified. That overall failure is retained.

AUD-29: r6.17 `offsetSupportPierFromRoute` moved mesh and collider XZ but kept
`h = py - 0.95` from the origin centreline. Slope-aligned climbing connectors
then protruded through the parent slab. Retained measurement: 8 failed ramps,
176 piers, maxProtrusion 1.9346875033714142. Recipe hash
`f8daeebcaa7ace85ef47f139212f868160cc4376b190817daec4bf55547752e2` unchanged.

`placeSupportPierOnRamp` now sets the cylinder top to the slab underside at the
placed XZ. A full offset that would bury the cylinder is scaled back so the
pier remains. Count stays 176. Rest-pose 1.6, 1.05 radius, 546 legacy colliders,
50 ramps, 8 checkpoints and physicsVersion 7 stay unchanged.

Local live Chromium: ramp-surface 3/3, 176 piers, maxProtrusion 0, colliders 722;
route-clearance 5/5, 781/158/84 probes undisplaced. Local unit suite 1,149/1,149
(previous r6.18 1,142 + 7 unique cases). Original golden, three mutable fonts and
freeze remain open.
