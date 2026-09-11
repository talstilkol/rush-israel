# RSH-036 r6.50 — combined leftover gray IBL is not bare 0x808080 vs hemi vs disc

Candidate, 11 September 2026. Base 9f20bc3d0f40bf1bc67837589f888ada363cd51c
(r6.49 gray isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.49 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-60: combined leftover gray IBL is not bare 0x808080 background vs baked hemi vs baked disc

r6.49 proved leftover gray cubemap vs IBL-off occupies B −18.5/−20.2, independently
of 0x3a9ae0 hue. The new probe isolates 0x808080 background vs baked hemi vs baked
disc inside the gray PMREM independently of IBL-off vs product hue vs intensity vs
fill after setNight/snapCamera(true) at threshold 0.12 without changing product
color or exposure. Background/hemi/disc/gray deltas use the 0x808080 hue buffer as
baseline, not product present. Gray-only reports, luma-terms-include-hemi,
background-is-combined, background-clears-gray, background-clears-hue,
hemi-clears-background, hue-clears-gray, intensity-clears-ibl,
background-deltas-use-product-baseline, PNG refresh, color retune and treating this
probe as original-golden fail closed. Smoke keeps `verifyWorldLayers` through
`verifyWorldGray` and `verifyWorldBare`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all false, background 1 / hemi 1 / disc 1 / gray 1 / hue 1 /
intensity 1 / fill 1):

| pose | band | bare | background B Δ | hemi B Δ | disc B Δ | gray B Δ | hue B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|---:|---:|
| g01 | bottom | intensity | −17.6 | −0.1 | +0.2 | −18.5 | −30.2 | −28.0 |
| g05 | bottom | intensity | −19.3 | −0.1 | +0.3 | −20.2 | −32.8 | −31.1 |
| g07 | upper | disc | −15.3 | −1.0 | +8.0 | −16.6 | −24.4 | −2.8 |
| g08 | bottom | background | −12.6 | 0.0 | 0.0 | −12.6 | −21.2 | −11.5 |

Day-bottom leftover gray IBL vs off occupies B −18.5/−20.2, of which bare
0x808080 background occupies B −17.6/−19.3. Hemi and disc inside the gray PMREM
are 0. IBL-off vs omit-background leftover is below threshold (~0.9). Intensity
occupies luma. Fill joins intensity on g08 night (−12.4). g08 night background ≡
gray because setNight does not rebake. g07 upper remains ramps. Camera stays
7.4/1.92. PNG refresh and color/exposure retune remain forbidden.

Local unique cases: 28 in `scripts/world-bare.test.mjs`. Previous r6.49
expected 1,925 + 28 = 1,953. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
