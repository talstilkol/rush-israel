# RUSH Israel — NEXT Contract

**Version:** 41.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-058 implementation base:** `c0a9c81d3e16f0281094e2888deae5edd2c41fd9`
**State effective on:** merge of the RSH-058 pull request
**Next unit:** `RSH-059` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-058 after RSH-057 merged. That authority is consumed on validated merge and does not extend to RSH-059.

## RSH-058 acceptance boundary

- Haifa–Carmel art, golden and freeze is locked at `src/game/haifa-golden/`;
- `track_id` = `haifa`;
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
- no RSH-059 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 58 |
| Deferred | 9 |
| Remaining | 9 |
| Queue head | RSH-059 |
| RSH-059 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-059 may be created or executed.
