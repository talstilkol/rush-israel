# RSH-036 r6.41 — combined dir luma is not sun vs near

Candidate, 10 September 2026. Base 5df0e7cf3917d5448e7a6ceee3a685a2f2a7e714
(r6.40 term isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.40 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-51: combined dir luma is not sun vs near

r6.40 proved dir luma plus scene.environment B occupy g01/g05/g08 bottom, but
dir was two lights (sun+near). The new probe isolates sun vs near vs fill vs
scene.environment after setNight/snapCamera(true) at threshold 0.12 without
changing product color or exposure. Term-only reports, luma-terms-include-hemi,
dir-is-combined, sun-clears-near, near-clears-sun, PNG refresh, color retune
and treating this probe as original-golden fail closed. Smoke keeps
`verifyWorldLayers` through `verifyWorldTerm` and `verifyWorldBeam`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
lumaTermsIncludeHemi false, dirIsCombined false, sunClearsNear false,
nearClearsSun false, sun 1 / near 1 / fill 1 / environment 1):

| pose | band | beam | sun luma Δ | near luma Δ | fill luma Δ | environment B Δ |
|---|---|---|---:|---:|---:|---:|
| g01 | bottom | environment | −28.0 | 0 | −3.4 | −48.7 |
| g05 | bottom | environment | −31.1 | 0 | −3.8 | −53.0 |
| g07 | upper | near | −2.8 | 0 | −0.4 | −40.9 |
| g08 | bottom | environment | −11.5 | 0 | −12.4 | −33.9 |

Sun occupies the entire r6.40 dir luma. Near is 0 on every pose. Fill joins
sun on g08 night. scene.environment remains the blue term. g07 upper remains
ramps (no contributing L2). Camera stays 7.4/1.92. PNG refresh and
color/exposure retune remain forbidden.

Local unique cases: 28 in `scripts/world-beam.test.mjs`. Previous r6.40 expected
1,673 + 28 = 1,701. Pixel 0/4, immutable CDN bytes, rendering performance and
freeze remain open.
