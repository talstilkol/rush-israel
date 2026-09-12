# RSH-036 r6.97 — leftover g07 after world.group+outside is remaining empty-scene vs golden, not setRenderTarget, not setScissorTest, not info.reset, not env

Candidate, 12 September 2026. Base b0a1acd
(r6.96 vcc isolation). No merge or freeze; 35/67 accepted; 32 remain.
r6.17, r6.18 and r6.27 exact-head failures are retained. GFX-01, GFX-03,
GFX-04, GFX-05, GFX-06, GFX-07, GFX-08, GFX-09 and GFX-10 stay queued after
RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units.

## AUD-104: leftover g07 empty-scene vs golden is not setRenderTarget vs setScissorTest vs info.reset

r6.96 leftover g07 after world.group+outside hidden is remaining empty-scene
vs golden residual (leftover 0.2027), not setViewport, not setClearColor,
not renderer.compile and not env. The new probe isolates leftover after
world.group+outside as remaining empty-scene vs golden independently of
setRenderTarget vs setScissorTest vs info.reset after setNight/snapCamera(true)
at threshold 0.12 without changing product color or exposure.
Product renderer stays on the leftover path (default framebuffer / scissorTest
off / no extra info.reset). Isolation uses a dummy 64×64 `WebGLRenderTarget`,
`setScissorTest(true)` with scissor 640×400, and `renderer.info.reset()`.
Deltas use the empty-scene leftover buffer as baseline.

Live leftover after world.group+outside hidden, rest chase 7.4/1.92,
1280×800 p=1 (product hex `0xd0d4d8`, exposure 0.56):

| pose | leftover % | target Δ | scissor Δ | reset Δ | env Δ | both Δ | pack Δ |
|---|---:|---:|---:|---:|---:|---:|---:|
| g01 | 0.9907 | **0** | **0** | **0** | **0** | **0** | **0** |
| g05 | 0.9844 | **0** | **0** | **0** | **0** | **0** | **0** |
| g07 | **0.2027** | **+0.7602** | **0** | **0** | **0** | **+0.7602** | **+0.7602** |
| g08 | 0.9904 | **+0.0080** | **0** | **0** | **0** | **+0.0080** | **+0.0080** |

g07 leftover after world.group+outside is remaining empty-scene vs golden
residual (leftover 0.2027), not setRenderTarget dummy (g07 bandDelta +0.7602
increases leftover → 0.9629, L2 +183.4), not setScissorTest (≡ 0, L2 ≡ 0),
not info.reset (≡ 0) and not env (≡ 0). both/pack follow the dummy target
on g07 (+0.7602). leftover-after-empty-as-env ≡ 0. Empty leftover has no
world geometry for a setRenderTarget/setScissorTest/info.reset change to
occupy remaining g07: redirecting the present pass into a 64×64 target
leaves the default framebuffer stale and makes g07 worse. Product renderer
stays. Counts: leftover 2082.

Local unique cases: 28 in `scripts/world-rsi.test.mjs`. Previous r6.96
expected 3,157 + 28 = 3,185. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
