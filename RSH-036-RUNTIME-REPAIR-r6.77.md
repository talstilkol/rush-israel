# RSH-036 r6.77 — leftover g07 after world.group+outside is remaining empty-scene vs golden, not pixelRatio, not drawingBuffer, not post.setSize, not env

Candidate, 11 September 2026. Base d574d0f
(r6.76 chas isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.76 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05, GFX-06, GFX-07 and GFX-08 stay queued after RSH-036 and are
not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-87: leftover g07 empty-scene vs golden is not pixelRatio vs drawingBuffer vs post.setSize

r6.76 leftover g07 after world.group+outside hidden is remaining empty-scene
vs golden residual (leftover 0.2027), not follow, not height, not look-ahead
and not env. The new probe isolates leftover after world.group+outside as
remaining empty-scene vs golden independently of pixelRatio vs drawingBuffer
vs post.setSize after setNight/snapCamera(true) at threshold 0.12 without
changing product color, exposure, frustum or chase pose. Product 1280×800
pixelRatio 1 stays on the leftover path. Isolation uses pixelRatio 2,
setSize(640,400,false) and post.setSize(640,400). Combined pack p=2 then
setSize(640,400) makes canvas.width 1280 (not 640); pack/both small flags
are set after the setBuffer call. Non-1280×800 drawingBuffers resample to
1280×800 via canvas.drawImage so bandPixelmatch vs golden still runs.
Deltas use the empty-scene leftover buffer as baseline.

Live leftover after world.group+outside hidden, rest chase 7.4/1.92,
1280×800 p=1 (product hex `0xd0d4d8`, exposure 0.56, independence flags
all true/false as required):

| pose | leftover % | ratio Δ | buffer Δ | size Δ | env Δ | both Δ | pack Δ |
|---|---:|---:|---:|---:|---:|---:|---:|
| g01 | 0.9907 | **0** | **0** | **0** | **0** | **0** | **0** |
| g05 | 0.9844 | **0** | **0** | **0** | **0** | **0** | **0** |
| g07 | **0.2027** | **0** | **0** | **0** | **0** | **0** | **0** |
| g08 | 0.9904 | **0** | **0** | **0** | **0** | **0** | **0** |

g07 leftover after world.group+outside is remaining empty-scene vs golden
residual (leftover 0.2027), not pixelRatio 2 (≡ 0, L2 ≡ 0), not drawingBuffer
640×400 (≡ 0), not post.setSize 640×400 (≡ 0) and not env (≡ 0). both ≡ pack
≡ 0. leftover-after-empty-as-env ≡ 0. Empty leftover has no world geometry
for a pixel-buffer change to resample against golden occupancy; the 200px
band is a product background fill vs locked PNG world content. g08
resampling noise stays below PX_BAND_MIN 0.02. Product 1280×800 p=1 stays.
Counts: leftover 2082.

Owner re-confirmed GFX-08 (same 17:35.28 / 17:35.35 namal screenshots).
Already queued; not remaining 0/4; do not start.

Local unique cases: 28 in `scripts/world-px.test.mjs`. Previous r6.76
expected 2,681 + 28 = 2,709. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
