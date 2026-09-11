# RSH-036 r6.79 — leftover g07 after world.group+outside is remaining empty-scene vs golden, not antialias, not samples, not alpha, not env; GFX-09 queued

Candidate, 11 September 2026. Base c566663
(r6.78 fx isolation). No merge or freeze; 35/67 accepted;
32 remain. r6.17, r6.18 and r6.27 exact-head failures are retained. Do not
relabel them as passes. r6.78 exact-head CI is not claimed. GFX-01, GFX-03,
GFX-04, GFX-05, GFX-06, GFX-07, GFX-08 and GFX-09 stay queued after RSH-036
and are not remaining 0/4.

## r6.26 exact-head CI independently retained as last success

Required CI **34460850784**, job **102818068809**: SUCCESS on checkout
`6fb27397b9edec289a48e8acf598cb049ba6b002` / tree
`932d739305bcc5f24a943dbf4a1712dcfb5a3ae0`. 1,283/1,283 units. Artifact
required-ci-34460850784-1 SHA-256
`6519782e5484f6efe1810071b71e4e93afeb842f096b132f8c58a0eabf0ffd40`.

## AUD-89: leftover g07 empty-scene vs golden is not antialias vs samples vs alpha

r6.78 leftover g07 after world.group+outside hidden is remaining empty-scene
vs golden residual (leftover 0.2027), not bloom, not SMAA, not grade and not
env. The new probe isolates leftover after world.group+outside as remaining
empty-scene vs golden independently of antialias vs samples vs alpha after
setNight/snapCamera(true) at threshold 0.12 without changing product color,
exposure, frustum, chase pose, pixel buffer or post bloom/SMAA/grade.
Product renderer stays on the leftover path (high-quality composer,
constructor antialias false, alpha false). Isolation uses drawing-buffer
path (`post.setTier('low')`), composer RT samples 4, and
`renderer.setClearAlpha(0)`. Deltas use the empty-scene leftover buffer as
baseline.

Live leftover after world.group+outside hidden, rest chase 7.4/1.92,
1280×800 p=1 (product hex `0xd0d4d8`, exposure 0.56, independence flags
all true/false as required):

| pose | leftover % | aa Δ | samples Δ | alpha Δ | env Δ | both Δ | pack Δ |
|---|---:|---:|---:|---:|---:|---:|---:|
| g01 | 0.9907 | **0** | **0** | **0** | **0** | **0** | **0** |
| g05 | 0.9844 | **0** | **0** | **0** | **0** | **0** | **0** |
| g07 | **0.2027** | +0.0003 | **0** | **0** | **0** | +0.0003 | +0.0003 |
| g08 | 0.9904 | +0.0061 | **0** | **0** | **0** | +0.0061 | +0.0061 |

g07 leftover after world.group+outside is remaining empty-scene vs golden
residual (leftover 0.2027), not drawing-buffer antialias (bandDelta +0.0003
below AA_BAND_MIN 0.02, L2 +38.79 increases), not samples 4 (≡ 0, L2 ≡ 0),
not clear-alpha 0 (≡ 0) and not env (≡ 0). both ≡ pack. leftover-after-empty-as-env
≡ 0. Empty leftover has no world geometry for an MSAA/alpha change to
resample against golden occupancy; skipping the composer Output/grade path
brightens the empty fill (L2 +38.79) rather than occupying remaining g07.
g08 night aa bandDelta +0.0061 below 0.02 is a night-empty composer-skip
tint, not remaining g07 0/4. Product renderer stays.
Counts: leftover 2082.

## GFX-09 queued (not remaining 0/4)

Owner screenshot 2026-09-11 22:55.30 on track `oldjaffa`, mode הקפה 1/3,
day, t=0:09.40, 0 km/h, POI מגדל השעון. Track flickers constantly; the
road is not visible; HUD toasts `חזור לכביש`; forward driving does not
work. Origami Sabra is GFX-01 family. Distinct from GFX-07 (Jerusalem P2P
cannot-drive-forward). Evidence:
docs/evidence/GFX-09-oldjaffa-clock-tower-flicker.md.

Local unique cases: 28 in `scripts/world-aa.test.mjs`. Previous r6.78
expected 2,737 + 28 = 2,765. Pixel 0/4, immutable CDN bytes, rendering
performance and freeze remain open.
