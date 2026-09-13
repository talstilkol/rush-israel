# RUSH Israel — NEXT Contract

**Version:** 48.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-065 implementation base:** `0371d78de65279d8db7cdba2d65ce1ee332e2da0`
**State effective on:** merge of the RSH-065 pull request
**Next unit:** `RSH-066` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-065 after RSH-064 merged. That authority is consumed on validated merge and does not extend to RSH-066.

## RSH-065 acceptance boundary

- Publish and evaluate v0.1.0-alpha.1 is locked at `src/game/alpha-publish/`;
- `private_alpha_identity` = `0.1.0-alpha.1`;
- `github_release_created` = `False`;
- `public_distribution` = `False`;
- `owner_visibility_private` = `False`;
- `rc1_produced` = `False`;
- P1-12 stays OPEN — long-soak is not in required CI;
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle/context-loss sources and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-066 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 65 |
| Deferred | 2 |
| Remaining | 2 |
| Queue head | RSH-066 |
| RSH-066 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-066 may be created or executed.
