# RUSH Israel — NEXT Contract

**Version:** 34.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-051 implementation base:** `b74fcd39cea0661f3a21beb06fb78d79ff0d8dd9`
**State effective on:** merge of the RSH-051 pull request
**Next unit:** `RSH-052` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-051 after RSH-050 merged. That authority is consumed on validated merge and does not extend to RSH-052.

## RSH-051 acceptance boundary

- Yarkon–Reading geometry and driving is locked at `src/game/namal/`;
- `track_id` = `namal`;
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
- no RSH-052 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 51 |
| Deferred | 16 |
| Remaining | 16 |
| Queue head | RSH-052 |
| RSH-052 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-052 may be created or executed.
