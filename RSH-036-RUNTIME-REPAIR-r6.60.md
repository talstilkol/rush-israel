# RSH-036 r6.60 — leftover-occupying hemi.color splits as 0xa8c8e8 vs 0x808080 hue plus 0x000000 presence

Candidate, 11 September 2026. Base 16e42b1
(r6.59 hemi isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.59 exact-head CI is not claimed. GFX-01 and GFX-03 stay queued after
RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-70: leftover-occupying hemi.color is 0xa8c8e8 vs 0x808080 hue plus 0x000000 presence

r6.59 proved leftover-occupying hemi is hemi.color (hint ≡ hcol B −17.7/−19.6)
and groundColor ≡ gray. The new probe isolates hemi.color 0x808080 vs 0x000000
vs intensity 0 on a 0x808080 fromScene independently of groundColor vs
AmbientLight vs RectAreaLight vs 0x3a9ae0 hue vs sun intensity vs fill after
setNight/snapCamera(true) at threshold 0.12 without changing product color or
exposure. hgray/hblack/hint deltas use the 0x808080 hue buffer as baseline.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all true/false as required):

| pose | band | hgray B Δ | hblack B Δ | hint B Δ | hue B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | **−12.4** | **−17.7** | **−17.7** | −30.2 | −28.0 |
| g05 | bottom | **−13.7** | **−19.6** | **−19.6** | −32.8 | −31.1 |
| g07 | upper | +6.0 | +5.1 | +4.8 | −24.4 | −2.8 |
| g08 | bottom | −5.7 | **−11.4** | **−11.4** | −21.2 | −11.5 |

Day-bottom leftover-occupying hemi.color splits: 0xa8c8e8 vs 0x808080 occupies
B −12.4/−13.7 (hue of sky hemi). 0x000000 ≡ intensity 0 occupies the full
hemi leftover (B −17.7/−19.6). Remainder after neutralizing to gray is B
−5.3/−5.9 (presence of any sky hemi). Hue occupies B −30.2/−32.8. Intensity
occupies luma. Fill joins intensity on g08 night (−12.4). setNight does not
rebake. g07 upper remains ramps. Camera stays 7.4/1.92.

Local unique cases: 28 in `scripts/world-hex.test.mjs`. Previous r6.59
expected 2,205 + 28 = 2,233. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
