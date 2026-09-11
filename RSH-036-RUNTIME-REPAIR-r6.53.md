# RSH-036 r6.53 — leftover fromScene 0x808080 is not sigma vs mesh sky vs bake color space

Candidate, 11 September 2026. Base e30abdf
(r6.52 conv isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.52 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-63: leftover fromScene 0x808080 is not sigma vs mesh sky vs bake color space

r6.52 proved leftover PMREM-filtered 0x808080 vs off occupies B −18.5/−20.2 and
is specifically fromScene of a gray Color, not fromCubemap and not
environmentIntensity. The new probe isolates fromScene sigma 0 vs a BackSide
mesh sky vs convertSRGBToLinear Color independently of 0x3a9ae0 hue vs
intensity vs fill after setNight/snapCamera(true) at threshold 0.12 without
changing product color or exposure. sigma/mesh/space deltas use the 0x808080
hue buffer as baseline. Conv-only reports, luma-terms-include-hemi,
sigma-is-combined, sigma-clears-off, sigma-clears-hue, mesh-clears-sigma,
hue-clears-off, intensity-clears-ibl, sigma-deltas-use-product-baseline, PNG
refresh, color retune and treating this probe as original-golden fail closed.
Smoke keeps `verifyWorldLayers` through `verifyWorldConv` and `verifyWorldSigma`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all false, sigma 1 / mesh 1 / space 1 / hue 1 / intensity 1 /
fill 1):

| pose | band | sigma | sigma B Δ | mesh B Δ | space B Δ | hue B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | intensity | +0.2 | +0.2 | **−14.9** | −30.2 | −28.0 |
| g05 | bottom | intensity | +0.3 | +0.3 | **−16.3** | −32.8 | −31.1 |
| g07 | upper | sigma | +8.0 | +8.0 | −12.8 | −24.4 | −2.8 |
| g08 | bottom | space | 0.0 | 0.0 | **−10.7** | −21.2 | −11.5 |

Day-bottom leftover fromScene 0x808080 vs off occupies B −18.5/−20.2. sigma 0
≡ mesh sky ≡ gray cubemap (ΔB +0.2/+0.3). convertSRGBToLinear occupies B
−14.9/−16.3 of that leftover. Leftover is specifically sRGB Color fromScene
versus a linear bake, not blur and not a mesh vs Color background. Intensity
occupies luma. Fill joins intensity on g08 night (−12.4). g08 night sigma ≡
gray because setNight does not rebake. g07 upper remains ramps. Camera stays
7.4/1.92. PNG refresh and color/exposure retune remain forbidden.

Local unique cases: 28 in `scripts/world-sigma.test.mjs`. Previous r6.52
expected 2,009 + 28 = 2,037. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
