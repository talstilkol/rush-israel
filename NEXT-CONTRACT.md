# RUSH Israel — NEXT Contract

**Version:** 32.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-049 implementation base:** `7feb022935c28ebf6b69f822ddcefac603013f9e`
**State effective on:** merge of the RSH-049 pull request
**Next unit:** `RSH-050` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-049 after RSH-048 merged. That authority is consumed on validated merge and does not extend to RSH-050.

## RSH-049 acceptance boundary

- Rothschild geometry and driving is locked at `src/game/rothschild/`;
- `track_id` = `rothschild`;
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
- no RSH-050 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 49 |
| Deferred | 18 |
| Remaining | 18 |
| Queue head | RSH-050 |
| RSH-050 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-050 may be created or executed.
