# RSH-036 r6.39 — shade L2 is not independent brightness vs blue

Candidate, 10 September 2026. Base f30a7dd0ca0d611b7016e6b99058849eb9383915
(r6.38 shade isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.38 exact-head CI was in progress at preparation and is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-49: shade L2 is not independent brightness vs blue

r6.38 isolated grade/fog/hemi/exposure/envmap/unlit one at a time. `unlit()`
zeroed HemisphereLight, so unlit L2 included hemi blue. Combined brightness
and combined blue axes were absent. The new probe isolates exposure vs
unlit-excluding-hemi vs hemi vs envmap, and combined brightness
(exposure+unlit) vs combined blue (envmap+hemi), after setNight/snapCamera(true)
at threshold 0.12 without changing product color or exposure. Shade-only
reports, unlit-includes-hemi, missing combined axes, PNG refresh, color
retune and treating this probe as original-golden fail closed. Smoke keeps
`verifyWorldLayers` through `verifyWorldShade` and `verifyWorldTone`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
unlitIncludesHemi false, unlit count 4):

| pose | band | tone | brightness luma Δ | unlit luma Δ | blue B Δ | envmap B Δ | hemi B Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | blue | −99.9 | −38.7 | −70.6 | −48.7 | −12.5 |
| g05 | bottom | brightness | −99.5 | −43.2 | −77.8 | −53.0 | −13.8 |
| g07 | upper | hemi | −57.7 | −5.4 | −45.2 | −40.9 | −2.4 |
| g08 | bottom | brightness | −51.8 | −28.6 | −45.5 | −33.9 | −9.1 |

Brightness and blue both occupy g01/g05/g08 bottom independently. Combined
blue with exposure held drops B far more than luma. Envmap is the larger blue
term; hemi is the residual sky lift. Unlit-excluding-hemi is a luma term, not
the r6.38 unlit-including-hemi mix. Exposure=0 still blacks the buffer, so it
is not an independent blue isolation. g07 upper remains ramps (no contributing
L2 tone). Camera stays 7.4/1.92. PNG refresh and color/exposure retune remain
forbidden.

Local unique cases: 28 in `scripts/world-tone.test.mjs`. Previous r6.38 expected
1,617 + 28 = 1,645. Pixel 0/4, immutable CDN bytes, rendering performance and
freeze remain open.
