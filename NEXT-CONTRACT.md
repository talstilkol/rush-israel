# RUSH Israel — NEXT Contract

**Version:** 47.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-064 implementation base:** `5f098303fa80289fcb6e694779edb22c073709a0`
**State effective on:** merge of the RSH-064 pull request
**Next unit:** `RSH-065` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-064 after RSH-063 merged. That authority is consumed on validated merge and does not extend to RSH-065.

## RSH-064 acceptance boundary

- Establish preview, staging, production and rollback is locked at `src/game/preview-staging/`;
- `preview_channel_defined` = `True`;
- `staging_channel_defined` = `True`;
- `production_channel_defined` = `True`;
- `rollback_procedure_locked` = `True`;
- `public_distribution` = `False`;
- P1-12 stays OPEN — long-soak is not in required CI;
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle/context-loss sources and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-065 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 64 |
| Deferred | 3 |
| Remaining | 3 |
| Queue head | RSH-065 |
| RSH-065 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-065 may be created or executed.
