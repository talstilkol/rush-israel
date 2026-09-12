# RSH-036 r7.16 — Ayalon: kill the wet-road mirror; keep the car upright

Candidate, 12 September 2026. Base `de7fdf5` (r7.15).
No merge or freeze; 35/67 accepted; 32 remain. `freeze_granted=false`.
No PNG refresh, no RSH-037 queue activation.

Owner screenshot (2026-09-11 23:56.02): Kibbutz Galuyot, 1 km/h,
car on its side, white bars in blue rain, "where do I drive?"

## Cause

The 42×80 planar Reflector sat 3 cm above the dual carriageway and
z-fought every frame. Visual pitch ±0.75 rad laid the car on its side.
Rain fog 0.0032 hid the lane lines.

## Repair

| item | change |
|---|---|
| reflector | removed on Ayalon too (followMirror no-op) |
| pitch | clamp ±0.22 rad |
| rain/storm fog | 0.0011 / 0.002 |
| chase look | 45% of grade, not full |

ayalon.ts untouched. Pixel leftover g07 will move on the next occupancy
run; still not a grant.

## Live (Ayalon day, clear)

Spawn 23 km/h onTrack pitch 0. Mid 21 km/h at Hashalom. Dual
carriageway and lane lines readable. Car upright.
