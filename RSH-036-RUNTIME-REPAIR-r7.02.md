# RSH-036 r7.02 — Sabra no longer an origami loaf

Candidate, 12 September 2026. Base `59dc673` (r7.01).
No merge or freeze; 35/67 accepted; 32 remain. Pixel leftover g07
0.2027 unchanged. `freeze_granted=false`. No PNG refresh, no RSH-037
queue activation.

## Product

GLTF clone is disabled (quantized body stood vertical). The fallback was
a 2.5D extrusion with `lineTo` + `steps: 1` — a constant-width loaf.

| change |
|---|
| side profile uses quadratic curves |
| bevel 6 segments, steps 2 |
| nose/tail width taper so it is not a brick |
| wheel arches / chrome belt already present |

`car-mesh.ts` is not in the 85 freeze hashes. Ayalon night path untouched.

## Live

Rothschild daylight: cream sedan silhouette, windshield, taper, 21 km/h.
