# GFX-09 — Old Jaffa clock tower flickering track, missing road, cannot drive forward

Queued 11 September 2026. Owner screenshot `2026-09-11 22:55.30`
(`docs/evidence/gfx-09-oldjaffa-clock-tower-flicker-2026-09-11-2255.png`).
Owner reports the track flickers constantly, the road is not visible, and
forward driving does not work. Not remaining pixel 0/4. Not an Ayalon freeze
item. Do not fix during RSH-036.

## Observed

- Track: `oldjaffa` (יפו העתיקה / Jaffa). Theme stone / sea. HUD POI
  מגדל השעון · מגדל השעון (Jaffa Clock Tower)
- Mode: הקפה 1/3 (`lap`)
- Day. HUD clock `0:09.40`. Speed 0 km/h
- HUD toast: `חזור לכביש · עקוב אחרי החצים` (Return to the road · Follow
  the arrows)
- The Version 1 Sabra body is a boxy origami wedge (GFX-01 family) with a
  blue glass strip. Chase camera sits steep / downhill so sky fills most of
  the frame. The carriageway is a black slab; red/white barrier stripes and
  a blue plane cut through the driving surface. Minimap still shows the
  Jaffa oval. After 9.40s the car is at 0 km/h.
- Owner reports the track **flickers constantly** (not capturable in a
  still) and that the road is missing so forward throttle cannot advance.

## Distinct from GFX-01 and GFX-03–GFX-08

GFX-01 is namal at rest: GLB body vertical/origami vs Y-up procedural extras.
The Jaffa car look is the same family, but this clip is a different track
(oldjaffa / Clock Tower), lap mode, with a flickering world, missing road,
off-road toast, and a forward-drive failure.
GFX-03 / GFX-04 are Ayalon night P2P camera clips.
GFX-05 is Caesarea water/ground plane. GFX-06 is Haifa trees-through-road.
GFX-07 is Jerusalem P2P origami + cannot-drive-forward at Mahane Yehuda.
GFX-08 is namal dual cars + stacked roads.
r6.34 already proved hero-car bandDelta 0 on locked Ayalon g01/g05/g08 rest
poses, so this live Jaffa lap clip is not remaining 0/4.

## Queue

Fix after RSH-036, with GFX-01, GFX-03, GFX-04, GFX-05, GFX-06, GFX-07 and
GFX-08, as a separate graphical / driving workstream. Do not retune
`0xd0d4d8` / exposure 0.56, do not refresh golden PNGs, do not merge, and
do not treat a Jaffa flicker, missing-road, or forward-drive fix as freeze.
