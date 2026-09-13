# RUSH Israel — NEXT Contract

**Version:** 28.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-045 implementation base:** `7ebe241496e9206efe1ad7a5068924cbc299ced2`
**State effective on:** merge of the RSH-045 pull request
**Next unit:** `RSH-046` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-045 after RSH-044 merged. That authority is consumed on validated merge and does not extend to RSH-046.

## RSH-045 acceptance boundary

- Complete Hebrew RTL, English LTR and the Arabic-scope decision is locked at `src/game/rtl-scope/`;
- `rtl_scope_complete` = `True`;
- `hebrew_rtl` = `True`;
- `english_ltr` = `True`;
- `arabic_in_scope` = `True`;
- `arabic_copy_complete` = `False`;
- `arabic_fallback_english` = `True`;
- `default_lang` = `he`;
- `lang_count` = `3`;
- `onboarding_complete` = `False`;
- `html_lang_static_he` = `True`;
- `document_lang_synced` = `False`;
- P1-12 stays OPEN — long-soak is not in required CI;
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- P2-11 stays OPEN — privacy/telemetry remain RSH-048;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle/context-loss/device-matrix/input-maps sources, live `i18n.ts` / `game-app.tsx` / `__root.tsx` / `styles.css` and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-046 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 45 |
| Deferred | 22 |
| Remaining | 22 |
| Queue head | RSH-046 |
| RSH-046 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-046 may be created or executed.
