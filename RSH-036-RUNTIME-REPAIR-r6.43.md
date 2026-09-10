# RSH-036 r6.43 — combined scene.environment blue is not background vs sky vs envMap

Candidate, 10 September 2026. Base e5dc3ba4b08e783e1530a6ddadd259fa951d4522
(r6.42 ray isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.42 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-53: combined scene.environment blue is not background vs sky vs envMap

r6.42 proved sun intensity luma plus scene.environment B occupy g01/g05/g08
bottom, but environment was mixed with background, Sky and material envMap.
The new probe isolates those four IBL axes independently of intensity vs fill
after setNight/snapCamera(true) at threshold 0.12 without changing product
color or exposure. Ray-only reports, luma-terms-include-hemi, ibl-is-combined,
envMap-clears-environment, background-clears-environment,
intensity-clears-environment, environment-clears-intensity, PNG refresh, color
retune and treating this probe as original-golden fail closed. Smoke keeps
`verifyWorldLayers` through `verifyWorldRay` and `verifyWorldIbl`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
lumaTermsIncludeHemi false, iblIsCombined false, envMapClearsEnvironment false,
backgroundClearsEnvironment false, intensityClearsEnvironment false,
environmentClearsIntensity false, environment 1 / background 1 / sky 1 /
envMap 316 / intensity 1 / fill 1):

| pose | band | ibl | environment B Δ | background B Δ | sky B Δ | envMap B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | environment | −48.7 | 0 | 0 | 0 | −28.0 |
| g05 | bottom | environment | −53.0 | 0 | 0 | 0 | −31.1 |
| g07 | upper | background | −40.9 | 0 | 0 | 0 | −2.8 |
| g08 | bottom | environment | −33.9 | 0 | 0 | 0 | −11.5 |

scene.environment occupies the entire r6.42 environment blue term. Background,
Sky and material envMap are 0 on every pose. Intensity occupies luma. Fill
joins intensity on g08 night (−12.4). g07 upper remains ramps (no contributing
L2). Camera stays 7.4/1.92. PNG refresh and color/exposure retune remain
forbidden.

Local unique cases: 28 in `scripts/world-ibl.test.mjs`. Previous r6.42 expected
1,729 + 28 = 1,757. Pixel 0/4, immutable CDN bytes, rendering performance and
freeze remain open.
