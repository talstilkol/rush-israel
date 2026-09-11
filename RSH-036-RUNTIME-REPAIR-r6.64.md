# RSH-036 r6.64 — remaining bakeEnv 0x3a9ae0 hue is scene.environment, not scene.background

Candidate, 11 September 2026. Base 48a6ed3
(r6.63 eint isolation plus GFX-05 queue). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.63 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04 and GFX-05 stay queued after RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-74: remaining bakeEnv 0x3a9ae0 hue is scene.environment, not background

r6.63 leftover cubemap with gray hemi is environment=null ≡
environmentIntensity=0 ≡ both (B −21.5/−23.8). The new probe isolates
scene.background=0x808080 versus gray cubemap versus both independently of
hemi.color vs sun intensity vs fill after setNight/snapCamera(true) at
threshold 0.12 without changing product color or exposure. Deltas use the
product present buffer as baseline.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all true/false as required):

| pose | band | bg B Δ | env B Δ | both B Δ | hemi B Δ | intensity luma Δ |
|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | **0** | **−30.0** | **−30.0** | −8.9 | −28.0 |
| g05 | bottom | **0** | **−32.5** | **−32.5** | −9.7 | −31.1 |
| g07 | upper | 0 | −16.4 | −16.4 | −1.5 | −2.8 |
| g08 | bottom | **0** | **−21.2** | **−21.2** | −4.1 | −11.5 |

Day-bottom bakeEnv 0x3a9ae0 hue is scene.environment cubemap, not
scene.background (bg ≡ 0; env ≡ both B −30.0/−32.5). hemi.color occupies B
−8.9/−9.7 independently with the product cubemap. Intensity occupies luma.
Fill joins intensity on g08 night (−12.4). setNight does not rebake. g07
upper remains ramps. Camera stays 7.4/1.92.

Local unique cases: 28 in `scripts/world-back.test.mjs`. Previous r6.63
expected 2,317 + 28 = 2,345. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
