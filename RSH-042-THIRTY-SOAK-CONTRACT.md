# RSH-042 — Pass the 30-minute soak test

**Unit:** RSH-042
**Implementation base:** `e8129df3e1fa5b62720d11b794395fdc531eaddf`
**Base tree:** `fef0d3f728fae5c7e18b4c5ba8363eaec53ea463`
**Branch:** `agent/rsh-042-thirty-soak`
**State effective on:** validated merge of the RSH-042 pull request

## Acceptance boundary

RSH-042 locks the 30-minute uninterrupted soak contract. Required CI keeps
the 2-cycle soak-smoke; that smoke run does **not** substitute for 1800 s.
The live 20-cycle Playwright harness and `package.json` stay frozen, so the
30-minute job is not added to the required gate. P1-12 remains OPEN.

It does **not** validate the browser/device matrix (RSH-043), accept a
real-device baseline (P1-13), close P2-09, rewrite frozen Ayalon / engine /
HUD / stream-flag / leak-cycle / context-loss / package sources, or flip
release gates.

Live surfaces already exist in `scripts/soak-menu-race.mjs` and
`scripts/soak-smoke.mjs`. This unit canonicalises the duration contract at
`src/game/thirty-soak/` and fail-closes if smoke is treated as the 30-minute
soak or those harnesses drift.

## Locked identity (must remain exact)

| Field | Required value |
|---|---|
| Soak duration | 1800 s |
| Required-CI soak-smoke cycles | 2 |
| Live enter-exit harness cycles | 20 |
| Smoke substitutes for 30-minute soak | false |
| Soak contract enforced | true |
| Device matrix enforced | false |
| Real-device baseline accepted | false |
| P1-12 | remains OPEN (long-soak not in required CI) |
| P1-13 | remains OPEN |
| P2-09 | remains OPEN |
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

RSH-043 — Validate the browser and device support matrix — remains deferred,
unauthorized and uncreated. RSH-042 does not add `src/game/device-matrix/`.
