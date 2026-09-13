# RSH-045 — Complete Hebrew RTL, English LTR and the Arabic-scope decision

**Unit:** RSH-045
**Branch:** `agent/rsh-045-rtl-scope`
**State effective on:** validated merge of the RSH-045 pull request

## Acceptance boundary

RSH-045 locks the language and direction-scope decision at
`src/game/rtl-scope/`. Frozen Ayalon / engine / HUD / stream-flag /
registry / soak / leak-cycle / context-loss / device-matrix / input-maps /
package sources and live `i18n.ts` / `game-app.tsx` bytes are not rewritten.
GIS/navigation claims and public distribution remain forbidden.
P1-12, P1-13, P2-09 and P2-11 stay OPEN.

This unit does **not** execute later-queue work (RSH-046). Onboarding,
settings, error and recovery UX remain deferred.

## Locked identity

| Field | Required value |
|---|---|
| `rtl_scope_complete` | `true` |
| `hebrew_rtl` | `true` |
| `english_ltr` | `true` |
| `arabic_in_scope` | `true` |
| `arabic_copy_complete` | `false` |
| `arabic_fallback_english` | `true` |
| `default_lang` | `he` |
| `lang_count` | `3` |
| `onboarding_complete` | `false` |
| GIS / navigation claim | forbidden |
| Public distribution | forbidden |
| Ayalon freeze | remains granted, 36 hashes unchanged |
| Release gates green | `0/13` |

## Language decision

Live `src/game/i18n.ts` already cycles `he → ar → en`. Hebrew and Arabic
are RTL; English is LTR. Arabic copy falls back to English when omitted.
`evaluateLock({ claimedArabicCopyComplete: true }).acceptedAsArabicCopyComplete`
is always `false`. Default language remains Hebrew.

## Runtime preservation

Golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio /
HUD / input sources, engine adapters, quality-profile live sources,
`stream-flag.ts`, `ResourceRegistry.ts`, soak harnesses, leak-cycle lock
sources, context-loss lock sources, device-matrix lock sources, input-maps
lock sources and `package.json` change by `0`.

## Deferred boundary

RSH-046 remains deferred, unauthorized and uncreated.
