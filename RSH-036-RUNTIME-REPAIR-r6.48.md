# RSH-036 r6.48 — combined bakeEnv background is not 0x3a9ae0 vs 0x808080

Candidate, 11 September 2026. Base 8d72cadf12105e9a56e0f76612b3b4b8c0cbdeaf
(r6.47 bake isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.47 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-58: combined bakeEnv background is not 0x3a9ae0 vs 0x808080

r6.47 proved day-bottom IBL is bakeEnv background, but omitting that background
mixed the 0x3a9ae0 hue with IBL-off. The new probe isolates 0x3a9ae0 vs a
0x808080 background independently of hemi vs disc vs intensity vs fill after
setNight/snapCamera(true) at threshold 0.12 without changing product color or
exposure. Bake-only reports, luma-terms-include-hemi, sky-is-combined,
sky-clears-gain, sky-clears-intensity, hemi-clears-intensity,
intensity-clears-ibl, PNG refresh, color retune and treating this probe as
original-golden fail closed. Smoke keeps `verifyWorldLayers` through
`verifyWorldBake` and `verifyWorldSky`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all false, sky 1 / hemi 1 / disc 1 / intensity 1 / fill 1):

| pose | band | sky | sky B Δ | hemi B Δ | disc B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|
| g01 | bottom | intensity | −30.2 | −0.1 | +1.7 | −28.0 |
| g05 | bottom | intensity | −32.8 | −0.1 | +1.8 | −31.1 |
| g07 | upper | disc | −24.4 | −1.0 | +21.2 | −2.8 |
| g08 | bottom | disc | −21.2 | −32.1 | −32.1 | −11.5 |

Day-bottom 0x3a9ae0 vs 0x808080 occupies B −30.2/−32.8, matching r6.45
product-vs-gray cubemap. r6.47 omit-background occupies more (B −47.8/−52.0),
so gray IBL still leaves a residual vs off. Hemi and disc are 0. Intensity
occupies luma. Fill joins intensity on g08 night (−12.4). g08 night variants
all occupy leftover because setNight does not rebake. g07 upper remains ramps.
Camera stays 7.4/1.92. PNG refresh and color/exposure retune remain forbidden.

Local unique cases: 28 in `scripts/world-sky.test.mjs`. Previous r6.47
expected 1,869 + 28 = 1,897. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
