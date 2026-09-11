# RSH-036 r6.49 — combined leftover IBL is not gray cubemap vs IBL-off

Candidate, 11 September 2026. Base 8650f45c85ed81d499716f347341b8b6536f47ce
(r6.48 sky isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.48 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-59: combined leftover IBL is not gray cubemap vs IBL-off

r6.48 proved 0x3a9ae0 vs 0x808080 occupies B −30.2/−32.8, but leftover gray IBL
vs off was inferred from omit-background minus hue. The new probe isolates gray
cubemap vs IBL-off independently of 0x3a9ae0 hue vs hemi vs disc vs intensity vs
fill after setNight/snapCamera(true) at threshold 0.12 without changing product
color or exposure. Gray deltas use the 0x808080 hue buffer as baseline, not
product present. Sky-only reports, luma-terms-include-hemi, gray-is-combined,
gray-clears-hue, gray-clears-intensity, hue-clears-gray, intensity-clears-ibl,
gray-deltas-use-product-baseline, PNG refresh, color retune and treating this
probe as original-golden fail closed. Smoke keeps `verifyWorldLayers` through
`verifyWorldSky` and `verifyWorldGray`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all false, gray 1 / hue 1 / hemi 1 / disc 1 / intensity 1 /
fill 1):

| pose | band | gray | gray B Δ | hue B Δ | hemi B Δ | disc B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | intensity | −18.5 | −30.2 | −0.1 | +1.7 | −28.0 |
| g05 | bottom | intensity | −20.2 | −32.8 | −0.1 | +1.8 | −31.1 |
| g07 | upper | disc | −16.6 | −24.4 | −1.0 | +21.2 | −2.8 |
| g08 | bottom | disc | −12.6 | −21.2 | −32.1 | −32.1 | −11.5 |

Day-bottom leftover gray IBL vs off occupies B −18.5/−20.2, independently of
0x3a9ae0 hue B −30.2/−32.8. Additive gray+hue equals r6.45 IBL-off
(−48.7/−53.0). Hemi and disc are 0. Intensity occupies luma. Fill joins
intensity on g08 night (−12.4). g08 night variants occupy leftover because
setNight does not rebake. g07 upper remains ramps. Camera stays 7.4/1.92. PNG
refresh and color/exposure retune remain forbidden.

Local unique cases: 28 in `scripts/world-gray.test.mjs`. Previous r6.48
expected 1,897 + 28 = 1,925. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
