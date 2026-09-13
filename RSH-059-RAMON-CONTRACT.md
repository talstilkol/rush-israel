# RSH-059 — Ramon geometry and driving

**Unit:** RSH-059
**Branch:** `agent/rsh-059-ramon`
**State effective on:** validated merge of the RSH-059 pull request

## Acceptance boundary

RSH-059 locks ramon geometry and driving at `src/game/ramon/`.
Frozen Ayalon / engine / HUD / stream-flag / registry / soak / leak-cycle /
context-loss / package sources are not rewritten. GIS/navigation claims and
public distribution remain forbidden. P1-12, P1-13 and P2-09 stay OPEN.

Closed findings: none.
Kept OPEN: P1-12, P1-13, P2-09.

This unit does **not** execute later-queue work (RSH-060). Real-device p95
evidence is not accepted. Required CI is not expanded to a 30-minute soak.

## Locked identity

| Field | Required value |
|---|---|
| `track_id` | `ramon` |
| `geometry_locked` | `true` |
| `driving_locked` | `true` |
| `art_golden_locked` | `false` |
| `track_freeze_granted` | `false` |
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

RSH-060 remains deferred, unauthorized and uncreated.
