# GFX-08 — Namal dual cars and stacked multi-dimension roads

Queued 11 September 2026. Owner screenshots `2026-09-11 17:35.28` and
`17:35.35`
(`docs/evidence/gfx-08-namal-dual-car-stacked-roads-2026-09-11-1735.png`,
`docs/evidence/gfx-08-namal-dual-car-stacked-roads-2026-09-11-1735b.png`).
Owner reports two cars appearing and multiple roads in multiple dimensions.
Not remaining pixel 0/4. Not an Ayalon freeze item. Do not fix during RSH-036.

## Observed

- Track: `namal` (צפון תל אביב / Tel Aviv Port). HUD POI נמל תל אביב
- Mode: הקפה 1/3 (lap)
- Day. HUD clocks `0:40.10` at 13 km/h and `0:47.69` at 1 km/h
- Reading power-station chimneys and trees are visible. A giant cyan arc /
  bar overlays the scene (likely a 3D spline / gate / road mesh in the
  wrong orientation). The driving surface looks flooded: lane marks sit on
  a water-like plane with reflections. The Version 1 Sabra is origami
  (GFX-01 family) and floats. Owner reports two cars and stacked roads in
  more than one dimension.

## Distinct from GFX-01 and GFX-03–GFX-07

GFX-01 is the same namal track at rest (0 km/h): GLB body vertical/origami
vs Y-up procedural extras. This clip is mid-lap with additional occupancy:
duplicate cars and overlapping / wrongly-oriented road meshes plus a water
plane through the carriageway (GFX-05 family, different track).
GFX-03 / GFX-04 are Ayalon night P2P camera clips.
GFX-06 is Haifa trees-through-road. GFX-07 is Jerusalem P2P origami +
forward-drive failure.
r6.34 already proved hero-car bandDelta 0 on locked Ayalon g01/g05/g08 rest
poses, so this live namal lap clip is not remaining 0/4.

## Queue

Fix after RSH-036, with GFX-01, GFX-03, GFX-04, GFX-05, GFX-06 and GFX-07,
as a separate graphical workstream. Do not retune `0xd0d4d8` / exposure
0.56, do not refresh golden PNGs, do not merge, and do not treat a namal
dual-car or stacked-road fix as freeze.
