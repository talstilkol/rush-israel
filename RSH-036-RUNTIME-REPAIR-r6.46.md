# RSH-036 r6.46 — combined IBL is not bakeEnv PMREM vs captureSceneEnv cube

Candidate, 11 September 2026. Base 5ff7cbedacd932bc2b995fb213706b5a95594dc2
(r6.45 cube isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.45 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-56: combined IBL is not bakeEnv PMREM vs captureSceneEnv cube

r6.45 proved IBL-off occupies more than product-vs-gray, but the product
cubemap mixed bakeEnv with captureSceneEnv. The new probe isolates bakeEnv
PMREM vs a non-destructive capture cube independently of intensity vs fill
after setNight/snapCamera(true) at threshold 0.12 without changing product
color or exposure. Cube-only reports, luma-terms-include-hemi,
bake-is-combined, bake-clears-gain, bake-clears-intensity,
capture-clears-intensity, intensity-clears-ibl, PNG refresh, color retune and
treating this probe as original-golden fail closed. Smoke keeps
`verifyWorldLayers` through `verifyWorldCube` and `verifyWorldProbe`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all false, bake 1 / capture 1 / intensity 1 / fill 1):

| pose | band | probe | bake B Δ | capture B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|
| g01 | bottom | intensity | 0 | +0.6 | −28.0 |
| g05 | bottom | intensity | 0 | −2.2 | −31.1 |
| g07 | upper | capture | 0 | +10.6 | −2.8 |
| g08 | bottom | bake | −32.1 | −26.2 | −11.5 |

Day-bottom bakeEnv swap is 0: product cubemap is already bakeEnv PMREM.
captureSceneEnv is not a remaining day-bottom driver. `setNight` calls
`applyClockSky(false)` so it does not rebake; g08 present keeps the day
cubemap and both night-bakeEnv and night-capture occupy that leftover.
Intensity occupies luma. Fill joins intensity on g08 night (−12.4). g07 upper
remains ramps. Camera stays 7.4/1.92. PNG refresh and color/exposure retune
remain forbidden.

Local unique cases: 28 in `scripts/world-probe.test.mjs`. Previous r6.45
expected 1,813 + 28 = 1,841. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
