# RSH-036 r6.62 — remaining cubemap vs IBL-off with gray hemi is scene.environment, not material.envMap

Candidate, 11 September 2026. Base 45ab88c
(r6.61 off isolation + GFX-04 queue). No merge or freeze; 35/67
accepted; 32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained.
Do not relabel them as passes. r6.61 exact-head CI is not claimed. GFX-01,
GFX-03 and GFX-04 stay queued after RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-72: remaining cubemap vs IBL-off with gray hemi is scene.environment

r6.61 leftover after neutralizing hemi.color to 0x808080 occupies B −21.5/−23.8
as cubemap vs IBL-off. The new probe isolates scene.environment=null versus
material.envMap=null versus both, with hemi.color held at 0x808080, independently
of 0x3a9ae0 hue vs sun intensity vs fill after setNight/snapCamera(true) at
threshold 0.12 without changing product color or exposure. env/mat/both deltas
use the hgray buffer as baseline.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all true/false as required):

| pose | band | env B Δ vs hgray | mat B Δ vs hgray | both B Δ vs hgray | hue B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | **−21.5** | **0** | **−21.5** | −30.2 | −28.0 |
| g05 | bottom | **−23.8** | **0** | **−23.8** | −32.8 | −31.1 |
| g07 | upper | −25.2 | 0 | −25.2 | −24.4 | −2.8 |
| g08 | bottom | **−10.8** | **0** | **−10.8** | −21.2 | −11.5 |

Day-bottom leftover cubemap vs IBL-off with gray hemi is scene.environment:
env ≡ both (B −21.5/−23.8, L2 −34.9/−38.4). material.envMap ≡ gray (Δ 0).
Hue occupies B −30.2/−32.8. Intensity occupies luma. Fill joins intensity on
g08 night (−12.4). setNight does not rebake. g07 upper remains ramps. Camera
stays 7.4/1.92.

Local unique cases: 28 in `scripts/world-env.test.mjs`. Previous r6.61
expected 2,261 + 28 = 2,289. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
