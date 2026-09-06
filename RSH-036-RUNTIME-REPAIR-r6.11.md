# RSH-036 — r6.11 rendered ramp surface repair

Date: 6 September 2026. Base: `c3b87e0e598357f4a49168655a6e30cbbcf71412`.
This candidate is not accepted. Normal CI and original golden results are pending
until the later exact-head checkpoint;35/67 accepted,32 remain.

## AUD-20: specification mismatch, not reference-image rollback

`vehicle.ts:probeRamp` evaluates a horizontal rectangle of length `len`, width
`2*half`, and top plane `y0+(y1-y0)*(along/len+0.5)`. The old builder instead pitched
a centred box with depth `len`: projected run shortened to `len*cos(pitch)` and
the upper surface was displaced by half the rotated thickness. The strips used
the same incorrect transform. The minimum1.4 support height could exceed low decks.

Fresh box geometry is now sheared vertically, leaving horizontal vertices fixed.
Its upper plane matches the physics plane, including end faces; normals and bounds
are recomputed. All100 paint strips use the same slope with their underside on
the deck. Supports end at the slab underside, and are omitted below ground level.

This intentionally changes visible geometry. It does not change the50 ramp records,
locations, heading, horizontal dimensions, y0/y1, checkpoint fractions,546 colliders,
physics or driving parameters. Large crossing ramps are not silently relocated.

## Validation

20 helper regressions cover uphill/downhill/flat/steep surfaces, footprint,
thickness, strip contact, fresh bounds/normals and fail-closed invalid inputs.
The full supplementary local suite passed878 tests with0 failures/skips; local
TypeScript5.8.3 is not the locked remote dependency install. A real-builder Chromium
measurement checks50 actual meshes,750 downward ray probes,
100 actual edge strips and their sequential support columns. The same measurement
runs against the prior source as a negative control. Results are pending.

Historical source checks retain their original hashes. Only the exact verified
old builder bytes are a historical projection; a separate current-source guard
rejects rollback or drift. No prior acceptance record or original PNG is rewritten.

## Remaining gates

Exact-head normal CI and unchanged original-golden comparison must both be checked.
Three remote font dependencies remain unqualified. Existing32 scene diagnostic
captures and24 factorial captures remain historical, not evidence for this new mesh.
No freeze, merge, later unit, licence clearance or device qualification is claimed.
