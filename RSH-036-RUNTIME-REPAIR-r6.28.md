# RSH-036 r6.28 — live contribution is not golden mismatch; restore world-layer smoke import

Candidate, 10 September 2026. Base 8f446969082e85a78487e02092ce8d6e803435e7
(r6.27 residual split). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## r6.27 exact-head CI retained as a lint failure

Required CI **34480369405**, job **102881359050**: FAILED at "Lint all tracked
source" on checkout `8f446969082e85a78487e02092ce8d6e803435e7`.
`scripts/runtime-recovery-smoke.mjs:75:25` — `verifyWorldLayers is not defined`.
The residual import replaced the world-layer import. Unit tests were skipped.
Artifact required-ci-34480369405-1 SHA-256
`0bffbb9366dc3a9172e8ef3e9371f799e1f15d55d06a6f5beb6e347ccd5c32ec`.
This is not a product golden failure and is not relabelled a pass.

## AUD-38: live changedFraction is not original-golden mismatch

r6.27 measured live sample change after hiding layers (ground 51% at g05/g08).
That is not PNG mismatch. The new probe samples the locked 26 August PNG on the
same 7×7 WebGL grid, then hides each named residual layer and records
`mismatchDelta`. Live-contribution-only labels fail closed. Smoke keeps
`verifyWorldLayers`, `verifyWorldResidual` and `verifyWorldMismatch`.

Live 7×7 vs locked PNG: g01 49/49, g05 49/49, g07 48/49, g08 48/49. No named
layer reduces mismatch when hidden. Ground live 51% has mismatchDelta 0. g07
ramps live 69% increases mismatch by 1 when hidden. Camera stays 7.4/1.92.
PNG refresh and treating this probe as original-golden fail closed.

Local unique cases: 27 in `scripts/world-mismatch.test.mjs`. Previous r6.27
expected 1,310 + 27 = 1,337. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
