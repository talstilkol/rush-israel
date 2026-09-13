# RUSH Israel — NEXT Contract

**Version:** 31.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-048 implementation base:** `fa95fcde9183461c43edbdfae11153457566ae58`
**State effective on:** merge of the RSH-048 pull request
**Next unit:** `RSH-049` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-048 after RSH-047 merged. That authority is consumed on validated merge and does not extend to RSH-049.

## RSH-048 acceptance boundary

- Accessibility, privacy and Alpha UX gates are locked at `src/game/a11y/`;
- `a11y_complete` = `True`;
- `aria_controls` = `True`;
- `live_regions` = `True`;
- `reduced_motion` = `True`;
- `wcag_aa` = `False`;
- `canvas_a11y` = `False`;
- `privacy_policy` = `False`;
- `telemetry` = `False`;
- `crash_reporting` = `False`;
- `alpha_ux_private` = `True`;
- `rothschild_geometry` = `False`;
- P1-12 stays OPEN — long-soak is not in required CI;
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- P2-11 is CLOSED — collection/retention is none: no telemetry, no crash reporting, no public privacy policy;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle/context-loss/device-matrix/input-maps/rtl-scope/onboarding/PWA sources, live `screens.tsx` / `hud.tsx` / `boot-overlay.tsx` / `styles.css` / `save-recovery-ui.ts` and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-049 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 48 |
| Deferred | 19 |
| Remaining | 19 |
| Queue head | RSH-049 |
| RSH-049 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-049 may be created or executed.
