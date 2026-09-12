# RSH-036 r7.18 — Rothschild night: no sparkle belt in the sky

Candidate, 12 September 2026. Base `0427341` (r7.17).
No merge or freeze; 35/67 accepted; 32 remain. `freeze_granted=false`.
No PNG refresh, no RSH-037 queue activation.

Owner screenshot (2026-09-12 3:04.19): Rothschild night, 2 km/h, car
against a jersey, a dotted white line flickering into the moon.

## Cause

Lane dashes (up to 2800) and cat's eyes used `MeshBasicMaterial` with
`fog: false`. On a long boulevard they stack at the vanishing point
and z-fight every frame.

## Repair

| item | change |
|---|---|
| dashes / edge / yellow | StandardMaterial + fog + emissive |
| cat's eyes | highway/ayalon only, fewer, with fog |
| jersey caps | StandardMaterial |

ayalon.ts untouched.

## Live (Rothschild night)

Spawn 24 km/h onTrack. Mid 19 km/h at Sheinkin. Road and lamps in
frame; no sparkle belt.
