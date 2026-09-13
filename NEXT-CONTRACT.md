# RUSH Israel — NEXT Contract

**Version:** 46.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-063 implementation base:** `58e58a912c24d84cc07eb501a30262e8590e4e0d`
**State effective on:** merge of the RSH-063 pull request
**Next unit:** `RSH-064` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-063 after RSH-062 merged. That authority is consumed on validated merge and does not extend to RSH-064.

## RSH-063 acceptance boundary

- Establish SemVer, changelog and release automation is locked at `src/game/semver-release/`;
- `semver_locked` = `True`;
- `changelog_locked` = `True`;
- `package_json_frozen` = `True`;
- `public_distribution` = `False`;
- `github_release_created` = `False`;
- P1-12 stays OPEN — long-soak is not in required CI;
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak/leak-cycle/context-loss sources and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-064 structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 63 |
| Deferred | 4 |
| Remaining | 4 |
| Queue head | RSH-064 |
| RSH-064 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-064 may be created or executed.
