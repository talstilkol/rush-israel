# RSH-036 r6.29 — 7x7 saturation is not whole-frame divergence without channel bias

Candidate, 10 September 2026. Base 42972edd6ad5068c697e248265143b71d49990b4
(r6.28 mismatch isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.28 exact-head CI was in progress at preparation and is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-39: 7x7 saturation count is not channel-bias attribution

r6.28 reported 48–49/49 mismatched 7×7 samples and no named layer that reduces
mismatch. A saturated count is not whole-frame world divergence. The new probe
samples the locked 26 August PNG on both Y-orientations, then records mean
signed R/G/B/luma deltas, mean absolute deltas, luma variance and sign
agreement after `snapCamera(true)`. Live-count-only labels, Y-flip-only labels
without the unflipped grid, PNG refresh and treating this probe as
original-golden fail closed. Smoke keeps `verifyWorldLayers`,
`verifyWorldResidual`, `verifyWorldMismatch` and `verifyWorldBias`.

Live 7×7 vs locked PNG after rest chase 7.4/1.92:

| pose | flipped | unflipped | meanDluma | meanAbsDluma | lumaVariance | signAgreement | kind |
|---|---:|---:|---:|---:|---:|---:|---|
| g01 | 49 | 49 | +23.55 | 72.34 | 6889 | 0.69 | structured |
| g05 | 49 | 49 | +26.10 | 64.86 | 5009 | 0.82 | structured |
| g07 | 48 | 49 | −3.66 | 27.60 | 2219 | 0.37 | structured |
| g08 | 48 | 48 | +27.44 | 47.89 | 2421 | 0.84 | structured |

Unflipped mismatch is not lower, so the 7×7 comparison is not a Y-flip
artifact. Mean-abs luma is 2–7× |mean| with variance 2219–6889, so the
mismatch is not a uniform lift. g07 mean is near zero while 48/49 still
mismatch. Camera stays 7.4/1.92. PNG refresh remains forbidden.

Local unique cases: 28 in `scripts/world-bias.test.mjs`. Previous r6.28
expected 1,337 + 28 = 1,365. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
