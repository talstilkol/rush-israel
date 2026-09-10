# RUSH Israel — NEXT Contract

**Version:** 20.20.0
**Date:** 2026-09-10, Asia/Jerusalem
**Main:** e01d91de5dfa11685a51dcea90c1dbc8e2d2148a
**Repair base:** ece282e4acdf95d5dc256122e54925d24e5d38ed
**Active:** RSH-036 / PR #39 / agent/rsh-036-ayalon-freeze, unaccepted.

GitHub is the current source of truth. Re-read live refs,CI and sources before
changes. Standing owner audit/repair/master-plan authority continues.35/67 accepted;
32 remain. No merge,freeze,release,force-push,history rewrite or RSH-037 activation.

## Verified baseline
r6.20 product `ece282e4acdf95d5dc256122e54925d24e5d38ed` tree
`415da9919de2a71ea93938563aa38647a40a8b80` exact-head requiredCI 34442339244
job 102759811481 passed 1,158 units, 0 errors, ramp supports maxProtrusion 0.
Artifact required-ci-34442339244-1 SHA-256
`db188f5ee77699818fdda3ca02e7d5c6c9a60e27c5971ea90b4c1c03d8551e30`;
audit-source-34442339244-1 SHA-256
`75b5d9df6b8c37a0740bab09f65d1b020e08fbc6aba023b65b1d1f1e43218868`.
Original golden remains 0/4 from preparation 34324754353. Preserve that
historical evidence; do not treat old pending fields as unexecuted work.

r6.17 requiredCI 34385617080 failed at Playwright `--with-deps` (Google Chrome
apt hash-sum mismatch) before any product test. Retained; not a product defect.

r6.18 product `5dc27ac2f75c985fb85a2d2b235c0e5aa24bc6c2` tree
`3278c5ef62054025d5a29b49b24d2b3b494cd581` exact-head requiredCI 34387082287
job 102585948504: Chromium install **succeeded**; 1,142/1,142 units passed;
overall **FAILED** at runtime-recovery: 8 ramp supports protruded
(maxProtrusion 1.9346875033714142). Artifact required-ci-34387082287-1 SHA-256
`5c10b6eb4fbf12dcde41073852637d16b360f16700edac5249ba5882df62b31c`. That
failure is retained and is not relabelled a pass.

## r6.21 and subsequent acceptance
1. Rest chase returns to follow 7.4 / height 1.92. Accepted adapter bytes stay
   behind the overlay. 176 piers, 546 legacy colliders, 50 ramps, 8 checkpoints,
   rest-pose 1.6, 1.05 radius and generation-11 lock stay. Freeze path count
   stays 85.
2. Preserve the r6.18 Chromium install retry, the r6.19 slab-underside support
   placement and the r6.20 product font URL pins.
3. Run full exact-head CI and original-golden comparison. Preserve 1280x800
   images, threshold 0.12, failure 8%, generation 11 lock and owner approval.
   Do not refresh golden PNGs or silently change typography. Rendering
   performance remains open.
4. Only validated applicable approval may grant freeze or open RSH-037.

Master plan r6.21 retains 67 units, 42 historical findings, 6 bundles and 31
audit IDs. All 13 release gates remain open; 66 asset licences remain unverified.
