# RUSH Israel — NEXT Contract

**Version:** 33.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-050 implementation base:** `e1ba64df57ba14a23f793e1243e0b8b7c17aa5f2`
**State effective on:** merge of the RSH-050 pull request
**Next unit:** `RSH-051` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-050 after RSH-049 merged. That authority is consumed on validated merge and does not extend to RSH-051.

## RSH-050 acceptance boundary

- Rothschild art, golden and freeze is locked at `src/game/rothschild-golden/`;
- `track_id` = `rothschild`;
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
- no RSH-051 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 50 |
| Deferred | 17 |
| Remaining | 17 |
| Queue head | RSH-051 |
| RSH-051 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-051 may be created or executed.
