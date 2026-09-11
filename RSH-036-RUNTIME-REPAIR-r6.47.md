# RSH-036 r6.47 — combined bakeEnv IBL is not background vs hemi vs sun disc

Candidate, 11 September 2026. Base 32e664c3ed9368d071da9b80f45a13bb5e5e5d3e
(r6.46 probe isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.46 exact-head CI is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-57: combined bakeEnv IBL is not background vs hemi vs sun disc

r6.46 proved the product cubemap is bakeEnv, but bakeEnv mixed background
0x3a9ae0 with hemi and sun disc. The new probe isolates those three bakeEnv
axes independently of intensity vs fill after setNight/snapCamera(true) at
threshold 0.12 without changing product color or exposure. Probe-only reports,
luma-terms-include-hemi, background-is-combined, background-clears-gain,
background-clears-intensity, hemi-clears-intensity, intensity-clears-ibl, PNG
refresh, color retune and treating this probe as original-golden fail closed.
Smoke keeps `verifyWorldLayers` through `verifyWorldProbe` and `verifyWorldBake`.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all false, background 1 / hemi 1 / disc 1 / intensity 1 /
fill 1):

| pose | band | bake | background B Δ | hemi B Δ | disc B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|
| g01 | bottom | background | −47.8 | −0.1 | +1.7 | −28.0 |
| g05 | bottom | background | −52.0 | −0.1 | +1.8 | −31.1 |
| g07 | upper | disc | −39.7 | −1.0 | +21.2 | −2.8 |
| g08 | bottom | background | −33.9 | −32.1 | −32.1 | −11.5 |

Day-bottom IBL is bakeEnv background `0x3a9ae0`, the entire remaining
environment blue. Hemi and disc are 0. Intensity occupies luma. Fill joins
intensity on g08 night (−12.4). g08 night variants all occupy leftover because
setNight does not rebake. g07 upper remains ramps. Camera stays 7.4/1.92. PNG
refresh and color/exposure retune remain forbidden.

Local unique cases: 28 in `scripts/world-bake.test.mjs`. Previous r6.46
expected 1,841 + 28 = 1,869. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
