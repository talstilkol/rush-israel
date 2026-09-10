# RUSH Israel — NEXT Contract

**Version:** 20.19.0
**Date:** 2026-09-10, Asia/Jerusalem
**Main:** e01d91de5dfa11685a51dcea90c1dbc8e2d2148a
**Repair base:** 712af4195208228a09feec643441549952ecee55
**Active:** RSH-036 / PR #39 / agent/rsh-036-ayalon-freeze, unaccepted.

GitHub is the current source of truth. Re-read live refs,CI and sources before
changes. Standing owner audit/repair/master-plan authority continues.35/67 accepted;
32 remain. No merge,freeze,release,force-push,history rewrite or RSH-037 activation.

## Verified baseline
r6.19 product `712af4195208228a09feec643441549952ecee55` tree
`272972601cb727e51a3f0b18c05a10d7eecf3d7a` exact-head requiredCI 34389785192
job 102594962162 passed 1,149 units, 0 errors, ramp supports maxProtrusion 0.
Artifact required-ci-34389785192-1 SHA-256
`d9d515b9dd30c82f3e44d1c6146bc022002e59e0698eb19cd7beb03f342edd2a`;
audit-source-34389785192-1 SHA-256
`df0d0762c48295d21b6a39f4a3da95129cdf3c200d87695e02eedbfc04af8451`.
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

## r6.20 and subsequent acceptance
1. The three product Google Fonts URLs are pinned. Family/weight/host drift and
   vendored font files fail closed. Remote stylesheet/glyph bytes stay unpinned.
   176 piers, 546 legacy colliders, 50 ramps, 8 checkpoints, rest-pose 1.6,
   1.05 radius and generation-11 lock stay. Freeze path count stays 85.
2. Preserve the r6.18 Chromium install retry and the r6.19 slab-underside
   support placement.
3. Run full exact-head CI and original-golden comparison. Preserve 1280x800
   images, threshold 0.12, failure 8%, generation 11 lock and owner approval.
   Do not distribute font files or silently change typography. Rendering
   performance remains open.
4. Only validated applicable approval may grant freeze or open RSH-037.

Master plan r6.20 retains 67 units, 42 historical findings, 6 bundles and 30
audit IDs. All 13 release gates remain open; 66 asset licences remain unverified.
