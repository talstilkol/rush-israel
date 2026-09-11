# RSH-036 r6.75 — leftover g07 after world.group+outside is remaining empty-scene vs golden, not camera fov, not near, not far, not env

Candidate, 11 September 2026. Base b9433eb
(r6.74 tmap isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.74 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05, GFX-06 and GFX-07 stay queued after RSH-036 and are not
remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-85: leftover g07 empty-scene vs golden is not camera fov vs near vs far

r6.74 leftover g07 after world.group+outside hidden is remaining empty-scene
vs golden residual (leftover 0.2027), not toneMapping, not ColorManagement
and not env. LinearSRGB increases mismatch. The new probe isolates leftover
after world.group+outside as remaining empty-scene vs golden independently of
camera fov vs near vs far after setNight/snapCamera(true) at threshold 0.12
without changing product color, exposure or rest-chase 7.4/1.92. Product fov
58 / near 0.28 / far ≥ 10000 stay on the leftover path. Isolation uses fov 90,
near 8, far 80. Deltas use the empty-scene leftover buffer as baseline.

Live leftover after world.group+outside hidden, rest chase 7.4/1.92
(product hex `0xd0d4d8`, exposure 0.56, independence flags all true/false
as required):

| pose | leftover % | fov Δ | near Δ | far Δ | env Δ | both Δ | clip Δ |
|---|---:|---:|---:|---:|---:|---:|---:|
| g01 | 0.9907 | **0** | **0** | **0** | **0** | **0** | **0** |
| g05 | 0.9844 | **0** | **0** | **0** | **0** | **0** | **0** |
| g07 | **0.2027** | **0** | **0** | **0** | **0** | **0** | **0** |
| g08 | 0.9904 | **0** | **0** | **0** | **0** | **0** | **0** |

g07 leftover after world.group+outside is remaining empty-scene vs golden
residual (leftover 0.2027), not fov 90 (≡ 0, L2 ≡ 0), not near 8 (≡ 0), not
far 80 (≡ 0) and not env (≡ 0). both ≡ clip ≡ 0. leftover-after-empty-as-env
≡ 0. Empty leftover has no world geometry for a frustum change to reproject;
the 200px band is a product background fill vs locked PNG world content.
Product fov 58 stays. Camera stays 7.4/1.92. Counts: leftover 2082.

Local unique cases: 28 in `scripts/world-cam.test.mjs`. Previous r6.74
expected 2,625 + 28 = 2,653. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
