# RSH-036 r6.67 — remaining g07 upper is ramps, not sky, not piers

Candidate, 11 September 2026. Base 0af3372
(r6.66 nfill isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.66 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05 and GFX-06 stay queued after RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-77: remaining g07 upper is ramps, not sky, not piers

r6.66 g08 night fill and sun are independent additive luma. Remaining g07
upper was still combined ramps versus sky versus piers. The new probe
isolates ramp meshes versus the visible sky dome (SphereGeometry 8200)
versus pier cylinders independently of fill vs sun vs hemi.color vs
scene.environment after setNight/snapCamera(true) at threshold 0.12 without
changing product color or exposure. Deltas use the product present buffer
as baseline.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all true/false as required):

| pose | band | ramps band Δ | sky band Δ | piers band Δ | env B Δ |
|---|---|---:|---:|---:|---:|
| g01 | bottom | **0** | **0** | **0** | −30.0 |
| g05 | bottom | **0** | **0** | **0** | −32.5 |
| g07 | upper | **−0.1788** | **0** | **0** | −16.4 |
| g08 | bottom | **0** | **0** | **0** | −21.2 |

g07 upper remaining named occupancy is ramps (bandDelta −0.1788, L2 −67.1),
not sky (≡ 0) and not piers (≡ 0). Env independently occupies g07 B −16.4
and bandDelta −0.0744. Day-bottom ramps/sky/piers stay 0. Camera stays
7.4/1.92.

Local unique cases: 28 in `scripts/world-upper.test.mjs`. Previous r6.66
expected 2,401 + 28 = 2,429. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
