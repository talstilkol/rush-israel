# RSH-036 r7.22 — Jerusalem night: one car, no chevron in the moon

Candidate, 12 September 2026. Base `5b35982` (r7.21).
No merge or freeze; 35/67 accepted; 32 remain. `freeze_granted=false`.
No PNG refresh, no RSH-037 queue activation.

Owner screenshot (2026-09-12 3:05.10): Mahane Yehuda night, 1 km/h,
two identical Sabras side by side, a white Z flickering in the sky.

## Cause

`placeGrid` spawned AI at the same progress as the player, 2.2 m
laterally. Lane-arrow chevrons were unfogged `MeshBasicMaterial`
double-sided planes that stood up at grazing angles.

## Repair

| item | change |
|---|---|
| grid | player at 2% center; AI from 12% onward |
| chevrons | ayalon/hw1/hw2/hw6 only, StandardMaterial |

## Live (Jerusalem night)

16 km/h onTrack, one car, Mahane Yehuda, lamps and hills, no sparkle belt.
