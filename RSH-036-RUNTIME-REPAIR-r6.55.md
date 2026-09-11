# RSH-036 r6.55 — leftover gray cubemap vs IBL-off is not PMREM size vs CubeUV lod vs ground envMapIntensity

Candidate, 11 September 2026. Base 418f384
(r6.54 mgmt isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.54 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-65: leftover gray cubemap vs IBL-off is not PMREM size vs CubeUV lod vs ground envMapIntensity

r6.54 proved leftover fromScene of Color 0x808080 vs off occupies B −18.5/−20.2
and ColorManagement vs outputColorSpace vs toneMapping during bake are not
remaining day-bottom drivers. The new probe isolates PMREM fromScene size 16 vs
CubeUV lod (ground roughness 0) vs ground envMapIntensity 0 on a 0x808080
fromScene independently of ColorManagement vs outputColorSpace vs toneMapping vs
0x3a9ae0 hue vs intensity vs fill after setNight/snapCamera(true) at threshold
0.12 without changing product color or exposure. size/lod/env deltas use the
0x808080 hue buffer as baseline. Mgmt-only reports, luma-terms-include-hemi,
size-is-combined, size-clears-off, size-clears-hue, lod-clears-size,
hue-clears-off, intensity-clears-ibl, size-deltas-use-product-baseline,
PMREM-size-stays-256, ground-roughness-stays-product,
ground-envMapIntensity-stays-product, ColorManagement-disabled,
outputColorSpace-left-sRGB, toneMapping-left-ACES, PNG refresh, color retune and
treating this probe as original-golden fail closed. Smoke keeps
`verifyWorldLayers` through `verifyWorldMgmt` and `verifyWorldLod`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all false, size 1 / lod 1 / env 1 / hue 1 / intensity 1 /
fill 1):

| pose | band | dominantLod | size B Δ | lod B Δ | env B Δ | hue B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | intensity | **+0.2** | +1.6 | **+0.2** | −30.2 | −28.0 |
| g05 | bottom | intensity | **+0.3** | +1.6 | **+0.3** | −32.8 | −31.1 |
| g07 | upper | lod | +8.0 | +8.5 | +8.0 | −24.4 | −2.8 |
| g08 | bottom | intensity | **0.0** | +4.9 | **0.0** | −21.2 | −11.5 |

Day-bottom leftover fromScene 0x808080 vs off occupies B −18.5/−20.2. size ≡
env ≡ gray cubemap (ΔB +0.2/+0.3). CubeUV lod (ground roughness 0) slightly
brightens vs gray (B +1.6/+1.6) rather than occupying leftover. Leftover is not
PMREM size versus CubeUV lod versus ground envMapIntensity. Ground
envMapIntensity 0 on gray does not occupy leftover, so the remaining gray IBL
is not the terrain ground plane. Intensity occupies luma. Fill joins intensity
on g08 night (−12.4). g08 night size ≡ env ≡ gray because setNight does not
rebake. g07 upper remains ramps. Camera stays 7.4/1.92. PNG refresh and
color/exposure retune remain forbidden.

Local unique cases: 28 in `scripts/world-lod.test.mjs`. Previous r6.54
expected 2,065 + 28 = 2,093. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
