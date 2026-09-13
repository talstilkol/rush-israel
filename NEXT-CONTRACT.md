# RUSH Israel — NEXT Contract

**Version:** 38.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-055 implementation base:** `1f95b0ad187f57ad6b1ca99838de8c9891ab3236`
**State effective on:** merge of the RSH-055 pull request
**Next unit:** `RSH-056` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-055 after RSH-054 merged. That authority is consumed on validated merge and does not extend to RSH-056.

## RSH-055 acceptance boundary

- Jerusalem–Scopus geometry and driving is locked at `src/game/scopus/`;
- `track_id` = `scopus`;
- `geometry_locked` = `True`;
- `driving_locked` = `True`;
- `art_golden_locked` = `False`;
- `track_freeze_granted` = `False`;
- P1-12 stays OPEN — long-soak is not in required CI;
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle/context-loss sources and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-056 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 55 |
| Deferred | 12 |
| Remaining | 12 |
| Queue head | RSH-056 |
| RSH-056 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-056 may be created or executed.
