# RUSH Israel — NEXT Contract

**Version:** 20.21.0
**Date:** 2026-09-10, Asia/Jerusalem
**Main:** e01d91de5dfa11685a51dcea90c1dbc8e2d2148a
**Repair base:** cc7c017548a3f29e6b3326cff7d0e50431f58c43
**Active:** RSH-036 / PR #39 / agent/rsh-036-ayalon-freeze, unaccepted.

GitHub is the current source of truth. Re-read live refs,CI and sources before
changes. Standing owner audit/repair/master-plan authority continues.35/67 accepted;
32 remain. No merge,freeze,release,force-push,history rewrite or RSH-037 activation.

## Verified baseline
r6.21 product `cc7c017548a3f29e6b3326cff7d0e50431f58c43` tree
`89958d495b24585b36a8320ad22898730bc2419c` exact-head requiredCI 34445990921
job 102770784283 passed 1,167 units, 0 errors, ramp supports maxProtrusion 0.
Artifact required-ci-34445990921-1 SHA-256
`082b53b7d04174db52cce0a05e4dc3f6a7c37dad66ad8982b74d8a7bbf1a9d19`;
audit-source-34445990921-1 SHA-256
`c1b494740b9667ff509780171681c2dbbba08eb174106dd650e3ae453fcd8808`.
Original golden remains 0/4 from preparation 34324754353. Preserve that
historical evidence; do not treat old pending fields as unexecuted work.

r6.20 product `ece282e4acdf95d5dc256122e54925d24e5d38ed` tree
`415da9919de2a71ea93938563aa38647a40a8b80` exact-head requiredCI 34442339244
job 102759811481 passed 1,158 units. Retained; not overwritten by r6.21.

r6.17 requiredCI 34385617080 failed at Playwright `--with-deps` (Google Chrome
apt hash-sum mismatch) before any product test. Retained; not a product defect.

r6.18 product `5dc27ac2f75c985fb85a2d2b235c0e5aa24bc6c2` tree
`3278c5ef62054025d5a29b49b24d2b3b494cd581` exact-head requiredCI 34387082287
job 102585948504: Chromium install **succeeded**; 1,142/1,142 units passed;
overall **FAILED** at runtime-recovery: 8 ramp supports protruded
(maxProtrusion 1.9346875033714142). Artifact required-ci-34387082287-1 SHA-256
`5c10b6eb4fbf12dcde41073852637d16b360f16700edac5249ba5882df62b31c`. That
failure is retained and is not relabelled a pass.

## r6.22 and subsequent acceptance
1. A 120-step / 1.62 m drive is not a complete lap. Production `aiInput` plus
   120 Hz `ArcadeCar.step` must finish an open Ayalon lap through 8 checkpoints
   without burial or respawn. 176 piers, 546 legacy colliders, 50 ramps,
   rest-pose 1.6, 1.05 radius and generation-11 lock stay. Freeze path count
   stays 85. Arcade lap is not mesh clearance.
2. Preserve the r6.18 Chromium install retry, the r6.19 slab-underside support
   placement, the r6.20 product font URL pins and the r6.21 rest chase 7.4/1.92.
3. Run full exact-head CI and original-golden comparison. Preserve 1280x800
   images, threshold 0.12, failure 8%, generation 11 lock and owner approval.
   Do not refresh golden PNGs or silently change typography. Rendering
   performance and mesh clearance remain open.
4. Only validated applicable approval may grant freeze or open RSH-037.

Master plan r6.22 retains 67 units, 42 historical findings, 6 bundles and 32
audit IDs. All 13 release gates remain open; 66 asset licences remain unverified.
