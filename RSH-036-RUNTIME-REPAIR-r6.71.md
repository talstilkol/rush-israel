# RSH-036 r6.71 — leftover g07 after ramps+buildings+instanced+ground is remaining non-mesh, not unnamed meshes, not env

Candidate, 11 September 2026. Base 9c137da
(r6.70 wgi isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.70 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05 and GFX-06 stay queued after RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-81: leftover g07 after ramps+buildings+instanced+ground is remaining non-mesh occupancy

r6.70 leftover g07 after ramps+buildings is instanced+ground, remaining ~30%
after hiding instanced. The new probe isolates leftover after
ramps+buildings+instanced+ground as remaining unnamed occupancy versus env
independently of sky vs piers vs extras after setNight/snapCamera(true) at
threshold 0.12 without changing product color or exposure. Deltas use the
ramps+buildings+instanced+ground leftover buffer as baseline.

Live leftover after ramps+buildings+instanced+ground, rest chase 7.4/1.92
(product hex `0xd0d4d8`, exposure 0.56, independence flags all true/false as
required):

| pose | band | leftover % | unnamed band Δ | env band Δ | both band Δ | sky band Δ | piers band Δ | extras band Δ |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| g01 | bottom | 0.9907 | **0** | **0** | **0** | **0** | **0** | **0** |
| g05 | bottom | 0.9844 | **0** | **0** | **0** | **0** | **0** | **0** |
| g07 | upper | **0.2087** | **−0.006** | **+0.0002** | **−0.006** | **0** | **−0.0057** | **0** |
| g08 | bottom | 0.9904 | **0** | **0** | **0** | **0** | **0** | **0** |

g07 leftover after ramps+buildings+instanced+ground is remaining non-mesh
occupancy (leftover 0.2087), not remaining unnamed world meshes (unnamed
bandDelta −0.006 below 0.02, leftover → 0.2027) and not env (≈ 0). both ≡
unnamed. sky ≡ 0. extras ≡ 0 (no unclassified meshes; extrasCount equals
leftover). piers occupy a tiny leftover axis (−0.0057) that accounts for
unnamed. Remaining after all world meshes hidden is still ~20% non-mesh
occupancy. leftover-after-ignd-as-env ≈ 0. Day-bottom leftover after ignd is
not unnamed not env; hiding remaining meshes does not reduce 98–99%. Camera
stays 7.4/1.92.

Local unique cases: 28 in `scripts/world-uleft.test.mjs`. Previous r6.70
expected 2,513 + 28 = 2,541. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
