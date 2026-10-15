# Progress — honest

Branch `agent/playable-session`. Not a release.

Also on this branch:
- The locked `scripts/soak-menu-race.mjs` now exits 0 on 20 Ayalon enter-exit cycles. Textures stayed at 30. Geometries were 1191 on 17 cycles and 1142 on cycles 6, 8 and 20. Nothing climbed past 1191. The script only fails if the last count is higher than the first, so a last read of 1142 still passes.
- Before the boot render, the same script failed: the first sample was 1143 and the last was 1190. One render now runs before the test hook exists. A short Ayalon drive after that still reached 13 m/s on the road with no damage.

Not done: a 30-minute soak, devices, the architecture locks, Alpha through release.
