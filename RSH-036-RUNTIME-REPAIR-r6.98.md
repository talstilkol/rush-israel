# RSH-036 r6.98 — playability: flicker, camera-in-hill, cannot-drive

Candidate, 12 September 2026. Base `1b2d5a3` (r6.97 rsi isolation).
No merge or freeze; 35/67 accepted; 32 remain. Pixel leftover g07
empty-scene vs golden 0.2027 is unchanged. `freeze_granted=false`.
No PNG refresh, no RSH-037 activation.

Owner standing grant plus “המשך לתכנת ברצף עד לסיום כל התוכניות”
takes precedence over another empty-scene isolation cycle. Leftover
g07 0.2027 is irreducible without a forbidden PNG refresh.

## Product repairs (not remaining 0/4)

Ayalon freeze path is unchanged: planar `Reflector`, canal, water Y,
ground hex `0xd0d4d8`, exposure 0.56 stay on `def.id === "ayalon"`.

| defect | cause | repair |
|---|---|---|
| GFX-09 / GFX-10 constant track flicker | 42×80 flat `Reflector` 3 cm above a sloped ribbon, reprojected every tick | planar wet-road reflector **Ayalon-only** |
| flooded water / missing road | transparent water quad sorted over the ribbon; sand/foam used the unpushed body | opaque coastal water, skip if still overlapping the ribbon, sand/foam follow the pushed body |
| GFX-03 / GFX-04 / Haifa darkness | chase camera 7 m off-ribbon inside the hillside mesh | clamp camera to `width/2 + 2.2`, lift to `road.y + 1.7`, collider push even on snap |
| GFX-06 trees / hillside on road | slope mesh started at the curb (`width/2 + 1.2`) | hillside starts at `width/2 + 4.6` (shoulder) |
| GFX-07 / GFX-09 cannot drive | `onTrack` band `half*1.02` vs wall `half+0.35`; off-track damping 2.6 | `onTrack` `half*1.2`; milder off-track drag |

## Live in-browser probes (advanceTime, §5c)

| track | km/h | A dYaw | onTrack | note |
|---|---:|---:|---|---|
| namal | 30 | **+0.383** | true | water seaward, no dual ghost |
| oldjaffa | 26 | **+1.179** mid-lap | true | clock tower beside road |
| haifa t=0.35 | 38 | **+0.568** | true | y=75, road visible, not inside hillside |
| jerusalem t=0.02 | 31 | **+0.823** | true | Mahane Yehuda driveable |
| caesarea t=0.08 | 21 | curve | true | aqueduct water left of ribbon |

A = +yaw / D = −yaw. Procedural Y-up Sabra. Ghost hidden at spawn.

## Freeze

`world.ts` / `vehicle.ts` hashes retargeted via
`scripts/retarget-playable-hashes.mjs`. Checker 6/6. Typecheck clean.
Pixel 0/4, 13 release gates and 32 remaining units stay open.
