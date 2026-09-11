# RSH-036 r6.52 — leftover PMREM-filtered 0x808080 is not fromScene vs fromCubemap vs gain

Candidate, 11 September 2026. Base 25f2843
(r6.51 flat isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.51 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-62: leftover PMREM-filtered 0x808080 is not fromScene vs fromCubemap vs environmentIntensity

r6.51 proved leftover 0x808080 IBL vs off occupies B −18.5/−20.2, of which
background-only PMREM ≡ gray cubemap and a constant CubeTexture ≡ IBL-off. The
new probe isolates fromScene of 0x808080 vs fromCubemap of the same gray vs
environmentIntensity=0 independently of 0x3a9ae0 hue vs intensity vs fill after
setNight/snapCamera(true) at threshold 0.12 without changing product color or
exposure. scene/cube/gain deltas use the 0x808080 hue buffer as baseline.
Flat-only reports, luma-terms-include-hemi, scene-is-combined, scene-clears-off,
scene-clears-hue, cube-clears-scene, hue-clears-off, intensity-clears-ibl,
scene-deltas-use-product-baseline, PNG refresh, color retune and treating this
probe as original-golden fail closed. Smoke keeps `verifyWorldLayers` through
`verifyWorldFlat` and `verifyWorldConv`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all false, scene 1 / cube 1 / gain 1 / hue 1 / intensity 1 /
fill 1):

| pose | band | conv | scene B Δ | cube B Δ | gain B Δ | hue B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | intensity | +0.2 | **−18.5** | **−18.5** | −30.2 | −28.0 |
| g05 | bottom | intensity | +0.3 | **−20.2** | **−20.2** | −32.8 | −31.1 |
| g07 | upper | scene | +8.0 | −16.6 | −16.6 | −24.4 | −2.8 |
| g08 | bottom | cube | 0.0 | **−12.6** | **−12.6** | −21.2 | −11.5 |

Day-bottom leftover PMREM-filtered 0x808080 vs off occupies B −18.5/−20.2.
fromScene of Color `0x808080` ≡ gray cubemap (ΔB +0.2/+0.3). fromCubemap of a
constant 0x808080 CubeTexture ≡ environmentIntensity=0 ≡ IBL-off. Leftover is
specifically fromScene of a gray Color background, not fromCubemap and not
environmentIntensity. Intensity occupies luma. Fill joins intensity on g08 night
(−12.4). g08 night scene ≡ gray because setNight does not rebake. g07 upper
remains ramps. Camera stays 7.4/1.92. PNG refresh and color/exposure retune
remain forbidden.

Local unique cases: 28 in `scripts/world-conv.test.mjs`. Previous r6.51
expected 1,981 + 28 = 2,009. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
