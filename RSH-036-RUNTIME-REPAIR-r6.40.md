# RSH-036 r6.40 — combined unlit luma / envmap B is not dir/fill/ambient vs environment/envIntensity

Candidate, 10 September 2026. Base b19739b8a995f80a2ae85c27fbc242181585c0b1
(r6.39 tone isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.39 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-50: combined unlit luma / envmap B is not dir/fill/ambient vs environment/envIntensity

r6.39 proved unlit-excluding-hemi luma and envmap+hemi B occupy g01/g05/g08
bottom independently, but unlit was four lights and envmap mixed
scene.environment with envMapIntensity. The new probe isolates dir (sun+near)
vs fill vs ambient vs scene.environment vs envMapIntensity after
setNight/snapCamera(true) at threshold 0.12 without changing product color or
exposure. Tone-only reports, luma-terms-include-hemi, environment-clears-intensity,
envIntensity-clears-environment, PNG refresh, color retune and treating this
probe as original-golden fail closed. Smoke keeps `verifyWorldLayers` through
`verifyWorldTone` and `verifyWorldTerm`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
lumaTermsIncludeHemi false, environmentClearsIntensity false,
envIntensityClearsEnvironment false, dir 2 / fill 1 / ambient 1 / environment 1
/ envIntensity 56):

| pose | band | term | dir luma Δ | fill luma Δ | ambient luma Δ | environment B Δ | envIntensity B Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | environment | −28.0 | −3.4 | −3.8 | −48.7 | 0 |
| g05 | bottom | environment | −31.1 | −3.8 | −4.3 | −53.0 | 0 |
| g07 | upper | envIntensity | −2.8 | −0.4 | −1.8 | −40.9 | 0 |
| g08 | bottom | environment | −11.5 | −12.4 | −2.3 | −33.9 | 0 |

Dir occupies day-bottom luma. Fill joins dir on g08 night. Ambient is residual.
scene.environment is the entire r6.39 envmap blue term; envMapIntensity is 0.
g07 upper remains ramps (no contributing L2). Camera stays 7.4/1.92. PNG refresh
and color/exposure retune remain forbidden.

Local unique cases: 28 in `scripts/world-term.test.mjs`. Previous r6.39 expected
1,645 + 28 = 1,673. Pixel 0/4, immutable CDN bytes, rendering performance and
freeze remain open.
