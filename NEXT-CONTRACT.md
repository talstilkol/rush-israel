# RUSH Israel — NEXT Contract

**Version:** 35.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-052 implementation base:** `d29ff43ca8bd8a0a53a8e6d7149208b06d77012b`
**State effective on:** merge of the RSH-052 pull request
**Next unit:** `RSH-053` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-052 after RSH-051 merged. That authority is consumed on validated merge and does not extend to RSH-053.

## RSH-052 acceptance boundary

- Yarkon–Reading art, golden and freeze is locked at `src/game/namal-golden/`;
- `track_id` = `namal`;
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
- no RSH-053 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 52 |
| Deferred | 15 |
| Remaining | 15 |
| Queue head | RSH-053 |
| RSH-053 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-053 may be created or executed.
