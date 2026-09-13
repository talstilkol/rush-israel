# RUSH Israel — NEXT Contract

**Version:** 39.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-056 implementation base:** `4a365e38207d1995557ca68d7aff9ede5e8442e3`
**State effective on:** merge of the RSH-056 pull request
**Next unit:** `RSH-057` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-056 after RSH-055 merged. That authority is consumed on validated merge and does not extend to RSH-057.

## RSH-056 acceptance boundary

- Jerusalem–Scopus art, golden and freeze is locked at `src/game/scopus-golden/`;
- `track_id` = `scopus`;
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
- no RSH-057 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 56 |
| Deferred | 11 |
| Remaining | 11 |
| Queue head | RSH-057 |
| RSH-057 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-057 may be created or executed.
