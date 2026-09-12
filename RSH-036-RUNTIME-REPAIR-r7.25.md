# RSH-036 r7.25 — Dead Sea night: no foam sparkle on the water

Candidate, 12 September 2026. Base `b5f71d7` (r7.24).
No merge or freeze; 35/67 accepted; 32 remain. `freeze_granted=false`.
No PNG refresh, no RSH-037 queue activation.

Owner screenshot (2026-09-11 23:01.40): Ein Bokek night, 61 km/h, white
dots flickering on pitch-black water.

Foam used unfogged `MeshBasicMaterial` over the lake. Skip foam on
desert/deadsea and at night. Night water 0.82 not 0.65. Width 20→26,
water 320×700 → 200×240.

## Live (Dead Sea night)

21/19 km/h onTrack. Teal water left of the ribbon, no sparkle belt.
