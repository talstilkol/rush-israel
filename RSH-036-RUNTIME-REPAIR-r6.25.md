# RSH-036 r6.25 — r6.8 camera delta is not post-restore original-golden evidence

Candidate, 10 September 2026. Base d02e110baa4e3b74976d0b7ad1e0576faa431953
(r6.24 original-golden protocol). No merge or freeze; 35/67 accepted; 32 remain.
r6.17 and r6.18 exact-head failures are retained. Do not relabel them as passes.

## r6.23 exact-head CI independently verified

Required CI **34452081855**, job **102789874804**: SUCCESS on checkout
`369dfe7a73bc225750d78c29497d90878960c930` / tree
`af3fb764560d8a21a7577ea8810c91ef740a3f0b`. Downloaded archives hashed in
r6.24. TAP **1,206/1,206**. Mesh-clearance live hits 0. This is not freeze or
original-golden acceptance. r6.24 required-ci **34454517944** was in progress
at preparation; do not invent its conclusion.

## AUD-35: remaining original-golden mismatch after the chase restore

r6.8 attributed original-golden failure to camera Δy 0.36 / Δz −1.8 (the
9.2/2.28 pull-back). r6.21 restored rest chase to 7.4/1.92. r6.24 ran the
original protocol and recorded 0/4 (61.58 / 50.56 / 31.22 / 64.73%). Page
screenshots can look HUD-on-black; that is not scene comparison.

The new probe spawns at g01/g05/g07/g08, calls `snapCamera(true)`, and reads
the WebGL buffer. Live rest camera matches the 26 August historical matrices
exactly (follow 7.4, height 1.92, fov 58). Scene luminance 0.92–1.00. World
catalogue is 50 ramps / 722 colliders versus historical 32/541. r6.8 0.36/1.8
deltas and HUD-on-black world labels fail closed. PNG refresh stays forbidden.

Local unique cases: 27 in `scripts/golden-attribution.test.mjs`. Previous
r6.24 expected 1,229 + 27 = 1,256. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
