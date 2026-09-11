# RSH-036 r6.74 — leftover g07 after world.group+outside is remaining empty-scene vs golden, not toneMapping, not ColorManagement, not env; LinearSRGB increases

Candidate, 11 September 2026. Base cb188ed
(r6.73 ogrp isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.73 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05, GFX-06 and GFX-07 stay queued after RSH-036 and are not
remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-84: leftover g07 empty-scene vs golden is not toneMapping vs outputColorSpace vs ColorManagement

r6.73 leftover g07 after all world.group meshes hidden is remaining
empty-scene vs golden residual (leftover 0.2027), not occupancy outside
world.group. The new probe isolates leftover after world.group+outside as
remaining empty-scene vs golden independently of toneMapping vs
outputColorSpace vs ColorManagement after setNight/snapCamera(true) at
threshold 0.12 without changing product color or exposure. Product ACES /
sRGB / ColorManagement.enabled stay on the leftover path. Deltas use the
empty-scene leftover buffer as baseline.

Live leftover after world.group+outside hidden, rest chase 7.4/1.92
(product hex `0xd0d4d8`, exposure 0.56, independence flags all true/false
as required):

| pose | band | leftover % | tone band Δ | space band Δ | mgmt band Δ | env band Δ | both band Δ | enc band Δ |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| g01 | bottom | 0.9907 | **0** | **0** | **0** | **0** | **0** | **0** |
| g05 | bottom | 0.9844 | **0** | **0** | **0** | **0** | **0** | **0** |
| g07 | upper | **0.2027** | **+0.0003** | **+0.7482** | **0** | **0** | **+0.7597** | **+0.7597** |
| g08 | bottom | 0.9904 | **+0.0012** | **−0.9878** | **0** | **0** | **−0.9878** | **−0.9878** |

g07 leftover after world.group+outside is remaining empty-scene vs golden
residual (leftover 0.2027), not toneMapping (NoToneMapping ≈ 0, leftover →
0.2030), not ColorManagement (≡ 0) and not env (≡ 0). LinearSRGB output
increases mismatch +0.7482 (leftover → 0.9509). both ≡ enc ≡ space.
leftover-after-empty-as-env ≡ 0. Product ACES / sRGB / ColorManagement.enabled
is closer to golden than any encode neutralization. g08 night LinearSRGB
collapses leftover 0.9904 → 0.0026; that is a night-empty encode artifact,
not remaining g07 0/4. Camera stays 7.4/1.92. Counts: leftover 2082.

Local unique cases: 28 in `scripts/world-tmap.test.mjs`. Previous r6.73
expected 2,597 + 28 = 2,625. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
