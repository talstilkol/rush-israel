# RSH-036 r6.36 — ground+daylight co-occupancy is not map/color/roughness or hemi/dir/fill/ambient/background

Candidate, 10 September 2026. Base 5304182ceae78b8d4ea0b4726c09e0dafc28a033
(r6.35 material isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.35 exact-head CI was in progress at preparation and is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-46: ground+daylight co-occupancy is not a single ground channel or light

r6.35 reported ground and daylight co-occupy g01/g05/g08 bottom. Combined
isolation is not which channel. The new probe isolates map, color, roughness,
hemi, dir, fill, ambient and background independently *after* setNight, then
pixelmatches the dominant 200px band at threshold 0.12. Material-only reports,
missing dominantFactor, PNG refresh and treating this probe as original-golden
fail closed. Smoke keeps `verifyWorldLayers` through `verifyWorldMaterial` and
`verifyWorldFactor`.

Live present factors of the dominant band after rest chase 7.4/1.92
(map/color/roughness 1, hemi 1, dir 2, fill 1, ambient 1, background 2):

| pose | band | mapΔ | colorΔ | roughnessΔ | hemiΔ | dirΔ | fillΔ | ambientΔ | bgΔ | contributing |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| g01 | bottom | +0.1043 | −0.7760 | +0.0013 | +0.0026 | +0.0039 | −0.0036 | −0.0019 | 0 | color |
| g05 | bottom | +0.1310 | −0.8503 | +0.0008 | −0.0022 | +0.0012 | −0.0040 | −0.0022 | 0 | color |
| g07 | upper | +0.0046 | +0.0014 | −0.0035 | −0.0070 | −0.0125 | −0.0021 | −0.0014 | 0 | none |
| g08 | bottom | +0.1155 | −0.8780 | +0.0012 | −0.0395 | −0.0488 | −0.0423 | −0.0057 | 0 | color, hemi, dir, fill |

g01/g05/g08 bottom is ground-plane color (`0xd0d4d8`). Black albedo drops
mismatch 77.6/85.0/87.8 points. Nulling the map increases mismatch, so the
texture helps. Roughness and daytime lights are not independent drivers; the
r6.35 daylight delta was the ground going dark when lights went off. g07 upper
remains ramps. Camera stays 7.4/1.92. PNG refresh remains forbidden.

Local unique cases: 28 in `scripts/world-factor.test.mjs`. Previous r6.35
expected 1,533 + 28 = 1,561. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
