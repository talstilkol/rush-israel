# RUSH Israel — NEXT Contract

**Version:** 27.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-044 implementation base:** `7d147df5db571c915a8c104f553ba4a635f75f6f`
**State effective on:** merge of the RSH-044 pull request
**Next unit:** `RSH-045` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-044 after RSH-043 merged. That authority is consumed on validated merge and does not extend to RSH-045.

## RSH-044 acceptance boundary

- Unify keyboard, touch and gamepad input maps is locked at `src/game/input-maps/`;
- `input_maps_unified` = `True`;
- `touch_action` = `none`;
- `canvas_touch_none` = `True`;
- `pointer_cancel_locked` = `True`;
- `unified_action_count` = `7`;
- `rtl_scope_complete` = `False`;
- P2-10 closes — unified maps plus canvas `touch-none` and pointer-cancel are the verified contract;
- P1-12 stays OPEN — long-soak is not in required CI;
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- P2-11 stays OPEN — privacy/telemetry remain RSH-048;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle/context-loss/device-matrix sources and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-045 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 44 |
| Deferred | 23 |
| Remaining | 23 |
| Queue head | RSH-045 |
| RSH-045 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-045 may be created or executed.
