# RSH-046 — Complete onboarding, settings, error and recovery flows

**Unit:** RSH-046
**Branch:** `agent/rsh-046-onboarding`
**State effective on:** validated merge of the RSH-046 pull request

## Acceptance boundary

RSH-046 locks the live title-boot, settings panel and save-recovery UX at
`src/game/onboarding/`. Frozen Ayalon / engine / HUD / stream-flag /
registry / soak / leak-cycle / context-loss / device-matrix / input-maps /
rtl-scope / package sources and live `screens.tsx` / `game-app.tsx` /
`save-recovery-ui.ts` bytes are not rewritten.
GIS/navigation claims and public distribution remain forbidden.
P1-12, P1-13, P2-09 and P2-11 stay OPEN.

This unit does **not** execute later-queue work (RSH-047). PWA, offline,
update and manifest behaviour remain deferred.

## Locked identity

| Field | Required value |
|---|---|
| `onboarding_complete` | `true` |
| `title_boot` | `true` |
| `settings_panel` | `true` |
| `save_recovery_ux` | `true` |
| `first_run_wizard` | `false` |
| `boot_screen` | `title` |
| `pwa_complete` | `false` |
| `a11y_complete` | `false` |
| GIS / navigation claim | forbidden |
| Public distribution | forbidden |
| Ayalon freeze | remains granted, 36 hashes unchanged |
| Release gates green | `0/13` |

## Flow decision

Live boot is the title screen (`useState("title")`). Settings are the
existing header panel (quality / day-night / mute / language). Save error
and recovery stay the RSH-022 visible `alertdialog` UX.
`evaluateLock({ claimedFirstRunWizard: true }).acceptedAsFirstRunWizard`
is always `false`. There is no multi-step first-run wizard.

## Runtime preservation

Golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio /
HUD / input sources, engine adapters, quality-profile live sources,
`stream-flag.ts`, `ResourceRegistry.ts`, soak harnesses, leak-cycle lock
sources, context-loss lock sources, device-matrix lock sources, input-maps
lock sources, rtl-scope lock sources and `package.json` change by `0`.

## Deferred boundary

RSH-047 remains deferred, unauthorized and uncreated.
