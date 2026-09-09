# RUSH Israel — NEXT Contract

**Version:** 20.16.0
**Date:** 2026-09-09, Asia/Jerusalem
**Main:** e01d91de5dfa11685a51dcea90c1dbc8e2d2148a
**Repair base:** 79a67c6f21c6e517c659350b1ce48ae1525a4e21
**Active:** RSH-036 / PR #39 / agent/rsh-036-ayalon-freeze, unaccepted.

GitHub is the current source of truth. Re-read live refs,CI and sources before
changes. Standing owner audit/repair/master-plan authority continues.35/67 accepted;
32 remain. No merge,freeze,release,force-push,history rewrite or RSH-037 activation.

## Verified baseline
r6.16 product `79a67c6f21c6e517c659350b1ce48ae1525a4e21` tree
`a02eaafced9edc0c1127214eaf39df99fc935dc3` exact-head requiredCI 34356869016
job 102483660303 passed 1,110 units, 0 errors. Artifact required-ci-34356869016-1
SHA-256 `dfe83b420ef3650acecc858b76c17928102b83ec45f105c07bdc88c704b4d369`;
audit-source-34356869016-1 SHA-256
`bcd4989dd38edc5e38043b45dcb1615c591f2fb8ebae3740caf56381e16a8d80`.
Original golden remains 0/4 from preparation 34324754353. Preserve that
historical evidence; do not treat old pending fields as unexecuted work.

## r6.17 and subsequent acceptance
1. Validate whole-route arcade-envelope clearance: 781 centerline rest poses,
   ±2.2 lane samples, four-car grid versus the live 722-collider catalogue,
   9.4 underpass rest/pitched probes and a 1-second centerline drive. Support
   piers that sat on the carriageway are offset to the edge plus contact
   radius; count stays 176 and mesh/collider pairing stays intact. Preserve
   all 546 previous collider records, 50 ramp recipes, 8 checkpoints,
   rest-pose 1.6 height, 1.05 radius and generation-11 lock. Sampled arcade
   poses are not a render-mesh or every-tick race qualification.
2. Keep physicsVersion 7 frozen. Stored Ayalon records must load without
   conversion, deletion or version bump; version 6 rows are dropped, not
   rewritten. Handling constants, cars.ts and storage keys stay unchanged.
3. Run full exact-head CI and original-golden comparison. Preserve 1280x800
   images, threshold 0.12, failure 8%, generation 11 lock and owner approval.
   Any reference transition requires explicit provenance/approval, never
   automatic replacement. Qualify 3 mutable font references without
   distributing font files or silently changing typography. Rendering
   performance remains open.
4. Only validated applicable approval may grant freeze or open RSH-037.

Master plan r6.17 retains 67 units, 42 historical findings, 6 bundles and 27
audit IDs. All 13 release gates remain open; 66 asset licences remain unverified.
