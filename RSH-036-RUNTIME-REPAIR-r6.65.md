# RSH-036 r6.65 — remaining hemi occupancy is hemi.color, not groundColor; intensity=0 is a superset

Candidate, 11 September 2026. Base 47f1d6b
(r6.64 back isolation). No merge or freeze; 35/67 accepted; 32 remain. r6.17,
r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.64 exact-head CI is not claimed. GFX-01, GFX-03, GFX-04 and
GFX-05 stay queued after RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-75: remaining hemi occupancy is hemi.color, not groundColor

r6.64 bakeEnv 0x3a9ae0 hue is scene.environment cubemap (bg ≡ 0; env ≡ both
B −30.0/−32.5). hemi.color occupied B −8.9/−9.7 with the product cubemap.
The new probe isolates hemi.color=0x808080 versus hemi.intensity=0 versus
groundColor=0x808080 independently of scene.environment vs sun intensity vs
fill after setNight/snapCamera(true) at threshold 0.12 without changing
product color or exposure. Deltas use the product present buffer as baseline.

Live present after rest chase 7.4/1.92 (product hex `0xd0d4d8`, exposure 0.56,
independence flags all true/false as required):

| pose | band | hcol B Δ | hint B Δ | hgnd B Δ | env B Δ | intensity luma Δ |
|---|---|---:|---:|---:|---:|---:|
| g01 | bottom | **−8.9** | **−12.5** | **0** | −30.0 | −28.0 |
| g05 | bottom | **−9.7** | **−13.8** | **0** | −32.5 | −31.1 |
| g07 | upper | −1.5 | −2.4 | +0.6 | −16.4 | −2.8 |
| g08 | bottom | −4.1 | **−9.1** | **0** | −21.2 | −11.5 |

Day-bottom remaining hemi occupancy is hemi.color (B −8.9/−9.7), not
groundColor (hgnd ≡ 0). Zeroing hemi.intensity is a superset (L2 −18.4/−20.7,
B −12.5/−13.8) because it also removes hemi presence. env cubemap hue stays
B −30.0/−32.5. Intensity occupies luma. Fill joins intensity on g08 night
(−12.4). setNight does not rebake. g07 upper remains ramps. Camera stays
7.4/1.92.

Local unique cases: 28 in `scripts/world-hterm.test.mjs`. Previous r6.64
expected 2,345 + 28 = 2,373. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
