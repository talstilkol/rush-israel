# RSH-047 — Complete PWA, offline, update and manifest behaviour

**Unit:** RSH-047
**Branch:** `agent/rsh-047-pwa`
**State effective on:** validated merge of the RSH-047 pull request

## Acceptance boundary

RSH-047 locks the live product PWA chrome at `src/game/pwa/`. Frozen Ayalon /
engine / HUD / stream-flag / registry / soak / leak-cycle / context-loss /
device-matrix / input-maps / rtl-scope / onboarding / package sources and live
`grok-pwa-plugin.mjs` / `grok-pwa-shared.mjs` / `rush-pwa.mjs` /
`grok-pwa.ts` / `__root.tsx` / `PRODUCT-METADATA.json` bytes are not rewritten.
GIS/navigation claims and public distribution remain forbidden.
P1-12, P1-13, P2-09 and P2-11 stay OPEN.

This unit does **not** execute later-queue work (RSH-048). Accessibility,
privacy and Alpha UX remain deferred.

## Locked identity

| Field | Required value |
|---|---|
| `pwa_complete` | `true` |
| `manifest_present` | `true` |
| `manifest_path` | `/__grok/manifest.webmanifest` |
| `display_standalone` | `true` |
| `start_url` | `/` |
| `service_worker` | `false` |
| `offline_cache` | `false` |
| `update_prompt` | `false` |
| `public_install` | `false` |
| `a11y_complete` | `false` |
| GIS / navigation claim | forbidden |
| Public distribution | forbidden |
| Ayalon freeze | remains granted, 36 hashes unchanged |
| Release gates green | `0/13` |

## Flow decision

Live PWA delivery is the platform `__grok` manifest injector
(`display: standalone`, `start_url: /`). There is no service worker, no
offline asset cache and no update prompt.
`evaluateLock({ claimedServiceWorker: true }).acceptedAsServiceWorker`
is always `false`. Public install distribution stays unauthorized.

## Runtime preservation

Golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio /
HUD / input sources, engine adapters, quality-profile live sources,
`stream-flag.ts`, `ResourceRegistry.ts`, soak harnesses, leak-cycle lock
sources, context-loss lock sources, device-matrix lock sources, input-maps
lock sources, rtl-scope lock sources, onboarding lock sources and
`package.json` change by `0`.

## Deferred boundary

RSH-048 remains deferred, unauthorized and uncreated.
