# RUSH Israel — NEXT Contract

**Version:** 20.17.0
**Date:** 2026-09-09, Asia/Jerusalem
**Main:** e01d91de5dfa11685a51dcea90c1dbc8e2d2148a
**Repair base:** ec9fba559370560fc1c3a957b6c2d6fecf79f99f
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

r6.17 product `ec9fba559370560fc1c3a957b6c2d6fecf79f99f` tree
`d34ec85cf0516da335a89534fba2435ef238ac2c` exact-head requiredCI 34385617080
job 102580995300 **FAILED** at Playwright `--with-deps` on a Google Chrome apt
hash-sum mismatch before any product test. That failure is retained and is not
a product defect, a pass, or unit acceptance.

## r6.18 and subsequent acceptance
1. Validate Chromium install retry: Google Chrome apt hash-sum mismatch falls
   back to the Playwright CDN binary; ordinary install failures still fail.
   required-ci must not keep a bare `--with-deps` one-liner or continue-on-error.
   Action pins and the 85-path freeze list stay unchanged.
2. Preserve r6.17 whole-route arcade-envelope clearance and frozen
   physicsVersion 7 records. 546 legacy colliders, 176 piers, 50 ramps,
   8 checkpoints, rest-pose 1.6 height, 1.05 radius and generation-11 lock stay.
3. Run full exact-head CI and original-golden comparison. Preserve 1280x800
   images, threshold 0.12, failure 8%, generation 11 lock and owner approval.
   Qualify 3 mutable font references without distributing font files or silently
   changing typography. Rendering performance remains open.
4. Only validated applicable approval may grant freeze or open RSH-037.

Master plan r6.18 retains 67 units, 42 historical findings, 6 bundles and 28
audit IDs. All 13 release gates remain open; 66 asset licences remain unverified.
