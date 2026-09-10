# RSH-036 r6.22 — complete Ayalon arcade lap is not a 1s sampled drive

Candidate, 10 September 2026. Base cc7c017548a3f29e6b3326cff7d0e50431f58c43
(r6.21 rest chase 7.4/1.92). No merge or freeze; 35/67 accepted; 32 remain.
r6.17 and r6.18 exact-head failures are retained. Do not relabel them as passes.

## r6.21 exact-head CI independently verified

Required CI **34445990921**, job **102770784283**: SUCCESS on checkout
`cc7c017548a3f29e6b3326cff7d0e50431f58c43` / tree
`89958d495b24585b36a8320ad22898730bc2419c`. Downloaded archives:

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| required-ci-34445990921-1 (10139930417) | 2,360,102 | `082b53b7d04174db52cce0a05e4dc3f6a7c37dad66ad8982b74d8a7bbf1a9d19` |
| audit-source-34445990921-1 (10139658302) | 43,482,692 | `c1b494740b9667ff509780171681c2dbbba08eb174106dd650e3ae453fcd8808` |

Final `ci-summary.json` and TAP: **1,167/1,167**. Lint 124 warnings / 0 errors.
Runtime-recovery ramp supports: passed, failedRamps 0, maxProtrusion 0, 176 piers.
Audit `source-head.txt` is the product commit. This is not freeze or
original-golden acceptance. Original golden remains 0/4 from preparation
34324754353.

## AUD-32: complete-race arcade clearance

r6.17 sampled rest poses and a 120-step / 1.62 m centerline drive. That is not a
lap. The 1s evidence must fail closed as complete-race qualification.

The new probe drives the live Ayalon catalogue with production `aiInput`,
`ArcadeCar.step` at 120 Hz and `consumeCheckpoints`. Success requires
lapComplete, progress ≥ 0.96, lastCheckpoint 7, 0 burials, 0 respawns and a
step count above 120. The 8-corner envelope, 1.6 rest pose and 1.05 radius stay.
This is still not a render-mesh.

Local unique cases: 18 in `scripts/complete-race.test.mjs`. Previous r6.21 suite
1,167 + 18 = 1,185 expected. A live 722-collider probe completed in 10,595
steps (progress 0.960, lastCheckpoint 7, buried 0, respawns 0). Original golden,
immutable CDN bytes, rendering performance, mesh clearance and freeze remain
open.
