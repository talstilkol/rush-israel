# RUSH Israel — NEXT Contract

**Version:** 40.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-057 implementation base:** `90ab07dd246e594019149a8f3354d4e5f03b040b`
**State effective on:** merge of the RSH-057 pull request
**Next unit:** `RSH-058` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-057 after RSH-056 merged. That authority is consumed on validated merge and does not extend to RSH-058.

## RSH-057 acceptance boundary

- Haifa–Carmel geometry and driving is locked at `src/game/haifa/`;
- `track_id` = `haifa`;
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
- no RSH-058 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 57 |
| Deferred | 10 |
| Remaining | 10 |
| Queue head | RSH-058 |
| RSH-058 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-058 may be created or executed.
