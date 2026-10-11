# Progress — honest

Branch `agent/playable-session`. Not a release.

Fixed on this branch, not driven in a browser:
- TypeScript: sky imports and `HudState.cash` (typecheck clean).
- Ramon elevation no longer returns NaN at t = 0.9.
- Ayalon canal water no longer reads a missing body color on day/night/weather.
- Colliders stay on their meshes. The branch had shoved them toward the road; that was the 200 m damage regression.
- Quick race, daily, weekly, career, and engine start use the eight V1 tracks. Lesson 1 is Ayalon. 16 career events. Deferred tracks stay in the data and off the launch list.

Not done: browser `qa:drive`, the 60 contract failures, device proof, signed release.
