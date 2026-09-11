# RSH-036 r6.51 — combined leftover 0x808080 IBL is not PMREM vs constant cubemap

Candidate, 11 September 2026. Base 59984fc
(r6.50 bare isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.50 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-61: combined leftover 0x808080 background IBL is not PMREM convolution vs a constant gray cubemap

r6.50 proved leftover gray IBL vs off occupies B −18.5/−20.2, of which bare
0x808080 background occupies B −17.6/−19.3; hemi and disc inside the gray PMREM
are 0. The new probe isolates 0x808080 background-only PMREM vs a constant
0x808080 CubeTexture vs IBL-off independently of 0x3a9ae0 hue vs intensity vs
fill after setNight/snapCamera(true) at threshold 0.12 without changing product
color or exposure. pmrem/flat/off deltas use the 0x808080 hue buffer as
baseline, not product present. Bare-only reports, luma-terms-include-hemi,
pmrem-is-combined, pmrem-clears-off, pmrem-clears-hue, flat-clears-pmrem,
hue-clears-off, intensity-clears-ibl, pmrem-deltas-use-product-baseline, PNG
refresh, color retune and treating this probe as original-golden fail closed.
Smoke keeps `verifyWorldLayers` through `verifyWorldBare` and `verifyWorldFlat`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all false, pmrem 1 / flat 1 / off 1 / hue 1 / intensity 1 /
fill 1):

| pose | band | flat | pmrem B Δ | flat B Δ | off B Δ | hue B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | intensity | +0.2 | **−18.5** | **−18.5** | −30.2 | −28.0 |
| g05 | bottom | intensity | +0.3 | **−20.2** | **−20.2** | −32.8 | −31.1 |
| g07 | upper | pmrem | +8.0 | −16.6 | −16.6 | −24.4 | −2.8 |
| g08 | bottom | flat | 0.0 | **−12.6** | **−12.6** | −21.2 | −11.5 |

Day-bottom leftover 0x808080 IBL vs off occupies B −18.5/−20.2. PMREM of
0x808080 ≡ gray cubemap (ΔB +0.2/+0.3). A constant 0x808080 CubeTexture ≡
IBL-off. Leftover is specifically a PMREM-filtered gray environment versus none,
not an unfiltered cubemap. Intensity occupies luma. Fill joins intensity on g08
night (−12.4). g08 night pmrem ≡ gray because setNight does not rebake. g07
upper remains ramps. Camera stays 7.4/1.92. PNG refresh and color/exposure
retune remain forbidden.

Local unique cases: 28 in `scripts/world-flat.test.mjs`. Previous r6.50
expected 1,953 + 28 = 1,981. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
