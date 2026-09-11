# GFX-04 — Ayalon night point-to-point camera clips into retaining wall

Queued 11 September 2026. Owner screenshot `2026-09-11 17:51.46`
(`docs/evidence/gfx-04-ayalon-night-p2p-wall-camera-2026-09-11-1751.png`).
Not remaining pixel 0/4. Not an Ayalon freeze item. Do not fix during RSH-036.

## Observed

- Track: `ayalon` (נתיבי איילון)
- Mode: נקודה לנקודה (`pointToPoint` / `trackDef.open`)
- Night. HUD clock `0:25.66`. Speed 1 km/h. Checkpoint 1
- POI: קיבוץ גלויות
- Chase camera sits inside / through a highway retaining wall. A large gray
  slab fills the left half of the frame; the Sabra is visible from a steep
  top-down angle on the right. Body appears split into two white chunks, the
  blue windshield sits as a detached diamond, wheels are offset. Minimap still
  shows Ayalon.

## Distinct from GFX-01 and GFX-03

GFX-01 is namal at rest: GLB body vertical/origami vs Y-up procedural extras.
GFX-03 is the same Ayalon night P2P at Kibbutz Galuyot two seconds in
(t=0:02.64, 2 km/h) with the chase camera through the Sabra so a gray car
panel fills the frame.
GFX-04 is 23 seconds later at the same POI: camera through Ayalon
infrastructure (retaining wall), car visible but exploded-looking from above.
r6.34 already proved hero-car bandDelta 0 on locked Ayalon g01/g05/g08 rest
poses, so this live P2P clip is not remaining 0/4.

## Queue

Fix after RSH-036, with GFX-01 and GFX-03, as a separate graphical workstream.
Do not retune `0xd0d4d8` / exposure 0.56, do not refresh golden PNGs, do not
merge, and do not treat a camera-clip or mesh-split fix as freeze.
