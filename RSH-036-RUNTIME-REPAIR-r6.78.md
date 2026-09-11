# RSH-036 r6.78 — leftover g07 after world.group+outside is remaining empty-scene vs golden, not bloom, not SMAA, not grade, not env

Candidate, 11 September 2026. Base 4cc8555
(r6.77 px isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.77 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05, GFX-06, GFX-07 and GFX-08 stay queued after RSH-036 and are
not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-88: leftover g07 empty-scene vs golden is not bloom vs SMAA vs grade

r6.77 leftover g07 after world.group+outside hidden is remaining empty-scene
vs golden residual (leftover 0.2027), not pixelRatio, not drawingBuffer, not
post.setSize and not env. The new probe isolates leftover after
world.group+outside as remaining empty-scene vs golden independently of bloom
vs SMAA vs grade after setNight/snapCamera(true) at threshold 0.12 without
changing product color, exposure, frustum, chase pose or pixel buffer.
Product post pipeline stays on the leftover path. Isolation uses bloom
strength 0.8 enabled, SMAA disabled and grade disabled. r6.72 already showed
hiding the whole composer ≈ 0; this split is bloom vs SMAA vs grade.
Deltas use the empty-scene leftover buffer as baseline.

Live leftover after world.group+outside hidden, rest chase 7.4/1.92,
1280×800 p=1 (product hex `0xd0d4d8`, exposure 0.56, independence flags
all true/false as required):

| pose | leftover % | bloom Δ | smaa Δ | grade Δ | env Δ | both Δ | pack Δ |
|---|---:|---:|---:|---:|---:|---:|---:|
| g01 | 0.9907 | **0** | **0** | **0** | **0** | **0** | **0** |
| g05 | 0.9844 | **0** | **0** | **0** | **0** | **0** | **0** |
| g07 | **0.2027** | **0** | **0** | **0** | **0** | **0** | **0** |
| g08 | 0.9904 | **0** | **0** | +0.0079 | **0** | +0.0079 | +0.0079 |

g07 leftover after world.group+outside is remaining empty-scene vs golden
residual (leftover 0.2027), not bloom 0.8 (≡ 0, L2 ≡ 0), not SMAA off (≡ 0),
not grade off (bandDelta ≡ 0, L2 +0.04 below FX_L2_MIN 8) and not env (≡ 0).
both ≡ pack ≡ 0. leftover-after-empty-as-env ≡ 0. Empty leftover has no world
geometry for a post-pass change to grade against golden occupancy; the 200px
band is a product background fill vs locked PNG world content. g08 night
grade L2 +12.77 with bandDelta +0.0079 below PX_BAND_MIN 0.02 is a
night-empty grade tint, not remaining g07 0/4. Product post stays.
Counts: leftover 2082.

Local unique cases: 28 in `scripts/world-fx.test.mjs`. Previous r6.77
expected 2,709 + 28 = 2,737. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
