# RSH-036 r6.96 — leftover g07 after world.group+outside is remaining empty-scene vs golden, not setViewport, not setClearColor, not renderer.compile, not env

Candidate, 12 September 2026. Base 3387de2
(r6.95 playability + r6.93 ocs isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.95 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05, GFX-06, GFX-07, GFX-08, GFX-09 and GFX-10 stay queued after
RSH-036 and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-103: leftover g07 empty-scene vs golden is not setViewport vs setClearColor vs renderer.compile

r6.93 leftover g07 after world.group+outside hidden is remaining empty-scene
vs golden residual (leftover 0.2027), not setOpaqueSort, not
setTransparentSort, not setClearAlpha and not env. The new probe
isolates leftover after world.group+outside as remaining empty-scene vs golden
independently of setViewport vs setClearColor vs renderer.compile after
setNight/snapCamera(true) at threshold 0.12 without changing product color,
exposure, frustum, chase pose, pixel buffer, post, antialias,
shadow/fog/scissor, autoClear/sort/override, physicallyCorrectLights/premultiply/log-depth,
preserve/stencil/reversed-depth, localClipping/clipShadows/clipIntersection,
autoClearColor/autoClearDepth/autoClearStencil, dithering/autoUpdate/autoReset,
shadowMap.type/needsUpdate/clippingPlanes,
useLegacyLights/checkShaderErrors/xr.enabled,
shadowMap.enabled/cameraAutoUpdate/onShaderError,
framebufferScaleFactor/transmissionResolutionScale/VSMShadowMap,
setFoveation/setReferenceSpaceType/PCFSoftShadowMap or
setOpaqueSort/setTransparentSort/setClearAlpha.
Product renderer stays on the leftover path (full 1280×800 viewport /
product clear color / no extra compile). Isolation uses
`setViewport(0,0,640,400)`, `setClearColor(0x808080)` and
`renderer.compile(scene, camera)`. Deltas use the empty-scene leftover
buffer as baseline.

Live leftover after world.group+outside hidden, rest chase 7.4/1.92,
1280×800 p=1 (product hex `0xd0d4d8`, exposure 0.56):

| pose | leftover % | viewport Δ | clear Δ | compile Δ | env Δ | both Δ | pack Δ |
|---|---:|---:|---:|---:|---:|---:|---:|
| g01 | 0.9907 | **−0.4635** | **0** | **0** | **0** | **0** | **0** |
| g05 | 0.9844 | **−0.4936** | **0** | **0** | **0** | **0** | **0** |
| g07 | **0.2027** | **+0.6188** | **0** | **0** | **0** | **+0.7584** | **+0.7584** |
| g08 | 0.9904 | **−0.4962** | **0** | **0** | **0** | **+0.0038** | **+0.0038** |

g07 leftover after world.group+outside is remaining empty-scene vs golden
residual (leftover 0.2027), not setViewport 640×400 (g07 bandDelta +0.6188
increases leftover → 0.8215, L2 +183.4), not setClearColor 0x808080 (≡ 0,
L2 ≡ 0), not renderer.compile (≡ 0) and not env (≡ 0). both/pack follow the
viewport shrink on g07 (+0.7584). leftover-after-empty-as-env ≡ 0. Empty
leftover has no world geometry for a setViewport/setClearColor/compile
change to occupy remaining g07: shrinking the drawing window darkens
g01/g05/g08 empty-fill vs the dark locked PNG (buffer-window artifact, not
remaining g07 0/4) and makes g07 worse. Product renderer stays. Counts:
leftover 2082.

Local unique cases: 28 in `scripts/world-vcc.test.mjs`. Previous r6.93
expected 3,129 + 28 = 3,157. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
