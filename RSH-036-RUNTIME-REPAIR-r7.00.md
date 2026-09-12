# RSH-036 r7.00 — Hayarkon sea, quality hysteresis, isolated touch pad

Candidate, 12 September 2026. Base `312e5dc` (r6.99).
No merge or freeze; 35/67 accepted; 32 remain. Pixel leftover g07
0.2027 unchanged. `freeze_granted=false`. No PNG refresh, no RSH-037
queue activation.

## Product (not remaining 0/4)

Standing grant plus “finish all programs.” This is the missing eighth
MVP track (Yarkon–Reading sibling / Tel Aviv Beach) plus quality/touch
behaviour already wired but incomplete.

| item | repair |
|---|---|
| hayarkon sea | giant water AABB skipped the Mediterranean; now 78 m tiles on the sea shoulder, never on the ribbon |
| quality low/mid | `dyn.step` starts at 3 / 1 so Ayalon planar is off on Low (High unchanged) |
| hysteresis | 16–20 ms deadband + 18 ms blip resets cooldown — 4/4 `gfx-step` tests |
| HUD `?qa=1` | p50/p95/p99 + gfx step `qN` |
| touch pad | steer only; gas/brake buttons own throttle; `touch-action: none` |
| gamepad | Start (`buttons[9]`) pauses |
| WebGL lost | `preventDefault` then `restoreContext()` so remount can run |

Ayalon freeze path unchanged on High (reflector, canal, hex, exposure).

## Live

Hayarkon after tiles: 35 km/h, A dYaw **+0.277**, onTrack, teal sea to the
right of the promenade, road not flooded.

## Freeze

`world.ts` / `engine.ts` / `input.ts` / `hud.tsx` / `touch-controls.tsx`
hashes retargeted. Checker 6/6. Typecheck clean. Pixel 0/4 and 13
release gates stay open.
