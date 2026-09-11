# GFX-05 — Caesarea water/ground plane cuts through the road at אמת המים

Queued 11 September 2026. Owner screenshot `2026-09-11 17:53.01`
(`docs/evidence/gfx-05-caesarea-aqueduct-water-plane-2026-09-11-1753.png`).
Not remaining pixel 0/4. Not an Ayalon freeze item. Do not fix during RSH-036.

## Observed

- Track: `caesarea` (קיסריה)
- Mode: הקפה (`lap` / closed circuit). HUD `הקפה 1/3`
- Day. HUD clock `0:05.20`. Speed 1 km/h
- POI: אמת המים (Caesarea aqueduct)
- A large blue water/ocean plane is tilted steeply through the driving
  surface, filling the left half of the frame. A striped white-gray wedge
  (barrier / aqueduct / ramp) sits at a matching skew on the right. The Sabra
  is visible from chase-camera rear-3/4: boxy white body with a blue glass
  strip on the left side rather than the windshield. Minimap still shows the
  Caesarea oval.

## Distinct from GFX-01, GFX-03 and GFX-04

GFX-01 is namal at rest: GLB body vertical/origami vs Y-up procedural extras.
The Caesarea car look is the same family, but the new defect is the water /
ground plane cutting the road at אמת המים.
GFX-03 / GFX-04 are Ayalon night point-to-point camera clips at Kibbutz
Galuyot. This is a different track, day, lap 1, water-plane geometry.
r6.34 already proved hero-car bandDelta 0 on locked Ayalon g01/g05/g08 rest
poses, so this live Caesarea clip is not remaining 0/4.

## Queue

Fix after RSH-036, with GFX-01, GFX-03 and GFX-04, as a separate graphical
workstream. Do not retune `0xd0d4d8` / exposure 0.56, do not refresh golden
PNGs, do not merge, and do not treat a Caesarea water-plane or mesh-split
fix as freeze.
