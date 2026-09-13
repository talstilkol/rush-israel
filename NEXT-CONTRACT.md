# RUSH Israel — NEXT Contract

**Version:** 49.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-066 implementation base:** `1cb4f2281a6062494839dd6f60fdba4e5e9c6ec0`
**State effective on:** merge of the RSH-066 pull request
**Next unit:** `RSH-067` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-066 after RSH-065 merged. That authority is consumed on validated merge and does not extend to RSH-067.

## RSH-066 acceptance boundary

- Produce RC1 and close all blocking defects is locked at `src/game/rc1-close/`;
- `rc1_produced` = `True`;
- `blocking_owner_settings_open` = `True`;
- `unverified_assets` = `66`;
- `public_distribution` = `False`;
- `v1_published` = `False`;
- P1-12 stays OPEN — long-soak is not in required CI;
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle/context-loss sources and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-067 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 66 |
| Deferred | 1 |
| Remaining | 1 |
| Queue head | RSH-067 |
| RSH-067 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-067 may be created or executed.
