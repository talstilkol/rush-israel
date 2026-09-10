# RSH-036 r6.35 — extras are not ground-plane / daylight / envmap material attribution

Candidate, 10 September 2026. Base bf1263229bec63879e5b691ec19dc645114fe73b
(r6.34 extra isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.34 exact-head CI was in progress at preparation and is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-45: extras are not ground-plane / daylight / envmap material attribution

r6.34 reported hero/road/blob/fx/unclassified all have bandDelta 0 on the
dominant band. Remaining 0/4 is not a scene extra. The new probe isolates
ground-plane map/color, daylight lights/fog/background and envmap *after*
setNight/snapCamera(true), then pixelmatches the dominant 200px band at
threshold 0.12. Extra-only reports, missing dominantMaterial, PNG refresh and
treating this probe as original-golden fail closed. Smoke keeps
`verifyWorldLayers`, `verifyWorldResidual`, `verifyWorldMismatch`,
`verifyWorldBias`, `verifyWorldScene`, `verifyWorldRegion`,
`verifyWorldColumn`, `verifyWorldSlice`, `verifyWorldExtra` and
`verifyWorldMaterial`.

Live present materials of the dominant band after rest chase 7.4/1.92
(ground 1, daylight 7, envmap 1747):

| pose | presentPct | band | groundΔ | daylightΔ | envmapΔ | contributingMaterial |
|---|---:|---|---:|---:|---:|---|
| g01 | 0.6926 | bottom | −0.7760 | −0.7552 | +0.0036 | ground, daylight |
| g05 | 0.5940 | bottom | −0.8503 | −0.4300 | +0.0017 | ground, daylight |
| g07 | 0.2933 | upper | +0.0016 | +0.0023 | −0.0630 | envmap |
| g08 | 0.7016 | bottom | −0.8780 | −0.8781 | −0.1932 | ground, daylight, envmap |

g01/g05/g08 bottom is the ground-plane appearance and daylight lighting
co-occupying the same pixels. Envmap is not the day-bottom driver. g07 upper
remains ramps (r6.33) with a modest envmap contribution. Camera stays
7.4/1.92. PNG refresh remains forbidden.

Local unique cases: 28 in `scripts/world-material.test.mjs`. Previous r6.34
expected 1,505 + 28 = 1,533. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
