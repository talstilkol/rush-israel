# GFX-10 — Namal / South Tel Aviv flickering track, flooded water, origami car

Queued 12 September 2026. Owner screenshot `2026-09-11 22:56.51`
(`docs/evidence/gfx-10-namal-south-ta-flicker-2026-09-11-2256.png`).
Owner reports the South Tel Aviv (דרום ת״א / `namal`) route flickers
constantly. Not remaining pixel 0/4. Not an Ayalon freeze item. Do not
fix during RSH-036.

## Observed

- Track: `namal` (נמל תל אביב / Tel Aviv Port, HUD label נמל תל אביב)
- Mode: הקפה 1/3 (`lap`)
- Day. HUD clock `0:06.31`. Speed 10 km/h. Lap 1/3
- The carriageway is not visible. A large coastal water plane fills the
  frame (GFX-05 / GFX-08 family). White pole/barrier sticks cut through
  the water. The Version 1 Sabra body is a boxy origami wedge with a
  blue glass strip (GFX-01 family), sitting on / in the water rather than
  on asphalt.
- Minimap still draws the Namal loop. After 6.31s the car is at 10 km/h
  so throttle registers, but the driving surface is the water plane.
- Owner reports the track **flickers constantly** (not capturable in a
  still) — the same live symptom as GFX-09 on Old Jaffa, now on Namal.

## Distinct from GFX-01 and GFX-03–GFX-09

GFX-01 is namal at rest: GLB body vertical/origami vs Y-up procedural extras.
This clip is the same track and the same origami family, but it is a
moving lap (10 km/h) with a flooded water plane, missing road, and a
flickering world.
GFX-08 is namal dual cars + stacked multi-dimension roads / water / cyan
spline at t=0:40.10 and 0:47.69. This clip is earlier (t=0:06.31) with
flicker as the owner-reported defect.
GFX-09 is Old Jaffa Clock Tower flicker + missing road + cannot drive
forward. Same flicker class, different track.
GFX-05 is Caesarea water/ground plane. r6.34 already proved hero-car
bandDelta 0 on locked Ayalon g01/g05/g08 rest poses, so this live Namal
lap clip is not remaining 0/4.

## Queue

Fix after RSH-036, with GFX-01, GFX-03, GFX-04, GFX-05, GFX-06, GFX-07,
GFX-08 and GFX-09, as a separate graphical / driving workstream. Do not
retune `0xd0d4d8` / exposure 0.56, do not refresh golden PNGs, do not
merge, and do not treat a Namal flicker, flooded-water, or origami-car
fix as freeze.
