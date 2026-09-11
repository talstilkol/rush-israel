# GFX-07 — Jerusalem Mahane Yehuda origami car, steep camera, cannot drive forward

Queued 11 September 2026. Owner screenshot `2026-09-11 17:55.22`
(`docs/evidence/gfx-07-jerusalem-mahane-yehuda-origami-2026-09-11-1755.png`).
Owner also reports that forward driving does not work at all.
Not remaining pixel 0/4. Not an Ayalon freeze item. Do not fix during RSH-036.

## Observed

- Track: `jerusalem` (ירושלים · שער יפו). Theme `stone`. `open: true`
- Mode: נקודה לנקודה (`pointToPoint`)
- Day. HUD clock `0:04.59`. Speed 1 km/h
- POI: מחנה יהודה (Mahane Yehuda)
- The Version 1 Sabra body renders as a folded origami wedge (GFX-01 family)
  with a blue glass strip. Chase camera sits steep / beside the body so sky
  fills most of the frame and the road is a dark slab in the lower third.
  Minimap still shows the Jerusalem A→B ribbon. After 4.59s the car is at
  1 km/h; the owner reports forward throttle does not drive the car.

## Distinct from GFX-01 and GFX-03–GFX-06

GFX-01 is namal at rest: GLB body vertical/origami vs Y-up procedural extras.
The Jerusalem car look is the same family, but this clip is a different
track, point-to-point, at מחנה יהודה, with a steep chase camera and a
forward-drive failure.
GFX-03 / GFX-04 are Ayalon night P2P camera clips at Kibbutz Galuyot.
GFX-05 is Caesarea water/ground plane. GFX-06 is Haifa trees-through-road.
r6.34 already proved hero-car bandDelta 0 on locked Ayalon g01/g05/g08 rest
poses, so this live Jerusalem clip is not remaining 0/4.

## Queue

Fix after RSH-036, with GFX-01, GFX-03, GFX-04, GFX-05 and GFX-06, as a
separate graphical / driving workstream. Do not retune `0xd0d4d8` /
exposure 0.56, do not refresh golden PNGs, do not merge, and do not treat a
Jerusalem origami, camera, or forward-drive fix as freeze.
