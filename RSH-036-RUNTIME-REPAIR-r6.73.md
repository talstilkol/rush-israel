# RSH-036 r6.73 — leftover g07 after all world.group meshes is remaining empty-scene vs golden, not occupancy outside world.group, not hero, not fx, not blob, not env

Candidate, 11 September 2026. Base 5077670
(r6.72 nmesh isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.72 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05, GFX-06 and GFX-07 stay queued after RSH-036 and are not
remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-83: leftover g07 after all world.group meshes is remaining empty-scene vs golden, not occupancy outside world.group

r6.72 leftover g07 after all world meshes hidden is remaining empty-scene
vs golden residual (leftover 0.2027). The new probe isolates leftover
after all world.group meshes as remaining occupancy outside world.group
versus env independently of hero vs fx vs blob after setNight/snapCamera(true)
at threshold 0.12 without changing product color or exposure. Deltas use
the empty-scene leftover buffer as baseline.

Live leftover after all world.group meshes hidden, rest chase 7.4/1.92
(product hex `0xd0d4d8`, exposure 0.56, independence flags all true/false
as required):

| pose | band | leftover % | outside band Δ | env band Δ | both band Δ | hero band Δ | fx band Δ | blob band Δ |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| g01 | bottom | 0.9907 | **0** | **0** | **0** | **0** | **0** | **0** |
| g05 | bottom | 0.9844 | **0** | **0** | **0** | **0** | **0** | **0** |
| g07 | upper | **0.2027** | **0** | **0** | **0** | **0** | **0** | **0** |
| g08 | bottom | 0.9904 | **0** | **0** | **0** | **0** | **0** | **0** |

g07 leftover after all world.group meshes hidden is remaining empty-scene
vs golden residual (leftover 0.2027), not occupancy outside world.group
(outside ≡ 0), not hero (≡ 0), not fx (≡ 0), not blob (≡ 0) and not env
(≡ 0). both ≡ 0. leftover-after-empty-as-outside ≡ 0. Counts: leftover
1154, outside restorers 2082, hero 1260, fx 1159, blob 1158. Camera stays
7.4/1.92.

Owner screenshot 2026-09-11 17:55.22 on track `jerusalem` (מחנה יהודה,
P2P, 1 km/h) plus the report that forward driving does not work is
recorded as GFX-07 and stays queued after RSH-036.

Local unique cases: 28 in `scripts/world-ogrp.test.mjs`. Previous r6.72
expected 2,569 + 28 = 2,597. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
