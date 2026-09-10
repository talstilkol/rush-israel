# RSH-036 r6.33 — dominant 200px band is not world-layer slice attribution

Candidate, 10 September 2026. Base c8b17f9ef80d9169330d3c0a2b740679a3bca0aa
(r6.32 column isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.32 exact-head CI was in progress at preparation and is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-43: dominant 200px band is not world-layer slice attribution

r6.32 reported full-width bottom mismatch on g01/g05/g08 (83–92%) and upper-band
sides on g07 (79% vs centre 42%). A 320px column is not which named world layer
occupies that band. The new probe hides each residual layer, recaptures product
present, and pixelmatches the dominant 200px band at threshold 0.12. Column-only
reports, missing dominantLayer, PNG refresh and treating this probe as
original-golden fail closed. Smoke keeps `verifyWorldLayers`,
`verifyWorldResidual`, `verifyWorldMismatch`, `verifyWorldBias`,
`verifyWorldScene`, `verifyWorldRegion`, `verifyWorldColumn` and
`verifyWorldSlice`.

Live present slice of the dominant band after rest chase 7.4/1.92:

| pose | presentPct | band | rampsΔ | groundΔ | residualΔ | dominantLayer | contributingSlice |
|---|---:|---|---:|---:|---:|---|---|
| g01 | 0.6926 | bottom | 0 | +0.1047 | 0 | carriageway | none |
| g05 | 0.5940 | bottom | 0 | +0.1313 | 0 | carriageway | none |
| g07 | 0.2933 | upper | −0.1885 | −0.0038 | −0.0174 | ramps | ramps |
| g08 | 0.7016 | bottom | 0 | +0.1158 | 0 | carriageway | none |

g01/g05/g08 bottom is not a named residual layer: no hide reduces the 85–88%
band, and hiding ground makes it worse (+10–13%), so the ground plane is closer
to the locked PNG than what replaces it. g07 upper is the inverse: hiding 150
ramp meshes drops the band 18.85 points (0.6045 → 0.4160). Camera stays
7.4/1.92. PNG refresh remains forbidden.

Local unique cases: 28 in `scripts/world-slice.test.mjs`. Previous r6.32
expected 1,449 + 28 = 1,477. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
