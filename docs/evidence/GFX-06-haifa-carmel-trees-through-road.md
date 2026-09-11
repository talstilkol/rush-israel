# GFX-06 — Carmel Descent trees poke through the road at הגנים הבהאיים

Queued 11 September 2026. Owner screenshots `2026-09-11 17:53.40` and
`2026-09-11 17:54.15`
(`docs/evidence/gfx-06-haifa-carmel-trees-through-road-2026-09-11-1753.png`,
`docs/evidence/gfx-06-haifa-carmel-trees-through-road-2026-09-11-1754.png`).
Not remaining pixel 0/4. Not an Ayalon freeze item. Do not fix during RSH-036.

## Observed

- Track: `haifa` (ירידת הכרמל / Carmel Descent). Theme `carmel`. `open: true`
- Mode: נקודה לנקודה (`pointToPoint`)
- Day. HUD clocks `0:04.25` (11 km/h) and `0:39.59` (1 km/h)
- POI: הגנים הבהאיים (Baháʼí Gardens)
- Pine-tree meshes poke through the driving surface so the road is hidden
  under canopies. The Sabra floats above the gray ribbon with trees rising
  through the chassis. A green tree block sits on the lane. At t=0:39.59 the
  HUD toasts `חזור לכביש · עקוב אחרי החצים`. Car body is boxy with a blue
  glass strip on the side (GFX-01 family). Minimap still shows Carmel Descent.

## Distinct from GFX-01 and GFX-05

GFX-01 is namal at rest: GLB body vertical/origami vs Y-up procedural extras.
The Carmel car look is the same family, but the new defect is vegetation
intersecting the road so the driving surface is not visible.
GFX-05 is Caesarea water/ground plane at אמת המים. This is a different
track, P2P, trees-through-road.
r6.34 already proved hero-car bandDelta 0 on locked Ayalon g01/g05/g08 rest
poses, so this live Carmel clip is not remaining 0/4.

## Queue

Fix after RSH-036, with GFX-01, GFX-03, GFX-04 and GFX-05, as a separate
graphical workstream. Do not retune `0xd0d4d8` / exposure 0.56, do not
refresh golden PNGs, do not merge, and do not treat a Carmel tree-through-road
or mesh-split fix as freeze.
