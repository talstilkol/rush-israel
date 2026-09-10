# RSH-036 r6.32 — dominant 200px band is not lateral-column mismatch

Candidate, 10 September 2026. Base 50c30af3493d3eefd98ba062259b0fea76741d07
(r6.31 region-band isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.31 exact-head CI was in progress at preparation and is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-42: dominant 200px band is not lateral-column attribution

r6.31 reported bottom-heavy mismatch on g01/g05/g08 (85–88%) and an upper-band
peak on g07 (60%). A 200px band is not where the locked PNG diverges laterally.
The new probe splits the dominant band into four 320×200 columns (left,
midLeft, midRight, right) and pixelmatches each at threshold 0.12. Band-only
reports, missing dominantColumn, PNG refresh and treating this probe as
original-golden fail closed. Smoke keeps `verifyWorldLayers`,
`verifyWorldResidual`, `verifyWorldMismatch`, `verifyWorldBias`,
`verifyWorldScene`, `verifyWorldRegion` and `verifyWorldColumn`.

Live present columns of the dominant band after rest chase 7.4/1.92:

| pose | presentPct | band | left | midLeft | midRight | right | dominantColumn |
|---|---:|---|---:|---:|---:|---:|---|
| g01 | 0.6926 | bottom | 0.9190 | 0.8530 | 0.8312 | 0.8554 | left |
| g05 | 0.5940 | bottom | 0.8430 | 0.8633 | 0.8473 | 0.8592 | midLeft |
| g07 | 0.2933 | upper | 0.7862 | 0.4179 | 0.4262 | 0.7878 | right |
| g08 | 0.7016 | bottom | 0.8620 | 0.8928 | 0.8799 | 0.8881 | midLeft |

The bottom-heavy frames are full-width (83–92%), so the chase car in the centre
is not the remaining 0/4 driver. g07 is the inverse laterally as well as
vertically: upper-band sides 79% while the centre is 42%. Camera stays 7.4/1.92.
PNG refresh remains forbidden.

Local unique cases: 28 in `scripts/world-column.test.mjs`. Previous r6.31
expected 1,421 + 28 = 1,449. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
