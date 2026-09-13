# RSH-043 — Validate the browser and device support matrix

**Unit:** RSH-043
**Branch:** `agent/rsh-043-device-matrix`
**State effective on:** validated merge of the RSH-043 pull request

## Acceptance boundary

RSH-043 locks validate the browser and device support matrix at `src/game/device-matrix/`.
Frozen Ayalon / engine / HUD / stream-flag / registry / soak / leak-cycle /
context-loss / package sources are not rewritten. GIS/navigation claims and
public distribution remain forbidden. P1-12, P1-13 and P2-09 stay OPEN.

Closed findings: P2-12.
Kept OPEN: P1-12, P1-13, P2-09.

This unit does **not** execute later-queue work (RSH-044). Real-device p95
evidence is not accepted. Required CI is not expanded to a 30-minute soak.

## Locked identity

| Field | Required value |
|---|---|
| `device_matrix_enforced` | `true` |
| `real_device_baseline_accepted` | `false` |
| `webgl2_required` | `true` |
| `webgpu_default` | `false` |
| `target_browser_count` | `6` |
| `input_maps_unified` | `false` |
| GIS / navigation claim | forbidden |
| Public distribution | forbidden |
| Ayalon freeze | remains granted, 36 hashes unchanged |
| Release gates green | `0/13` |

## Runtime preservation

Golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio /
HUD / input sources, engine adapters, quality-profile live sources,
`stream-flag.ts`, `ResourceRegistry.ts`, soak harnesses, leak-cycle lock
sources, context-loss lock sources and `package.json` change by `0`.

## Deferred boundary

RSH-044 remains deferred, unauthorized and uncreated.
