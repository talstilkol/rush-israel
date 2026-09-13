# RUSH Israel — NEXT Contract

**Version:** 45.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-062 implementation base:** `8f35457fb29285f4af487457342d6b4bdd1ea574`
**State effective on:** merge of the RSH-062 pull request
**Next unit:** `RSH-063` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-062 after RSH-061 merged. That authority is consumed on validated merge and does not extend to RSH-063.

## RSH-062 acceptance boundary

- Hermon art, golden and freeze is locked at `src/game/hermon-golden/`;
- `track_id` = `hermon`;
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
- no RSH-063 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 62 |
| Deferred | 5 |
| Remaining | 5 |
| Queue head | RSH-063 |
| RSH-063 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-063 may be created or executed.
