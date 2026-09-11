# RSH-036 r6.76 — leftover g07 after world.group+outside is remaining empty-scene vs golden, not follow, not height, not look-ahead, not env; GFX-08 queued

Candidate, 11 September 2026. Base 0c90d40
(r6.75 cam isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.75 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05, GFX-06, GFX-07 and GFX-08 stay queued after RSH-036 and are
not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-86: leftover g07 empty-scene vs golden is not rest-chase follow vs height vs look-ahead

r6.75 leftover g07 after world.group+outside hidden is remaining empty-scene
vs golden residual (leftover 0.2027), not camera fov, not near, not far and
not env. The new probe isolates leftover after world.group+outside as
remaining empty-scene vs golden independently of rest-chase follow vs height
vs look-ahead after setNight/snapCamera(true) at threshold 0.12 without
changing product color, exposure or frustum. Product follow 7.4 / height 1.92
stay on the leftover path. Isolation uses follow 14, height 4, lookAt
player.y+20. Deltas use the empty-scene leftover buffer as baseline.

Live leftover after world.group+outside hidden, rest chase 7.4/1.92
(product hex `0xd0d4d8`, exposure 0.56, independence flags all true/false
as required):

| pose | leftover % | follow Δ | height Δ | look Δ | env Δ | both Δ | pose Δ |
|---|---:|---:|---:|---:|---:|---:|---:|
| g01 | 0.9907 | **0** | **0** | **0** | **0** | **0** | **0** |
| g05 | 0.9844 | **0** | **0** | **0** | **0** | **0** | **0** |
| g07 | **0.2027** | **0** | **0** | **0** | **0** | **0** | **0** |
| g08 | 0.9904 | **0** | **0** | **0** | **0** | **0** | **0** |

g07 leftover after world.group+outside is remaining empty-scene vs golden
residual (leftover 0.2027), not follow 14 (≡ 0, L2 ≡ 0), not height 4 (≡ 0),
not look-ahead (≡ 0) and not env (≡ 0). both ≡ pose ≡ 0.
leftover-after-empty-as-env ≡ 0. Empty leftover has no world geometry for a
chase-pose change to reproject; the 200px band is a product background fill
vs locked PNG world content. Product 7.4/1.92 stays. Counts: leftover 2082.

## GFX-08 queued (not remaining 0/4)

Owner screenshots 2026-09-11 17:35.28 / 17:35.35 on namal lap 1/3 at
t=0:40.10 (13 km/h) and t=0:47.69 (1 km/h). Two cars appear; multiple road
meshes sit in more than one dimension (flooded water plane, giant cyan
spline/gate arc). Origami Sabra is GFX-01 family. Distinct from GFX-01
(namal rest origami). Queue after RSH-036. Evidence:
docs/evidence/GFX-08-namal-dual-car-stacked-roads.md.

Local unique cases: 28 in `scripts/world-chas.test.mjs`. Previous r6.75
expected 2,653 + 28 = 2,681. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
