# RSH-036 — r6.10 road material lifecycle repair

Date: 2026-09-06. Base: `6d2f814bf057a22a95063c81845798829f0ca22a`. Main remains `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a`.
35/67 accepted; RSH-036 unaccepted; 32 remaining. No merge, freeze or RSH-037 activation.

## Reproduced defect — AUD-19
The shader hook originally allocated a new zero-valued `uWet` cell each compilation.
World look selection before compilation could not set a missing cell. A later
compilation discarded the value, and cached variants retained different cells.
The previous hook was also called without its material `this` receiver.
The identical 12 regression tests gave 3 passes / 9 failures before repair and
12 passes after repair. These are tests, not nine distinct product defects.

The minimal runtime patch owns one wetness cell before the first compilation,
reuses it in all program uniforms, retains it across CSM hook rebinding, and
calls the preceding compiler with the material receiver and original arguments.
Lane shader formulas and all canonical weather/look values remain unchanged.
Existing two road-shader tests pass. The full local suite passed 854/854
with TypeScript 5.8.3 (not the locked remote installation). No renderer, geometry, driving, typography,
asset binaries or original PNGs are reverted or replaced.

## Validation scope
Two new browser cases exercise real WebGL program uploads and return to cached
programs, then the actual Ayalon road through five weather/day-night states.
At preparation of this document, locked full CI and these browser cases are
pending. Later exact-head CI evidence must be read from the PR checkpoint.
A successful normal CI does not override the separate original golden gate.

## Controlled scene diagnosis
A separate read-only experiment uses the verified r6.9 runtime and exact
historical source/assets with the common measured current camera. It captures
native, neutral illumination, opaque normal override and restored-native frames.
Neutral illumination combines light/environment/fog/exposure normalization.
Normal override removes textures, transparency and original sidedness, so it is
a diagnostic geometry control, not a product look or the original capture recipe.
Read-only run 34014788613 completed: all 32 PNG hashes were verified, including
eight byte-identical restored controls, with zero position/tick changes or GL/page
errors. The reviewed counts and limitations are retained in
`RSH-036-SCENE-CONTROLS-r6.10.json`. This diagnostic uses the prior r6.9 runtime,
not the repaired road shader; it does not validate the new shader or original PNG parity.
No diagnostic image can become a baseline or authorize gameplay rollback.

## Plan and remaining work
The master plan retains all 67 units and 42 legacy findings; AUD-19 is added
for this reproduced material defect (19 audit items; six existing repair bundles).
Three mutable font references remain unqualified. No font files are distributed.
Complete original-golden attribution, semantic geometry/art review, immutable
font dependency policy and actual freeze acceptance remain open. Any reference
transition needs separate explicit owner approval and provenance. Original PNGs,
threshold 0.12, failure limit 8%, generation-11 lock and historical approval stay unchanged.
All 13 release gates remain open; 66 asset licences remain unverified.
