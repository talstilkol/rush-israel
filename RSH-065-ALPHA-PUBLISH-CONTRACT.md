# RSH-065 — Publish and evaluate v0.1.0-alpha.1

**Unit:** RSH-065
**Branch:** `agent/rsh-065-alpha-publish`
**State effective on:** validated merge of the RSH-065 pull request

## Acceptance boundary

RSH-065 locks publish and evaluate v0.1.0-alpha.1 at `src/game/alpha-publish/`.
Frozen Ayalon / engine / HUD / stream-flag / registry / soak / leak-cycle /
context-loss / package sources are not rewritten. GIS/navigation claims and
public distribution remain forbidden. P1-12, P1-13 and P2-09 stay OPEN.

Closed findings: none.
Kept OPEN: P1-12, P1-13, P2-09.

This unit does **not** execute later-queue work (RSH-066). Real-device p95
evidence is not accepted. Required CI is not expanded to a 30-minute soak.

## Locked identity

| Field | Required value |
|---|---|
| `private_alpha_identity` | `0.1.0-alpha.1` |
| `github_release_created` | `false` |
| `public_distribution` | `false` |
| `owner_visibility_private` | `false` |
| `rc1_produced` | `false` |
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

RSH-066 remains deferred, unauthorized and uncreated.
