# RUSH Israel — NEXT Contract

**Version:** 43.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-060 implementation base:** `41a16fc589c847f0dd9740e2f1af62eb4c18c6f8`
**State effective on:** merge of the RSH-060 pull request
**Next unit:** `RSH-061` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-060 after RSH-059 merged. That authority is consumed on validated merge and does not extend to RSH-061.

## RSH-060 acceptance boundary

- Ramon art, golden and freeze is locked at `src/game/ramon-golden/`;
- `track_id` = `ramon`;
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
- no RSH-061 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 60 |
| Deferred | 7 |
| Remaining | 7 |
| Queue head | RSH-061 |
| RSH-061 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-061 may be created or executed.
