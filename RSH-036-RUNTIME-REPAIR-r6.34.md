# RSH-036 r6.34 — named residual slice is not hero-car or road-shader attribution

Candidate, 10 September 2026. Base 03173adbb23c6bfd08f261d4160b935ff1dea122
(r6.33 slice isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.33 exact-head CI was in progress at preparation and is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-44: named residual slice is not hero-car or road-shader attribution

r6.33 reported g01/g05/g08 bottom is not a named residual layer (no hide reduces
85–88%; hiding ground makes it worse) and g07 upper is ramps (−18.85 points).
Hero-car visuals live on `engine.scene`, not `world.group`, so the residual
slice never hid them. The new probe hides hero, road-shader (`userData.lanes` /
`rush-road`), blob, fx and remaining scene extras, then pixelmatches the
dominant 200px band at threshold 0.12. Slice-only reports, missing
dominantExtra, PNG refresh and treating this probe as original-golden fail
closed. Smoke keeps `verifyWorldLayers`, `verifyWorldResidual`,
`verifyWorldMismatch`, `verifyWorldBias`, `verifyWorldScene`,
`verifyWorldRegion`, `verifyWorldColumn`, `verifyWorldSlice` and
`verifyWorldExtra`.

Live present extras of the dominant band after rest chase 7.4/1.92 (hero 106,
road 2, blob 4, fx 5, unclassified 813):

| pose | presentPct | band | heroΔ | roadΔ | blobΔ | fxΔ | unclassifiedΔ | contributingExtra |
|---|---:|---|---:|---:|---:|---:|---:|---|
| g01 | 0.6926 | bottom | 0 | 0 | 0 | 0 | 0 | none |
| g05 | 0.5940 | bottom | 0 | 0 | 0 | 0 | 0 | none |
| g07 | 0.2933 | upper | 0 | 0 | 0 | 0 | 0 | none |
| g08 | 0.7016 | bottom | 0 | 0 | 0 | 0 | 0 | none |

Hero-car, road-shader and scene extras do not occupy the remaining 0/4 in the
dominant band. Combined with r6.33, g01/g05/g08 bottom is the ground-plane
appearance (hiding ground still increases mismatch) and g07 upper remains
ramps. Camera stays 7.4/1.92. PNG refresh remains forbidden.

Local unique cases: 28 in `scripts/world-extra.test.mjs`. Previous r6.33
expected 1,477 + 28 = 1,505. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
