# RSH-036 r6.44 — combined scene.environment blue is not texture vs environmentIntensity

Candidate, 10 September 2026. Base 27b011439da4b03d0c188a3b2e89955cd624c073
(r6.43 ibl isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.43 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-54: combined scene.environment blue is not texture vs environmentIntensity

r6.43 proved scene.environment occupies the remaining blue term, but the
texture was mixed with scene.environmentIntensity. The new probe isolates
those two IBL axes independently of intensity vs fill after
setNight/snapCamera(true) at threshold 0.12 without changing product color or
exposure. IBL-only reports, luma-terms-include-hemi, texture-is-combined,
gain-clears-texture, texture-clears-gain, intensity-clears-texture,
texture-clears-intensity, PNG refresh, color retune and treating this probe as
original-golden fail closed. Smoke keeps `verifyWorldLayers` through
`verifyWorldIbl` and `verifyWorldGain`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
lumaTermsIncludeHemi false, textureIsCombined false, gainClearsTexture false,
textureClearsGain false, intensityClearsTexture false, textureClearsIntensity
false, texture 1 / gain 1 / intensity 1 / fill 1):

| pose | band | gain | texture B Δ | gain B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|
| g01 | bottom | gain | −48.7 | −48.7 | −28.0 |
| g05 | bottom | gain | −53.0 | −53.0 | −31.1 |
| g07 | upper | fill | −40.9 | −40.9 | −2.8 |
| g08 | bottom | gain | −33.9 | −33.9 | −11.5 |

Nulling `scene.environment` and zeroing `scene.environmentIntensity` occupy
the same remaining IBL term (identical L2/luma/B on every pose). Neither is an
extra independent driver. Intensity occupies luma. Fill joins intensity on g08
night (−12.4). g07 upper remains ramps (no contributing L2). Camera stays
7.4/1.92. PNG refresh and color/exposure retune remain forbidden.

Local unique cases: 28 in `scripts/world-gain.test.mjs`. Previous r6.43
expected 1,757 + 28 = 1,785. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
