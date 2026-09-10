# RSH-036 r6.26 — catalogue counts are not pixel-layer attribution

Candidate, 10 September 2026. Base d02e110baa4e3b74976d0b7ad1e0576faa431953
(r6.24 original-golden protocol; r6.25 rest-camera attribution uncommitted with
this head). No merge or freeze; 35/67 accepted; 32 remain. r6.17 and r6.18
exact-head failures are retained. Do not relabel them as passes.

## r6.24 exact-head CI independently recorded

Required CI **34454517944**, job **102797680687**: SUCCESS on checkout
`d02e110baa4e3b74976d0b7ad1e0576faa431953` / tree
`5c0b7667e8775f04c67b62285a78d9805b473f23`. Artifact required-ci-34454517944-1
SHA-256 `b7034f320d86317ef571953e2f9934e9d1ed8a9dffc9ec6c3d8ff4e7b8c20594`;
audit-source-34454517944-1 SHA-256
`02e9bf36f7a3c67dc8da35eaf3233fc2d440634a2510355c2fc1d7446ab8a218`.
This is not freeze or original-golden acceptance.

## AUD-36: catalogue 50/722 is not a pixel-layer proof

r6.25 attributed remaining original-golden 0/4 to world catalogue (50 ramps /
722 colliders vs historical 32/541). Catalogue counts have no per-pixel layer
samples. The new probe classifies live `world.group` meshes (50 decks, 100
strips, 176 piers, water, instanced, other), hides each layer at g01/g05/g07/g08
after `snapCamera(true)`, and records the 7×7 sample change.

Live contribution (changedFraction of 49 samples):
g01 ramps 0.265 / piers 0.061 / water 0 / instanced 0.122 / other 0.551;
g05 ramps 0 / piers 0 / water 0.163 / instanced 0.041 / other 0.796;
g07 ramps 0.694 / piers 0 / water 0 / instanced 0 / other 0.306;
g08 ramps 0 / piers 0 / water 0.102 / instanced 0.041 / other 0.857.

g07 is ramp-dominated. g05 and g08 have **zero** ramp contribution; "other"
meshes dominate three of four poses. Camera stays 7.4/1.92. PNG refresh and
treating this probe as original-golden fail closed.

Local unique cases: 27 in `scripts/world-layer.test.mjs`. Previous r6.25
expected 1,256 + 27 = 1,283. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
