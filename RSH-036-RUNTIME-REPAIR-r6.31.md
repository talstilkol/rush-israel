# RSH-036 r6.31 — full-frame scene scalar is not spatial-region mismatch

Candidate, 10 September 2026. Base aef87b4687ab64bde6725e4de5224b603e90ac65
(r6.30 scene-buffer isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.30 exact-head CI was in progress at preparation and is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-41: 29–70% scene scalar is not spatial-region attribution

r6.30 reported presentPct 0.6926/0.594/0.2933/0.7016 after product present
capture. A single frame scalar is not where the locked PNG diverges. The new
probe splits the 1280×800 present buffer into four 200px bands (top, upper,
lower, bottom) and pixelmatches each at threshold 0.12. Scalar-only reports,
missing dominant, PNG refresh and treating this probe as original-golden fail
closed. Smoke keeps `verifyWorldLayers`, `verifyWorldResidual`,
`verifyWorldMismatch`, `verifyWorldBias`, `verifyWorldScene` and
`verifyWorldRegion`.

Live present bands after rest chase 7.4/1.92:

| pose | presentPct | top | upper | lower | bottom | dominant |
|---|---:|---:|---:|---:|---:|---|
| g01 | 0.6926 | 0.4985 | 0.6461 | 0.7580 | 0.8646 | bottom |
| g05 | 0.5940 | 0.2243 | 0.4736 | 0.8242 | 0.8531 | bottom |
| g07 | 0.2933 | 0.1894 | 0.6045 | 0.2735 | 0.1060 | upper |
| g08 | 0.7016 | 0.4798 | 0.6021 | 0.8437 | 0.8807 | bottom |

Mismatch is not spatially uniform. g01/g05/g08 concentrate in the bottom
foreground (85–88%) while sky/top is 22–50%. g07, the closest overall, is the
inverse: upper 60% while bottom is only 11%. Camera stays 7.4/1.92. PNG refresh
remains forbidden.

Local unique cases: 28 in `scripts/world-region.test.mjs`. Previous r6.30
expected 1,393 + 28 = 1,421. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
