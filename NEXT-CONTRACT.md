# RUSH Israel — NEXT Contract

**Version:** 36.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-053 implementation base:** `372433fcdd6066c7946faec79b54d18388479651`
**State effective on:** merge of the RSH-053 pull request
**Next unit:** `RSH-054` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-053 after RSH-052 merged. That authority is consumed on validated merge and does not extend to RSH-054.

## RSH-053 acceptance boundary

- Jaffa geometry and driving is locked at `src/game/oldjaffa/`;
- `track_id` = `oldjaffa`;
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
- no RSH-054 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 53 |
| Deferred | 14 |
| Remaining | 14 |
| Queue head | RSH-054 |
| RSH-054 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-054 may be created or executed.
