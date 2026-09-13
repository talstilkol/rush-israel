# RUSH Israel — NEXT Contract

**Version:** 37.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-054 implementation base:** `973c737ce1070380f50b0bf5f7ec32993a94977f`
**State effective on:** merge of the RSH-054 pull request
**Next unit:** `RSH-055` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-054 after RSH-053 merged. That authority is consumed on validated merge and does not extend to RSH-055.

## RSH-054 acceptance boundary

- Jaffa art, golden and freeze is locked at `src/game/oldjaffa-golden/`;
- `track_id` = `oldjaffa`;
- `art_golden_locked` = `True`;
- `track_source_freeze` = `True`;
- `ayalon_freeze_granted` = `True`;
- `owner_settings_freeze` = `False`;
- P1-12 stays OPEN — long-soak is not in required CI;
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle/context-loss sources and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-055 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 54 |
| Deferred | 13 |
| Remaining | 13 |
| Queue head | RSH-055 |
| RSH-055 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-055 may be created or executed.
