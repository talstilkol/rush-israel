# RSH-036 r7.12 — Jerusalem Jaffa Gate day: road and stone, not flickering sky

Candidate, 12 September 2026. Base `c01d68f` (r7.11).
No merge or freeze; 35/67 accepted; 32 remain. Pixel leftover g07
0.2027 unchanged. `freeze_granted=false`. No PNG refresh, no RSH-037
queue activation.

Owner screenshot (2026-09-11 22:57.26): Mahane Yehuda DAY, 0 km/h,
off-track banner, chase cam in blue sky, origami car on a cliff.

## Cause

Linear drop `36 - t*82` is a cliff. Slope walls were only +8 m so the
camera looked into sky. Off-track damping killed speed with no pull back.

## Repair

| item | change |
|---|---|
| elevation | smooth pow descent, then olives climb |
| stone slope | outer 200, mountainY +52 (jerusalem/scopus too) |
| off-track | pull velocity back toward the ribbon |
| camera | off-track looks at the nearest road sample |

Ayalon unchanged.

## Live (Jerusalem day)

Spawn 23 km/h y=33 onTrack. Jaffa St 21 km/h y=20. Gate 15 km/h y=5.7.
Road + stone buildings in frame. No off-track banner.
