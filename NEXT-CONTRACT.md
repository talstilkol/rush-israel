# RUSH Israel — NEXT Contract

**Version:** 29.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-046 implementation base:** `97a3190306c59cc14aaffc659c7c499a8a95b7c9`
**State effective on:** merge of the RSH-046 pull request
**Next unit:** `RSH-047` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-046 after RSH-045 merged. That authority is consumed on validated merge and does not extend to RSH-047.

## RSH-046 acceptance boundary

- Complete onboarding, settings, error and recovery flows is locked at `src/game/onboarding/`;
- `onboarding_complete` = `True`;
- `title_boot` = `True`;
- `settings_panel` = `True`;
- `save_recovery_ux` = `True`;
- `first_run_wizard` = `False`;
- `boot_screen` = `title`;
- `pwa_complete` = `False`;
- `a11y_complete` = `False`;
- P1-12 stays OPEN — long-soak is not in required CI;
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- P2-11 stays OPEN — privacy/telemetry remain RSH-048;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle/context-loss/device-matrix/input-maps/rtl-scope sources, live `screens.tsx` / `game-app.tsx` / `save-recovery-ui.ts` / `save-recovery.ts` and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-047 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 46 |
| Deferred | 21 |
| Remaining | 21 |
| Queue head | RSH-047 |
| RSH-047 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-047 may be created or executed.
