# RSH-036 r6.66 — g08 night fill and sun intensity are independent additive luma

Candidate, 11 September 2026. Base 24a0de8
(r6.65 hterm isolation plus GFX-06 queue). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.65 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05 and GFX-06 stay queued after RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-76: g08 night fill vs sun are independent additive luma

r6.65 remaining hemi occupancy is hemi.color (B −8.9/−9.7), not groundColor
(hgnd ≡ 0). Fill joined intensity on g08 night (−12.4). The new probe
isolates fill versus sun versus both independently of hemi.color vs
scene.environment vs hemi.intensity after setNight/snapCamera(true) at
threshold 0.12 without changing product color or exposure. Deltas use the
product present buffer as baseline.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all true/false as required):

| pose | band | fill luma Δ | sun luma Δ | both luma Δ |
|---|---|---:|---:|---:|
| g01 | bottom | −3.4 | **−28.0** | **−32.7** |
| g05 | bottom | −3.8 | **−31.1** | **−36.3** |
| g07 | upper | −0.4 | −2.8 | −3.3 |
| g08 | bottom | **−12.4** | **−11.5** | **−25.2** |

g08 night fill and sun are independent additive luma (both ≈ fill + sun).
Day-bottom fill stays under the luma floor (−3.4/−3.8); sun occupies luma.
env cubemap hue stays B −30.0/−32.5. hemi.color occupies B −8.9/−9.7.
setNight does not rebake. g07 upper remains ramps. Camera stays 7.4/1.92.

Local unique cases: 28 in `scripts/world-nfill.test.mjs`. Previous r6.65
expected 2,373 + 28 = 2,401. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
