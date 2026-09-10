# RSH-036 r6.24 — non-authority capture is not original-golden comparison

Candidate, 10 September 2026. Base 369dfe7a73bc225750d78c29497d90878960c930
(r6.23 visual-mesh clearance). No merge or freeze; 35/67 accepted; 32 remain.
r6.17 and r6.18 exact-head failures are retained. Do not relabel them as passes.

## r6.22 and r6.23 exact-head CI independently verified

Required CI **34449950487**, job **102783181653**: SUCCESS on checkout
`cfcb99008be1aa1e8c3296e97c40d15ec46c059b` / tree
`545cc5c1b61a1e25a81e89273899bb4d96935d68`. Downloaded archives:

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| required-ci-34449950487-1 (10141424356) | 2,359,317 | `2791631d7c1d06ef1ea192319dd98b609de862937f8f5e2b46d8fcbb918fd4ca` |
| audit-source-34449950487-1 (10141120370) | 43,488,847 | `f54ad7db19f486cf2cf61f4b298e97cda9df01a870c32f04d8ed2e4546c68a70` |

Final `ci-summary.json` and TAP: **1,185/1,185**. Lint 124 warnings / 0 errors.

Required CI **34452081855**, job **102789874804**: SUCCESS on checkout
`369dfe7a73bc225750d78c29497d90878960c930` / tree
`af3fb764560d8a21a7577ea8810c91ef740a3f0b`. Downloaded archives:

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| required-ci-34452081855-1 (10142278450) | 2,375,954 | `1ed0edf10d94cb6b466b7271e9d12828c8725008f83f464be781652abcb31522` |
| audit-source-34452081855-1 (10141940592) | 43,497,446 | `9b225f3ee233dd775eeb0cdcc5faef8d6b781ee05262f7a76cab36f2858537b3` |

Final `ci-summary.json` and TAP: **1,206/1,206**. Mesh-clearance live hits 0.
Audit `source-head.txt` is the product commit. This is not freeze or
original-golden acceptance.

## AUD-34: original golden protocol after the chase restore

Required-ci `capture-golden.mjs` writes four frames with `authority: false` and
`comparisons: 0`. That is not original-golden. The 0/4 cited from preparation
34324754353 predates r6.21. PNG bytes last changed at `b0e3e52` (26 August
12:00:42Z) while chase was still 7.4/1.92. Kibbutz Galuyot spaghetti ramps
landed 85 minutes later; the 28 August pull-back to 9.2/2.28 is restored.

The new probe runs the unchanged `pixel-golden` protocol: `gotoGolden`,
`photo=false`, 1280×800, threshold 0.12, fail 8%. Live comparison after the
camera restore: **0/4**. Mismatch 61.58 / 50.56 / 31.22 / 64.73%. PNG refresh,
threshold drift and skipped comparison fail closed. Pixel failure is recorded
and is not a required-ci blocker. Generation 11 and freeze path count 85 stay.

Local unique cases: 23 in `scripts/original-golden.test.mjs`. Previous r6.23
expected 1,206 + 23 = 1,229. Immutable CDN bytes, rendering performance and
freeze remain open.
