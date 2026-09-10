# RSH-036 r6.23 — arcade circle/box is not visual-mesh clearance

Candidate, 10 September 2026. Base cfcb99008be1aa1e8c3296e97c40d15ec46c059b
(r6.22 complete arcade lap). No merge or freeze; 35/67 accepted; 32 remain.
r6.17 and r6.18 exact-head failures are retained. Do not relabel them as passes.

## AUD-33: visual-mesh Ayalon clearance

The 1.05-radius arcade circle and 1.25×1.05×1.6 box are not the render-mesh.
Live car-mesh layout is 4.08–4.82 m long (half-length 2.17–2.54). Muscle and
super mirrors sit just outside the 1.05 radius. A 0.4-radius pole 1.6 m ahead
is missed by the arcade circle and intersects every visual hull.

The new probe uses that hull against the live 722-collider catalogue. Rest
poses (five-car grid, 781 centerline, ±2.2 lanes) and 160 yawed samples from a
2,400-step AI drive reported 0 visual hits, 0 burials and 0 respawns. 1s
arcade evidence fails closed as mesh qualification. The 8-corner envelope,
1.6 rest pose and 1.05 radius stay. This is still not original-golden or freeze.

Local unique cases: 21 in `scripts/mesh-clearance.test.mjs`. Previous r6.22
expected 1,185 + 21 = 1,206. Original golden, immutable CDN bytes, rendering
performance and freeze remain open.
