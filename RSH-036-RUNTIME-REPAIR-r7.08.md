# RSH-036 r7.08 — Ramon day: no flickering blue void on the descent

Candidate, 12 September 2026. Base `e738582` (r7.07).
No merge or freeze; 35/67 accepted; 32 remain. Pixel leftover g07
0.2027 unchanged. `freeze_granted=false`. No PNG refresh, no RSH-037
queue activation.

Owner screenshot (2026-09-11 23:02.52): Ramon lookout DAY, 0 km/h,
chase cam in a solid flickering blue sky, origami car on a black strip.

## Cause

A low-poly sky dome (`0x87b4d8`, depthWrite false) sat in front of
`scene.background` (`0x3c9ee0`). Facet gaps crawled as the camera yawed
= flickering blue. Look-ahead used nearestIndex XZ, which on switchbacks
snapped to the crater floor 100 m below and pitched the camera into sky.

## Repair

| item | change |
|---|---|
| dome | ayalon only (freeze path unchanged) |
| crater floor | 980 m disc at the valley |
| slope | outer 280→420, polygonOffset |
| camera | look-ahead along spline index, dy clamped ±3.2/4.2 m |

## Live (Ramon day)

Spawn 21 km/h y=168. Rim 23 km/h y=136. Switchbacks 22 km/h y=77.
Road + crater walls in frame, not a blue void.
