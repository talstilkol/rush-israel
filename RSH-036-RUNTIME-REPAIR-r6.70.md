# RSH-036 r6.70 — leftover g07 after ramps+buildings is instanced + ground, not water, not glass

Candidate, 11 September 2026. Base f6cc7b0
(r6.69 gleft isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.69 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05 and GFX-06 stay queued after RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-80: leftover g07 after ramps+buildings is instanced + ground

r6.69 leftover g07 after ramps is buildings (catch-all), remaining ~30% after
hiding that catch-all. The new probe splits water / glass / instanced out of
that catch-all and isolates leftover after ramps+buildings as water versus
glass versus instanced independently of ground vs road vs env after
setNight/snapCamera(true) at threshold 0.12 without changing product color
or exposure. Deltas use the ramps+buildings leftover buffer as baseline.

Live leftover after ramps+buildings, rest chase 7.4/1.92 (product hex
`0xd0d4d8`, exposure 0.56, independence flags all true/false as required):

| pose | band | leftover % | water band Δ | glass band Δ | instanced band Δ | ground band Δ | leftover-after-instanced |
|---|---|---:|---:|---:|---:|---:|---:|
| g01 | bottom | 0.8451 | **0** | **0** | +0.0161 | +0.1190 | — |
| g05 | bottom | 0.8396 | **0** | **0** | **0** | +0.1448 | — |
| g07 | upper | **0.3313** | **0** | **−0.0002** | **−0.0345** | **−0.0453** | **0.2968** |
| g08 | bottom | 0.8564 | **0** | **0** | **0** | +0.1340 | — |

g07 leftover after ramps+buildings is instanced (bandDelta −0.0345, L2 −8.3,
leftover 0.3313 → 0.2968) plus ground (bandDelta −0.0453, leftover → 0.2860),
not water (≡ 0) and not glass (≈ 0). leftover-after-buildings-as-env ≈ 0
(bandDelta −0.0044). Road ≡ 0. Remaining after instanced is still ~30% unnamed
occupancy; remaining after ground is ~29%. Day-bottom leftover after
ramps+buildings is not water not glass not instanced; hiding ground increases
mismatch. Camera stays 7.4/1.92.

Local unique cases: 28 in `scripts/world-wgi.test.mjs`. Previous r6.69
expected 2,485 + 28 = 2,513. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
