# RSH-036 r6.68 — remaining g07 after ramps is leftover unnamed, not env

Candidate, 11 September 2026. Base 12b299c
(r6.67 upper isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.67 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05 and GFX-06 stay queued after RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-78: remaining g07 after ramps is leftover unnamed, not env

r6.67 remaining g07 upper is ramps, not sky, not piers. Remaining after
ramps was still combined env bandDelta versus leftover unnamed occupancy.
The new probe isolates ramps versus gray scene.environment versus both
versus leftover (ramps+env+sky+piers) independently of sky vs piers after
setNight/snapCamera(true) at threshold 0.12 without changing product color
or exposure. Deltas use the product present buffer as baseline.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all true/false as required):

| pose | band | ramps band Δ | env band Δ | both band Δ | left band Δ | leftover-after-ramps-as-env |
|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | **0** | 0.0032 | 0.0032 | 0.0032 | **0** (both ≡ env) |
| g05 | bottom | **0** | 0.0012 | 0.0012 | 0.0012 | **0** (both ≡ env) |
| g07 | upper | **−0.1788** | −0.0744 | **−0.1712** | −0.1762 | **≈ 0** (both ≡ ramps) |
| g08 | bottom | **0** | −0.0312 | −0.0312 | −0.0312 | **0** (both ≡ env) |

g07 remaining after ramps is leftover unnamed occupancy (~40% of the upper
band still mismatches), not env. both ≡ ramps (bandDelta −0.1712 vs −0.1788)
so leftover-after-ramps-as-env ≈ 0. left ≡ both so leftover unnamed is not
sky, not piers. Env independently occupies product-present g07 B −16.4 /
bandDelta −0.0744, but that occupancy does not survive after ramps are
hidden. Day-bottom ramps ≡ 0 and both ≡ env. Camera stays 7.4/1.92.

Local unique cases: 28 in `scripts/world-renv.test.mjs`. Previous r6.67
expected 2,429 + 28 = 2,457. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
