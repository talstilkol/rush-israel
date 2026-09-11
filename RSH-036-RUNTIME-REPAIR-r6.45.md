# RSH-036 r6.45 — combined IBL is not product cubemap content vs gray

Candidate, 11 September 2026. Base 72eec87ba03d026a647ad42b369381aefee3e2ae
(r6.44 gain isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.44 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-55: combined IBL is not product cubemap content vs a neutral gray cubemap

r6.44 proved texture ≡ environmentIntensity occupy the remaining IBL term, but
the product cubemap content was mixed with IBL-on. The new probe isolates
product cubemap vs a 0x808080 PMREM independently of IBL-off and of intensity
vs fill after setNight/snapCamera(true) at threshold 0.12 without changing
product color or exposure. Gain-only reports, luma-terms-include-hemi,
content-is-combined, content-clears-gain, content-clears-intensity,
ibl-clears-intensity, intensity-clears-ibl, PNG refresh, color retune and
treating this probe as original-golden fail closed. Smoke keeps
`verifyWorldLayers` through `verifyWorldGain` and `verifyWorldCube`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all false, content 1 / ibl 1 / gray 1 / intensity 1 /
fill 1):

| pose | band | cube | content B Δ | ibl-off B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|
| g01 | bottom | ibl | −30.0 | −48.7 | −28.0 |
| g05 | bottom | ibl | −32.5 | −53.0 | −31.1 |
| g07 | upper | fill | −16.4 | −40.9 | −2.8 |
| g08 | bottom | ibl | −21.2 | −33.9 | −11.5 |

IBL-off occupies more of the remaining term than product-vs-gray content.
Product cubemap is too blue vs 0x808080, but gray IBL still leaves a residual
vs off. Content luma is small. Intensity occupies luma. Fill joins intensity
on g08 night (−12.4). g07 upper remains ramps. Camera stays 7.4/1.92. PNG
refresh and color/exposure retune remain forbidden.

Local unique cases: 28 in `scripts/world-cube.test.mjs`. Previous r6.44
expected 1,785 + 28 = 1,813. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
