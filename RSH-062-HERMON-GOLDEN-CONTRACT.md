# RSH-062 — Hermon art, golden and freeze

**Unit:** RSH-062
**Branch:** `agent/rsh-062-hermon-golden`
**State effective on:** validated merge of the RSH-062 pull request

## Acceptance boundary

RSH-062 locks hermon art, golden and freeze at `src/game/hermon-golden/`.
Frozen Ayalon / engine / HUD / stream-flag / registry / soak / leak-cycle /
context-loss / package sources are not rewritten. GIS/navigation claims and
public distribution remain forbidden. P1-12, P1-13 and P2-09 stay OPEN.

Closed findings: none.
Kept OPEN: P1-12, P1-13, P2-09.

This unit does **not** execute later-queue work (RSH-063). Real-device p95
evidence is not accepted. Required CI is not expanded to a 30-minute soak.

## Locked identity

| Field | Required value |
|---|---|
| `track_id` | `hermon` |
| `art_golden_locked` | `true` |
| `track_source_freeze` | `true` |
| `ayalon_freeze_granted` | `true` |
| `owner_settings_freeze` | `false` |
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

RSH-063 remains deferred, unauthorized and uncreated.
