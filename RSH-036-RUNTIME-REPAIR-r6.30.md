# RSH-036 r6.30 — 7x7 structured kind is not full-frame scene-buffer mismatch

Candidate, 10 September 2026. Base c27c245e27c6626d00ea45b2fd56d87a2db0b1a1
(r6.29 channel-bias isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. Do not relabel them as
passes. r6.29 exact-head CI was in progress at preparation and is not claimed.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-40: 7x7 structured kind is not full-frame scene mismatch

r6.29 classified all four rest poses as structured 7×7 content. A 7×7 kind is
not a 1280×800 present-buffer comparison. Previous probes used
`renderer.render`, which is not the product present path (`post.setDrive(0,
false); post.render()` in `loop-adapter.ts`). Raw-only reports fail closed.
Smoke keeps `verifyWorldLayers`, `verifyWorldResidual`, `verifyWorldMismatch`,
`verifyWorldBias` and `verifyWorldScene`.

Live present-first capture after rest chase 7.4/1.92, `setPixelRatio(1)` and
`setSize(1280,800)` so the drawing buffer is the locked 1280×800 PNG size.
pixelmatch threshold 0.12, fail 8%. Protocol
`world-scene-buffer-not-original-golden`.

| pose | page golden | presentPct | rawPct | presentVsRawPct | kind |
|---|---:|---:|---:|---:|---|
| g01 | 0.6158 | 0.6926 | 0.6926 | 0 | structured |
| g05 | 0.5056 | 0.5940 | 0.5940 | 0 | structured |
| g07 | 0.3122 | 0.2933 | 0.2933 | 0 | structured |
| g08 | 0.6473 | 0.7016 | 0.7016 | 0 | structured |

Scene-only (no HUD) mismatch is 29.3–70.2% and tracks original-golden page
31–65%, so HUD chrome is not the remaining 0/4 driver. g07 remains closest.
presentVsRawPct is 0 at threshold 0.12 after capturing present first, then raw:
at rest (`drive=0`) the EffectComposer stack matches `renderer.render` within
the golden threshold, so rest postfx is not the 0/4 driver either. Camera stays
7.4/1.92. PNG refresh remains forbidden.

Local unique cases: 28 in `scripts/world-scene.test.mjs`. Previous r6.29
expected 1,365 + 28 = 1,393. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
