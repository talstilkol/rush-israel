# RSH-036 r6.61 — leftover after neutralizing hemi.color to 0x808080 is remaining cubemap vs IBL-off

Candidate, 11 September 2026. Base 65abfc1
(r6.60 hex isolation + world-sky.test restore). No merge or freeze; 35/67
accepted; 32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained.
Do not relabel them as passes. r6.60 exact-head CI is not claimed. GFX-01 and
GFX-03 stay queued after RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-71: leftover after neutralizing hemi.color to 0x808080 is remaining cubemap vs IBL-off

r6.60 split leftover-occupying hemi.color as 0xa8c8e8 vs 0x808080 hue (B
−12.4/−13.7) plus 0x000000 presence (B −17.7/−19.6), leaving remainder after
gray B −5.3/−5.9 of leftover −18.5/−20.2. The new probe isolates IBL-off with
hemi.color held at 0x808080 versus gray cubemap with hemi.color 0x808080
independently of 0x000000 presence vs 0x3a9ae0 hue vs sun intensity vs fill
after setNight/snapCamera(true) at threshold 0.12 without changing product
color or exposure. off deltas use the hgray buffer as baseline.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all true/false as required):

| pose | band | off B Δ vs hgray | hgray B Δ vs hue | hblack B Δ vs hue | hue B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | **−21.5** | −12.4 | −17.7 | −30.2 | −28.0 |
| g05 | bottom | **−23.8** | −13.7 | −19.6 | −32.8 | −31.1 |
| g07 | upper | −25.2 | +6.0 | +5.1 | −24.4 | −2.8 |
| g08 | bottom | **−10.8** | −5.7 | −11.4 | −21.2 | −11.5 |

Day-bottom leftover after neutralizing hemi.color to 0x808080 is remaining
cubemap vs IBL-off: off vs hgray occupies B −21.5/−23.8 (L2 −34.9/−38.4),
larger than leftover with product hemi (−18.5/−20.2). The −5.3/−5.9 remainder
of leftover is an interaction term; the cubemap itself is still occupied
independently of hemi hue. Hue occupies B −30.2/−32.8. Intensity occupies luma.
Fill joins intensity on g08 night (−12.4). setNight does not rebake. g07 upper
remains ramps. Camera stays 7.4/1.92.

Local unique cases: 28 in `scripts/world-off.test.mjs`. Previous r6.60
expected 2,233 + 28 = 2,261. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
