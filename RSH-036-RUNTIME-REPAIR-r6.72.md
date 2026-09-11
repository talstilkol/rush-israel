# RSH-036 r6.72 — leftover g07 after all world meshes is remaining empty-scene vs golden, not background, not clear, not fog, not post, not env

Candidate, 11 September 2026. Base 103b33a
(r6.71 uleft isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.71 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05 and GFX-06 stay queued after RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-82: leftover g07 after all world meshes is remaining empty-scene vs golden residual

r6.71 leftover g07 after ramps+buildings+instanced+ground is remaining
non-mesh occupancy (leftover 0.2087 → 0.2027 after hiding remaining world
meshes). The new probe isolates leftover after all world meshes hidden as
remaining non-mesh occupancy versus env independently of background vs
clear vs fog vs post after setNight/snapCamera(true) at threshold 0.12
without changing product color or exposure. Deltas use the empty-scene
leftover buffer as baseline.

Live leftover after ramps+buildings+instanced+ground+remaining-meshes, rest
chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56, independence flags
all true/false as required):

| pose | band | leftover % | background band Δ | clear band Δ | fog band Δ | post band Δ | env band Δ | both band Δ |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| g01 | bottom | 0.9907 | **−0.0014** | **0** | **0** | **0** | **0** | **−0.0014** |
| g05 | bottom | 0.9844 | **−0.0013** | **0** | **0** | **0** | **0** | **−0.0013** |
| g07 | upper | **0.2027** | **+0.7322** | **0** | **0** | **+0.0003** | **0** | **+0.7322** |
| g08 | bottom | 0.9904 | **+0.0021** | **0** | **0** | **+0.0061** | **0** | **+0.0021** |

g07 leftover after all world meshes hidden is remaining empty-scene vs
golden residual (leftover 0.2027), not background (graying scene.background
increases mismatch +0.7322, leftover → 0.9349), not clear (≡ 0), not fog
(≡ 0), not post (≈ 0, leftover → 0.2030) and not env (≡ 0). both ≡
background. leftover-after-empty-as-env ≡ 0. Product background is closer
to golden than gray; the remaining ~20% is empty-scene sky vs locked PNG
at threshold 0.12. Day-bottom leftover after empty is not a named non-mesh
axis; neutralizing background/clear/fog/post/env does not reduce 98–99%.
Camera stays 7.4/1.92.

Local unique cases: 28 in `scripts/world-nmesh.test.mjs`. Previous r6.71
expected 2,541 + 28 = 2,569. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
