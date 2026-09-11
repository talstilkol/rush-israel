# RSH-036 r6.54 — leftover sRGB fromScene vs linear bake is not ColorManagement vs outputColorSpace vs toneMapping

Candidate, 11 September 2026. Base 09a3a06
(r6.53 sigma isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.53 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-64: leftover sRGB fromScene vs linear bake is not ColorManagement vs outputColorSpace vs toneMapping

r6.53 proved leftover fromScene of Color 0x808080 vs off occupies B −18.5/−20.2
and convertSRGBToLinear occupies B −14.9/−16.3 of that leftover. The new probe
isolates ColorManagement.enabled=false vs outputColorSpace=LinearSRGBColorSpace
vs toneMapping=NoToneMapping during fromScene of Color 0x808080 independently of
0x3a9ae0 hue vs intensity vs fill after setNight/snapCamera(true) at threshold
0.12 without changing product color or exposure. mgmt/encode/tone deltas use the
0x808080 hue buffer as baseline. Sigma-only reports, luma-terms-include-hemi,
mgmt-is-combined, mgmt-clears-off, mgmt-clears-hue, encode-clears-mgmt,
hue-clears-off, intensity-clears-ibl, mgmt-deltas-use-product-baseline,
ColorManagement-stays-enabled, outputColorSpace-stays-sRGB, toneMapping-stays-ACES,
PNG refresh, color retune and treating this probe as original-golden fail closed.
Smoke keeps `verifyWorldLayers` through `verifyWorldSigma` and `verifyWorldMgmt`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all false, mgmt 1 / encode 1 / tone 1 / hue 1 / intensity 1 /
fill 1):

| pose | band | mgmt | mgmt B Δ | encode B Δ | tone B Δ | hue B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | intensity | **+20.4** | +0.2 | +0.2 | −30.2 | −28.0 |
| g05 | bottom | intensity | **+22.2** | +0.3 | +0.3 | −32.8 | −31.1 |
| g07 | upper | mgmt | +32.5 | +8.0 | +8.0 | −24.4 | −2.8 |
| g08 | bottom | intensity | **+13.6** | 0.0 | 0.0 | −21.2 | −11.5 |

Day-bottom leftover fromScene 0x808080 vs off occupies B −18.5/−20.2. encode ≡
tone ≡ gray cubemap (ΔB +0.2/+0.3). ColorManagement.enabled=false brightens vs
gray (B +20.4/+22.2) rather than occupying leftover. Leftover is not
ColorManagement versus outputColorSpace versus toneMapping during bake.
Intensity occupies luma. Fill joins intensity on g08 night (−12.4). g08 night
encode ≡ gray because setNight does not rebake. g07 upper remains ramps. Camera
stays 7.4/1.92. PNG refresh and color/exposure retune remain forbidden.

Local unique cases: 28 in `scripts/world-mgmt.test.mjs`. Previous r6.53
expected 2,037 + 28 = 2,065. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
