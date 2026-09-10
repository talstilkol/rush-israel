# RSH-036 r6.37 — ground-plane color occupation is not live-vs-golden mean RGB

Candidate, 10 September 2026. Base b5df3885f315ca9ef96eec8c50ab4682df5c328c
(r6.36 factor isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.36 exact-head CI was in progress at preparation and is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-47: ground-plane color occupation is not a live-vs-golden mean RGB sample

r6.36 reported g01/g05/g08 bottom is ground-plane color `0xd0d4d8`. Black albedo
drops mismatch; that is not the live vs locked-PNG mean RGB of the dominant
band or of ground-colored pixels. The new probe samples those means after
setNight/snapCamera(true) at threshold 0.12 without changing product color.
Factor-only reports, missing samples, PNG refresh, color retune and treating
this probe as original-golden fail closed. Smoke keeps `verifyWorldLayers`
through `verifyWorldFactor` and `verifyWorldRgb`.

Live present RGB after rest chase 7.4/1.92 (product hex stays `0xd0d4d8`):

| pose | band | band live | band gold | band L2 | ground n | ground live | ground gold | ground L2 |
|---|---|---|---|---:|---:|---|---|---:|
| g01 | bottom | 77 / 105 / 132 | 26 / 36 / 38 | 127.4 | 15144 | 199 / 200 / 198 | 84 / 89 / 68 | 206.1 |
| g05 | bottom | 75 / 105 / 134 | 11 / 22 / 30 | 147.8 | 0 | — | — | 0 |
| g07 | upper | 31 / 71 / 104 | 50 / 122 / 167 | 83.4 | 436 | 197 / 198 / 192 | 53 / 78 / 97 | 210.0 |
| g08 | bottom | 41 / 54 / 81 | 7 / 6 / 4 | 96.2 | 0 | — | — | 0 |

Locked PNG bottom is dark. Live present is brighter and bluer. Where live shows
albedo-near pixels, gold is olive-dark, not `0xd0d4d8`. g05/g08 bottom have no
live pixels within 80 of albedo. Camera stays 7.4/1.92. PNG refresh and color
retune remain forbidden.

Local unique cases: 28 in `scripts/world-rgb.test.mjs`. Previous r6.36 expected
1,561 + 28 = 1,589. Pixel 0/4, immutable CDN bytes, rendering performance and
freeze remain open.
