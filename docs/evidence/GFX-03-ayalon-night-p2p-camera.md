# GFX-03 — Ayalon night point-to-point camera clips through hero-car

Queued 11 September 2026. Owner screenshot `2026-09-11 17:51`
(`docs/evidence/gfx-03-ayalon-night-p2p-camera-2026-09-11-1751.png`).
Not remaining pixel 0/4. Not an Ayalon freeze item. Do not fix during RSH-036.

## Observed

- Track: `ayalon` (נתיבי איילון)
- Mode: נקודה לנקודה (`pointToPoint` / `trackDef.open`)
- Night. HUD clock `0:02.64`. Speed 2 km/h
- POI: קיבוץ גלויות. Landmark: ההגנה / HaHagana overhead sign
- Chase camera sits inside / through the Sabra body. A large gray panel fills
  the frame; a black window/roof strip cuts diagonally; the road and yellow
  curb appear at a steep angle on the right. Minimap still shows Ayalon.

## Distinct from GFX-01

GFX-01 is namal at rest: GLB body vertical/origami vs Y-up procedural extras.
GFX-03 is Ayalon night, two seconds into point-to-point, camera through mesh
at Kibbutz Galuyot / HaHagana. r6.34 already proved hero-car bandDelta 0 on
locked Ayalon g01/g05/g08 rest poses, so this live P2P clip is not remaining
0/4.

## Queue

Fix after RSH-036, with GFX-01, as a separate graphical workstream. Do not
retune `0xd0d4d8` / exposure 0.56, do not refresh golden PNGs, do not merge,
and do not treat a camera-clip fix as freeze.
