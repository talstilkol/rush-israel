# RSH-067 — Publish v1.0.0 with signed tag, dossier and rollback proof

**Unit:** RSH-067
**Branch:** `agent/rsh-067-v1-publish`
**State effective on:** validated merge of the RSH-067 pull request

## Acceptance boundary

RSH-067 locks publish v1.0.0 with signed tag, dossier and rollback proof at `src/game/v1-publish/`.
Frozen Ayalon / engine / HUD / stream-flag / registry / soak / leak-cycle /
context-loss / package sources are not rewritten. GIS/navigation claims and
public distribution remain forbidden. P1-12, P1-13 and P2-09 stay OPEN.

Closed findings: none.
Kept OPEN: P1-12, P1-13, P2-09.

This unit does **not** execute later-queue work (none). Real-device p95
evidence is not accepted. Required CI is not expanded to a 30-minute soak.

## Locked identity

| Field | Required value |
|---|---|
| `v1_identity` | `1.0.0-private` |
| `dossier_locked` | `true` |
| `rollback_proof_locked` | `true` |
| `signed_tag_created` | `false` |
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

none remains deferred, unauthorized and uncreated.
