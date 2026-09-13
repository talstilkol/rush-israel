# RSH-041 — Pass WebGL context-loss and recovery tests

**Unit:** RSH-041
**Implementation base:** `b24dea10f4a6ff186ee0c73e44a4fc693ad384f9`
**Base tree:** `f404cbf8e584346d707c6f25b68aa187bf738245`
**Branch:** `agent/rsh-041-context-loss`
**State effective on:** validated merge of the RSH-041 pull request

## Acceptance boundary

RSH-041 locks the live WebGL context-loss and recovery contract that later
G6 units consume. It records the existing loop-adapter `preventDefault` +
`glLost` skip-frame path, the restore callback that remounts the race
(`setRaceKey`), and proves eight synthetic loss/restore cycles leave
save/record/cash/star data intact.

It does **not** rewrite frozen engine adapters, run the 30-minute soak
(RSH-042), accept a real-device baseline (P1-13), close P2-09, rewrite
frozen Ayalon / HUD / stream-flag / package / leak-cycle sources, or flip
release gates.

Live surfaces already exist in `src/game/engine/loop-adapter.ts`,
`src/game/engine.ts` and `src/components/game-app/race-controller.tsx`.
This unit canonicalises those surfaces at `src/game/context-loss/` and
fail-closes if they disappear or drift.

## Locked identity (must remain exact)

| Field | Required value |
|---|---|
| Context-loss cycles | 8 |
| `preventDefault` on `webglcontextlost` | true |
| Skip frames while `glLost` | true |
| Restore clears `glLost` and remounts race | true |
| Save / records / cash / stars survive remount | true |
| Context-loss enforced | true |
| 30-minute soak enforced | false |
| Real-device baseline accepted | false |
| P1-13 | remains OPEN |
| P2-09 | remains OPEN (no JS/asset byte-size CI check) |
| GIS / navigation claim | forbidden |
| Public distribution | forbidden |
| Ayalon freeze | remains granted, 36 hashes unchanged |
| Release gates green | `0/13` |

## Runtime preservation

Golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio /
HUD / input sources, engine adapters, quality-profile live sources,
`game-cache.ts`, `cache-headers-smoke.mjs`, `stream-flag.ts`,
`ResourceRegistry.ts`, `disposeObject3D.ts`, soak harnesses, leak-cycle
lock sources and `package.json` change by `0`.

## Deferred boundary

RSH-042 — Pass the 30-minute soak test — remains deferred, unauthorized
and uncreated. RSH-041 does not add `src/game/thirty-soak/`.
