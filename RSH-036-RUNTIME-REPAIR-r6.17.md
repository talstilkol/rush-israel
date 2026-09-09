# RSH-036 r6.17 — whole-route envelope clearance and v7 record lock

Candidate, 9 September 2026. Base 79a67c6f21c6e517c659350b1ce48ae1525a4e21
(r6.16 envelope; exact-head requiredCI 34356869016 / job 102483660303,
1,110/1,110, tree a02eaafced9edc0c1127214eaf39df99fc935dc3). No merge or
freeze; 35/67 accepted; 32 remain. r6.16 exact-head evidence is retained.

AUD-27 samples the live Ayalon catalogue with the r6.16 arcade envelope:
781 centerline rest poses, lane poses at ±2.2, the four-car grid against all
722 colliders, 9.4 underpass rest/pitched probes, and a 1-second centerline
drive. Isolated envelope cases missed a support planted on a climbing
connector centerline. `offsetSupportPierFromRoute` now pushes that support
to width/2 + 0.72 + 1.05; mesh and collider move together. Count stays 176.
Rest-pose 1.6, 1.05 radius, 546 legacy colliders, 50 ramps and 8 checkpoints
stay unchanged. This is still not a render-mesh or every-tick race
qualification.

A separate frozen physicsVersion 7 fixture proves stored Ayalon records load
without conversion, deletion or version bump. Canonical rewrite of live v7
rows does not change the version. Version 6 rows are dropped, not rewritten.
Handling constants, cars.ts and storage keys are unchanged.

Local live Chromium against the running product: five route-clearance cases
passed; 781/158/84 probes with zero rest-pose displacement; 1s drive
progressed 1.620 m, buried 0, airborne 0; 176 piers and 722 colliders
preserved. Local unit suite 1,136/1,136. Original golden, three mutable
fonts, complete dependency closure and freeze remain open. All 13 release
gates remain open; 66 asset licences unverified. Exact published-head CI is
pending for this candidate.
