# RSH-044 — Unify keyboard, touch and gamepad input maps

**Unit:** RSH-044
**Branch:** `agent/rsh-044-input-maps`
**State effective on:** validated merge of the RSH-044 pull request

## Acceptance boundary

RSH-044 locks a unified keyboard, touch and gamepad action map at
`src/game/input-maps/`. Frozen Ayalon / engine / HUD / stream-flag /
registry / soak / leak-cycle / context-loss / device-matrix / package
sources and live `input.ts` / `touch-controls.tsx` bytes are not rewritten.
GIS/navigation claims and public distribution remain forbidden.
P1-12, P1-13 and P2-09 stay OPEN.

Closed findings: P2-10.
Kept OPEN: P1-12, P1-13, P2-09, P2-11.

This unit does **not** execute later-queue work (RSH-045). Hebrew RTL,
English LTR and the Arabic-scope decision remain deferred. Live input
runtime stays the RSH-034 maps; this unit unifies them as one canonical
action table and verifies canvas `touch-none` plus pointer-cancel.

## Locked identity

| Field | Required value |
|---|---|
| `input_maps_unified` | `true` |
| `touch_action` | `none` |
| `canvas_touch_none` | `true` |
| `pointer_cancel_locked` | `true` |
| `unified_action_count` | `7` |
| `pause_keyboard_only` | `true` |
| `rtl_scope_complete` | `false` |
| GIS / navigation claim | forbidden |
| Public distribution | forbidden |
| Ayalon freeze | remains granted, 36 hashes unchanged |
| Release gates green | `0/13` |

## Unified actions

`steer`, `throttle`, `brake`, `drift`, `nitro`, `pause`, `rewind`.

Keyboard, gamepad index `0` and the `md:hidden` touch pad share that
seven-action vocabulary. Drive actions (`steer`, `throttle`, `brake`,
`drift`, `nitro`, `rewind`) are bound on all three devices. **Pause is
keyboard-only** in live runtime (`Escape` / `KeyP` via
`GameInput.wantsPause()`); gamepad and the on-screen pad have no pause
control. `evaluateLock({ claimedUniversalPause: true }).acceptedAsUniversalPause`
is always `false`. Keyboard steer remains `A`/`←` = `+1`, `D`/`→` = `-1`.

## Runtime preservation

Golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio /
HUD / input sources, engine adapters, quality-profile live sources,
`stream-flag.ts`, `ResourceRegistry.ts`, soak harnesses, leak-cycle lock
sources, context-loss lock sources, device-matrix lock sources and
`package.json` change by `0`.

## Deferred boundary

RSH-045 remains deferred, unauthorized and uncreated.
