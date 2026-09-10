# RSH-036 r6.21 — restore the original rest chase camera without distributing adapter drift

Candidate, 10 September 2026. Base ece282e4acdf95d5dc256122e54925d24e5d38ed
(r6.20 font URL pins). No merge or freeze; 35/67 accepted; 32 remain.
r6.17 and r6.18 exact-head failures are retained. Do not relabel them as passes.

## r6.20 exact-head CI independently verified

Required CI **34442339244**, job **102759811481**: SUCCESS on checkout
`ece282e4acdf95d5dc256122e54925d24e5d38ed` / tree
`415da9919de2a71ea93938563aa38647a40a8b80`. Downloaded archives:

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| required-ci-34442339244-1 (10138599101) | 2,467,149 | `db188f5ee77699818fdda3ca02e7d5c6c9a60e27c5971ea90b4c1c03d8551e30` |
| audit-source-34442339244-1 (10138381335) | 43,479,078 | `75b5d9df6b8c37a0740bab09f65d1b020e08fbc6aba023b65b1d1f1e43218868` |

Final `ci-summary.json` and TAP: **1,158/1,158**. Lint 124 warnings / 0 errors.
Runtime-recovery ramp supports: passed, failedRamps 0, maxProtrusion 0, 176 piers.
Audit `source-head.txt` is the product commit, not a synthetic merge. This is not
freeze or original-golden acceptance. Original golden remains 0/4 from
preparation 34324754353.

## AUD-31: original rest chase lock

`gotoGolden` plus `photo=false` means the four pixel-golden frames use the
gameplay chase camera. r6.8 attribution already measured the live rest pose
1.8 further and 0.36 higher than the 26 August lock. The 28 August pull-back
(`follow = 9.2`, `height = 2.28`) is still the accepted adapter identity.

The overlay restores live rest geometry to `7.4 + clamp(speed/22, 0, 2.2)` and
`height = 1.92`. `stripRsh036Overlay` restores accepted adapter SHA-256
`947ca69a89f12550a4ba5c631f2004598dec8849368a762b29ed9d681a2d7132`. The helper
is not added to the 85-path freeze list or the 58-file evolution set.

Local unique cases: 9 in `scripts/chase-camera.test.mjs`. Previous r6.20 suite
1,158 + 9 = 1,167 expected. Original golden, immutable CDN bytes, rendering
performance, mesh/complete-race clearance and freeze remain open.
