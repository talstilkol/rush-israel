# RSH-036 r6.38 — live-vs-golden mean RGB is not shade attribution

Candidate, 10 September 2026. Base 91409ed7383121710943924ec13995bd6ce32138
(r6.37 RGB sampling). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.37 exact-head CI was in progress at preparation and is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-48: live-vs-golden mean RGB is not grade/fog/hemi/exposure/envmap/unlit

r6.37 sampled g01/g05/g08 bottom live 77/75/41 vs gold 26/11/7 (L2 127/148/96).
That mean is not which shade occupies the L2. The new probe isolates grade, fog,
hemi, exposure, envmap and unlit after setNight/snapCamera(true) at threshold
0.12 without changing product color or exposure. RGB-only reports, missing
dominantShade, PNG refresh, color retune and treating this probe as
original-golden fail closed. Smoke keeps `verifyWorldLayers` through
`verifyWorldRgb` and `verifyWorldShade`.

Live present RGB L2 after rest chase 7.4/1.92 (product hex stays `0xd0d4d8`):

| pose | band | shade | hemi ΔL2 | exposure ΔL2 | envmap ΔL2 | unlit ΔL2 | fog ΔL2 | grade ΔL2 |
|---|---|---|---:|---:|---:|---:|---:|---:|
| g01 | bottom | unlit | −18.4 | −67.7 | −50.2 | −68.6 | 0 | +2.1 |
| g05 | bottom | exposure | −20.7 | −107.3 | −54.2 | −80.5 | 0 | +2.0 |
| g07 | upper | grade | +4.2 | +116.2 | +45.9 | +13.1 | 0 | −0.9 |
| g08 | bottom | exposure | −11.0 | −77.5 | −33.9 | −48.8 | 0 | +8.7 |

Zeroing exposure or all lights drops day-bottom L2 because live goes dark,
nearer the locked PNG. Nulling envmap cuts the blue channel (g01 130→82) while
pixelmatch bandDelta stays ~0 on day — r6.36's 0.12 threshold missed that
uniform tint. Hemi is the remaining sky-blue lift. Fog and grade are not the
driver. g07 upper remains ramps. Camera stays 7.4/1.92. PNG refresh and color
retune remain forbidden.

Local unique cases: 28 in `scripts/world-shade.test.mjs`. Previous r6.37 expected
1,589 + 28 = 1,617. Pixel 0/4, immutable CDN bytes, rendering performance and
freeze remain open.
