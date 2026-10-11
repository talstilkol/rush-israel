# Progress — honest

Branch `agent/playable-session`. Not a release.

Also on this branch:
- Ayalon still places the road-edge barriers from the locked recipe: step along the spline, 1.55 m outside half the width, radii 0.62 and 1.05. `world.ts` passes those numbers into `roadEdgeBarriers`, which still drops a barrier that would sit in the driving line. The Ayalon collider check passes again: 50 ramps, 8 checkpoints.
- Other source-hash locks still fail because driving, input, HUD, audio, and the lane-arrow fallback changed those files. Those pins were not rewritten. A full `npm test` was stopped while a 30-minute soak was starting. It is not a pass.

Not done: the remaining hash locks, browser `qa:drive`, devices, Alpha through release.
