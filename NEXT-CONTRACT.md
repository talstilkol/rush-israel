# RUSH Israel — NEXT Contract

**Version:** 20.27.0
**Date:** 2026-09-10, Asia/Jerusalem
**Main:** e01d91de5dfa11685a51dcea90c1dbc8e2d2148a
**Repair base:** 8f446969082e85a78487e02092ce8d6e803435e7
**Active:** RSH-036 / PR #39 / agent/rsh-036-ayalon-freeze, unaccepted.

GitHub is the current source of truth. Re-read live refs,CI and sources before
changes. Standing owner audit/repair/master-plan authority continues.35/67 accepted;
32 remain. No merge,freeze,release,force-push,history rewrite or RSH-037 activation.

## Verified baseline
r6.26 product `6fb27397b9edec289a48e8acf598cb049ba6b002` tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0` exact-head requiredCI 34460850784
job 102818068809 passed 1,283 units. Artifact required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`;
audit-source-34460850784-1 SHA-256
`22bb39cd0599969ff8463823e0c395a2a7b77fe176be5c8be0d392be0770c00a`. Last
successful exact-head product baseline.

r6.24 product `d02e110baa4e3b74976d0b7ad1e0576faa431953` tree
`5c0b7667e8775f04c67b62285a78d9805b473f23` exact-head requiredCI 34454517944
job 102797680687 passed 1,229 units. Artifact required-ci-34454517944-1 SHA-256
`b7034f320d86317ef571953e2f9934e9d1ed8a9dffc9ec6c3d8ff4e7b8c20594`. Retained.

r6.23 product `369dfe7a73bc225750d78c29497d90878960c930` tree
`af3fb764560d8a21a7577ea8810c91ef740a3f0b` exact-head requiredCI 34452081855
job 102789874804 passed 1,206 units, 0 errors, mesh hits 0.
Artifact required-ci-34452081855-1 SHA-256
`1ed0edf10d94cb6b466b7271e9d12828c8725008f83f464be781652abcb31522`. Retained.

Original golden remains 0/4. Live rest chase after snapCamera(true) matches the
26 August 7.4/1.92 matrices at g01/g05/g07/g08. Live contribution is not golden
mismatch: 7×7 vs locked PNG is 48–49/49 and no named layer reduces mismatch when
hidden. Ground live 51% at g05/g08 has mismatchDelta 0. HUD-on-black page
captures are not scene comparison. Preserve historical preparation 34324754353.
PNG bytes last changed 26 August 12:00:42Z, before spaghetti ramps.

r6.17 requiredCI 34385617080 failed at Playwright `--with-deps` (Google Chrome
apt hash-sum mismatch) before any product test. Retained; not a product defect.

r6.18 product `5dc27ac2f75c985fb85a2d2b235c0e5aa24bc6c2` tree
`3278c5ef62054025d5a29b49b24d2b3b494cd581` exact-head requiredCI 34387082287
job 102585948504: Chromium install **succeeded**; 1,142/1,142 units passed;
overall **FAILED** at runtime-recovery: 8 ramp supports protruded
(maxProtrusion 1.9346875033714142). Artifact required-ci-34387082287-1 SHA-256
`5c10b6eb4fbf12dcde41073852637d16b360f16700edac5249ba5882df62b31c`. That
failure is retained and is not relabelled a pass.

r6.27 product `8f446969082e85a78487e02092ce8d6e803435e7` tree
`29e5248cfef26f38a31935dee844e45a190ead1d` exact-head requiredCI 34480369405
job 102881359050 **FAILED** at lint: `verifyWorldLayers is not defined` after
the residual import replaced the world-layer import. Artifact
required-ci-34480369405-1 SHA-256
`0bffbb9366dc3a9172e8ef3e9371f799e1f15d55d06a6f5beb6e347ccd5c32ec`. Retained;
not relabelled a pass.

## r6.28 and subsequent acceptance
1. Live-contribution-only labels are not original-golden mismatch. Live
   isolation must sample the locked 26 August PNG on the same 7×7 WebGL grid,
   hide each named residual layer and record mismatchDelta at g01/g05/g07/g08.
   Smoke must keep verifyWorldLayers, verifyWorldResidual and verifyWorldMismatch.
   Live rest chase 7.4/1.92 must stay. Remaining pixel 0/4 is mixed whole-frame
   divergence from the 26 August PNG lock, not a single isolatable layer at this
   grid. PNG refresh, threshold drift and skipped comparison fail closed. 176
   piers, 546 legacy colliders, 50 ramps, rest-pose 1.6, 1.05 radius and
   generation-11 lock stay. Freeze path count stays 85. Pixel 0/4 is not freeze.
2. Preserve the r6.18 Chromium install retry, the r6.19 slab-underside support
   placement, the r6.20 product font URL pins, the r6.21 rest chase 7.4/1.92,
   the r6.22 complete arcade lap, the r6.23 visual hull, the r6.24 original
   protocol, the r6.25 rest-camera attribution, the r6.26 world-layer isolation
   and the r6.27 residual split.
3. Preserve 1280x800 images, threshold 0.12, failure 8%, generation 11 lock and
   owner approval. Do not refresh golden PNGs or silently change typography.
   Rendering performance remains open.
4. Only validated applicable approval may grant freeze or open RSH-037.

Master plan r6.28 retains 67 units, 42 historical findings, 6 bundles and 38
audit IDs. All 13 release gates remain open; 66 asset licences remain unverified.
