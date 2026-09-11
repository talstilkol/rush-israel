# RSH-036 r6.87 — leftover g07 after world.group+outside is remaining empty-scene vs golden, not dithering, not shadowMap.autoUpdate, not info.autoReset, not env

Candidate, 12 September 2026. Base e79c2c3
(r6.86 playability). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.86 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05, GFX-06, GFX-07, GFX-08 and GFX-09 stay queued after RSH-036
and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-96: leftover g07 empty-scene vs golden is not dithering vs shadowMap.autoUpdate vs info.autoReset

r6.85 leftover g07 after world.group+outside hidden is remaining empty-scene
vs golden residual (leftover 0.2027), not autoClearColor, not autoClearDepth,
not autoClearStencil and not env. The new probe isolates leftover after
world.group+outside as remaining empty-scene vs golden independently of
dithering vs shadowMap.autoUpdate vs info.autoReset after
setNight/snapCamera(true) at threshold 0.12 without changing product color,
exposure, frustum, chase pose, pixel buffer, post, antialias, shadow/fog/scissor,
autoClear/sort/override, physicallyCorrectLights/premultiply/log-depth,
preserve/stencil/reversed-depth, localClipping/clipShadows/clipIntersection or
autoClearColor/autoClearDepth/autoClearStencil.
Product renderer stays on the leftover path (dithering false / shadowMap.autoUpdate
true / info.autoReset true). Isolation uses `dithering = true`,
`shadowMap.autoUpdate = false`, and `info.autoReset = false`. Deltas use the
empty-scene leftover buffer as baseline.

Live leftover after world.group+outside hidden, rest chase 7.4/1.92,
1280×800 p=1 (product hex `0xd0d4d8`, exposure 0.56):

| pose | leftover % | dither Δ | shadow Δ | reset Δ | env Δ | both Δ | pack Δ |
|---|---:|---:|---:|---:|---:|---:|---:|
| g01 | 0.9907 | **0** | **0** | **0** | **0** | **0** | **0** |
| g05 | 0.9844 | **0** | **0** | **0** | **0** | **0** | **0** |
| g07 | **0.2027** | **0** | **0** | **0** | **0** | **0** | **0** |
| g08 | 0.9904 | **0** | **0** | **0** | **0** | **0** | **0** |

g07 leftover after world.group+outside is remaining empty-scene vs golden
residual (leftover 0.2027), not dithering on (≡ 0, L2 ≡ 0), not
shadowMap.autoUpdate off (≡ 0), not info.autoReset off (≡ 0) and not env (≡ 0).
both ≡ pack ≡ 0. leftover-after-empty-as-env ≡ 0. Empty leftover has no world
geometry for a dithering/shadowMap.autoUpdate/info.autoReset change to occupy
remaining g07. Product renderer stays. Counts: leftover 2082.

Local unique cases: 28 in `scripts/world-dsa.test.mjs`. Previous r6.85
expected 2,933 + 28 = 2,961. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
