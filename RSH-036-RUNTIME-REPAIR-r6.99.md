# RSH-036 r6.99 — remaining V1 tracks driveable; HUD p50/p99

Candidate, 12 September 2026. Base `4b4c8ed` (r6.98 playability).
No merge or freeze; 35/67 accepted; 32 remain. Pixel leftover g07
0.2027 unchanged. `freeze_granted=false`. No PNG refresh, no RSH-037
queue activation.

## Product (not remaining 0/4)

Standing grant plus “finish all programs.” Remaining Version 1 tracks
were geometry/driving work on this branch (RSH-049/055/059/061 content),
not a later-unit activation.

| track | repair |
|---|---|
| rothschild | median-edge colliders so the Sabra stays in the outer carriageways around the ficus park (spawn already `lat=-10.2`) |
| ramon | crater floor disc 420 m → 140 m, skipped when it would cut the climb |
| hermon | snow field pushed off the ribbon |
| haifa pines | roadside offset 18 → 22 m |
| HUD `?qa=1` | p50 / p95 / p99 (telemetry already existed) |

Ayalon freeze path unchanged (reflector, canal, hex, exposure).

## Live probes

| track | km/h | A dYaw | onTrack |
|---|---:|---:|---|
| rothschild (real spawn) | 26 | **+1.184** | true |
| ramon spawn / t=0.4 | 38 | switchback | true (y=168 → 94) |
| hermon | 25 | **+0.155** | true |
| scopus | 25 | curve | true |

Plus r6.98: namal, oldjaffa, haifa, jerusalem, caesarea, ayalon.

## Freeze

`world.ts` / `hud.tsx` / `rothschild.ts` hashes retargeted.
Checker 6/6. Typecheck clean. Pixel 0/4 and 13 release gates stay open.
