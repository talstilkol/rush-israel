# RSH-036 r6.59 — leftover-occupying HemisphereLight is hemi.color, not intensity vs groundColor

Candidate, 11 September 2026. Base 2f13e05
(r6.58 amb isolation + GFX-03 queue). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.58 exact-head CI is not claimed. GFX-01 namal car orientation and
GFX-03 Ayalon night P2P camera-through-car stay queued after RSH-036 and are
not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-69: leftover-occupying HemisphereLight is hemi.color, not intensity vs groundColor

r6.58 proved leftover fromScene of Color 0x808080 vs off occupies B −18.5/−20.2
and product HemisphereLight occupies that leftover (B −17.7/−19.6). The new
probe isolates HemisphereLight.intensity 0 vs color 0x000000 vs groundColor
0x000000 on a 0x808080 fromScene independently of AmbientLight vs RectAreaLight
vs 0x3a9ae0 hue vs sun intensity vs fill after setNight/snapCamera(true) at
threshold 0.12 without changing product color or exposure. hint/hcol/hgnd
deltas use the 0x808080 hue buffer as baseline.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all true/false as required, hint 1 / hcol 1 / hgnd 1 / hue 1 /
intensity 1 / fill 1):

| pose | band | dominantHem | hint B Δ | hcol B Δ | hgnd B Δ | hue B Δ | intensity luma Δ |
|---|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | intensity | **−17.7** | **−17.7** | **+0.2** | −30.2 | −28.0 |
| g05 | bottom | intensity | **−19.6** | **−19.6** | **+0.3** | −32.8 | −31.1 |
| g07 | upper | hgnd | +4.8 | +5.1 | +7.8 | −24.4 | −2.8 |
| g08 | bottom | intensity | **−11.4** | **−11.4** | **0.0** | −21.2 | −11.5 |

Day-bottom leftover-occupying hemi is **hemi.color** (product day 0xa8c8e8 /
night 0x6a88b0): hint ≡ hcol (B −17.7/−19.6). groundColor ≡ gray (ΔB
+0.2/+0.3). Intensity=0 equals color=0 because groundColor contributes 0; the
intensity knob is not an independent leftover driver. Hue occupies B
−30.2/−32.8. Intensity occupies luma. Fill joins intensity on g08 night
(−12.4). setNight does not rebake. g07 upper remains ramps. Camera stays
7.4/1.92.

Local unique cases: 28 in `scripts/world-hemi.test.mjs`. Previous r6.58
expected 2,177 + 28 = 2,205. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
