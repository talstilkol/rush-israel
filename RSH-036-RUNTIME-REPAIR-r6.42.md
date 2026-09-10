# RSH-036 r6.42 — combined sun luma is not color vs intensity

Candidate, 10 September 2026. Base 60c25ba1d3e9901c65c4d1f0de0b4d78320cb992
(r6.41 beam isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.41 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-52: combined sun luma is not color vs intensity

r6.41 proved sun luma plus scene.environment B occupy g01/g05/g08 bottom, but
sun is color plus intensity. The new probe isolates intensity vs color
(white-out 0xffffff, intensity held) vs fill vs scene.environment after
setNight/snapCamera(true) at threshold 0.12 without changing product color or
exposure. Beam-only reports, luma-terms-include-hemi, sun-is-combined,
color-clears-intensity, intensity-clears-color, PNG refresh, color retune and
treating this probe as original-golden fail closed. Smoke keeps
`verifyWorldLayers` through `verifyWorldBeam` and `verifyWorldRay`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
lumaTermsIncludeHemi false, sunIsCombined false, colorClearsIntensity false,
intensityClearsColor false, intensity 1 / color 1 / fill 1 / environment 1):

| pose | band | ray | intensity luma Δ | color luma Δ | fill luma Δ | environment B Δ |
|---|---|---|---:|---:|---:|---:|
| g01 | bottom | environment | −28.0 | +2.4 | −3.4 | −48.7 |
| g05 | bottom | environment | −31.1 | +2.6 | −3.8 | −53.0 |
| g07 | upper | color | −2.8 | +0.2 | −0.4 | −40.9 |
| g08 | bottom | environment | −11.5 | +6.6 | −12.4 | −33.9 |

Sun intensity occupies the entire r6.41 sun luma. Sun color white-out is not a
remaining driver (colorAxis empty; L2 +5.2/+5.5/+10.2). Fill joins intensity
on g08 night. scene.environment remains the blue term. g07 upper remains
ramps (no contributing L2). Camera stays 7.4/1.92. PNG refresh and
color/exposure retune remain forbidden.

Local unique cases: 28 in `scripts/world-ray.test.mjs`. Previous r6.41 expected
1,701 + 28 = 1,729. Pixel 0/4, immutable CDN bytes, rendering performance and
freeze remain open.
