# RSH-036 r6.69 — leftover g07 after ramps is buildings, not road

Candidate, 11 September 2026. Base 043596f
(r6.68 renv isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.68 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05 and GFX-06 stay queued after RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-79: leftover g07 after ramps is buildings, not road

r6.68 remaining g07 after ramps is leftover unnamed occupancy (~40%), not
env. The new probe isolates leftover after ramps as road versus buildings
versus ground independently of env vs sky vs piers after
setNight/snapCamera(true) at threshold 0.12 without changing product color
or exposure. Deltas use the ramps-hidden leftover buffer as baseline.

Live leftover after ramps, rest chase 7.4/1.92 (product hex `0xd0d4d8`,
exposure 0.56, independence flags all true/false as required):

| pose | band | leftover % | road band Δ | buildings band Δ | ground band Δ | env band Δ | leftover-after-buildings |
|---|---|---:|---:|---:|---:|---:|---:|
| g01 | bottom | 0.8451 | **0** | +0.0161 | +0.1190 | 0.0032 | — |
| g05 | bottom | 0.8396 | **0** | **0** | +0.1448 | 0.0012 | — |
| g07 | upper | **0.4003** | **0** | **−0.1037** | −0.0282 | +0.0076 | **0.2966** |
| g08 | bottom | 0.8564 | **0** | **0** | +0.1340 | −0.0312 | — |

g07 leftover after ramps is buildings (bandDelta −0.1037, L2 −20.4), not
road (≡ 0). leftover-after-ramps-as-env ≈ 0 (bandDelta +0.0076) matching
r6.68. Sky ≡ 0, piers ≈ 0. Ground is a small independent leftover axis
(bandDelta −0.0282). Remaining after ramps+buildings is still ~30% unnamed
occupancy. Day-bottom leftover after ramps is not road not buildings; hiding
ground increases mismatch. Camera stays 7.4/1.92.

Local unique cases: 28 in `scripts/world-gleft.test.mjs`. Previous r6.68
expected 2,457 + 28 = 2,485. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
