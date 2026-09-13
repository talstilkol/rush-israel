# RSH-064 — Establish preview, staging, production and rollback

**Unit:** RSH-064
**Branch:** `agent/rsh-064-preview-staging`
**State effective on:** validated merge of the RSH-064 pull request

## Acceptance boundary

RSH-064 locks establish preview, staging, production and rollback at `src/game/preview-staging/`.
Frozen Ayalon / engine / HUD / stream-flag / registry / soak / leak-cycle /
context-loss / package sources are not rewritten. GIS/navigation claims and
public distribution remain forbidden. P1-12, P1-13 and P2-09 stay OPEN.

Closed findings: none.
Kept OPEN: P1-12, P1-13, P2-09.

This unit does **not** execute later-queue work (RSH-065). Real-device p95
evidence is not accepted. Required CI is not expanded to a 30-minute soak.

## Locked identity

| Field | Required value |
|---|---|
| `preview_channel_defined` | `true` |
| `staging_channel_defined` | `true` |
| `production_channel_defined` | `true` |
| `rollback_procedure_locked` | `true` |
| `public_distribution` | `false` |
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

RSH-065 remains deferred, unauthorized and uncreated.
