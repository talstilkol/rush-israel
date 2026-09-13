# RSH-048 — Pass accessibility, privacy and Alpha UX gates

**Unit:** RSH-048
**Branch:** `agent/rsh-048-a11y`
**State effective on:** validated merge of the RSH-048 pull request

## Acceptance boundary

RSH-048 locks the live product accessibility, privacy and Alpha UX chrome at `src/game/a11y/`. Frozen Ayalon / engine / HUD / stream-flag / registry / soak / leak-cycle / context-loss / device-matrix / input-maps / rtl-scope / onboarding / PWA / package sources and live `screens.tsx` / `hud.tsx` / `boot-overlay.tsx` / `styles.css` / `save-recovery-ui.ts` bytes are not rewritten.
GIS/navigation claims and public distribution remain forbidden.
P1-12, P1-13 and P2-09 stay OPEN.
P2-11 is CLOSED.

This unit does **not** execute later-queue work (RSH-049). Rothschild geometry remains deferred.

## Locked identity

| Field | Required value |
|---|---|
| `a11y_complete` | `true` |
| `aria_controls` | `true` |
| `live_regions` | `true` |
| `reduced_motion` | `true` |
| `wcag_aa` | `false` |
| `canvas_a11y` | `false` |
| `privacy_policy` | `false` |
| `telemetry` | `false` |
| `crash_reporting` | `false` |
| `alpha_ux_private` | `true` |
| `rothschild_geometry` | `false` |
| GIS / navigation claim | forbidden |
| Public distribution | forbidden |
| Ayalon freeze | remains granted, 36 hashes unchanged |
| Release gates green | `0/13` |

## Flow decision

Live chrome already exposes labelled controls (`settings`, `pause`, car/language/physics labels), polite/assertive live regions (boot overlay and save-recovery) and `prefers-reduced-motion` CSS. There is no WCAG AA audit and the WebGL canvas is not an accessible alternative. Collection/retention is none: no telemetry, no crash reporting, no public privacy policy, because the product is private owner-controlled. Alpha UX stays private.

`evaluateLock({ claimedWcagAa: true }).acceptedAsWcagAa` is always `false`.
`evaluateLock({ claimedTelemetry: true }).acceptedAsTelemetry` is always `false`.

## Runtime preservation

Golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio /
HUD / input sources, engine adapters, quality-profile live sources,
`stream-flag.ts`, `ResourceRegistry.ts`, soak harnesses, leak-cycle lock
sources, context-loss lock sources, device-matrix lock sources, input-maps
lock sources, rtl-scope lock sources, onboarding lock sources, PWA lock
sources and `package.json` change by `0`.

## Deferred boundary

RSH-049 remains deferred, unauthorized and uncreated.
