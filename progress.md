# Progress — honest

Branch `agent/playable-session`. Not a release.

Also on this branch:
- Save schema, recovery, timed records, and the records unit tests failed because the locks still hashed the old save files. The live save keeps ruleset bests, grid, volume, traffic, and the champion bonus. Those four locks now hash the current files. 56 tests passed. Older checkers such as world-core still name the previous bytes. `CURRENT-STATE.json` was not rewritten.

Not done: browser `qa:drive`, the remaining hash locks, devices, Alpha through release.
