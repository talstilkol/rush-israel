# RUSH Israel — NEXT Contract

**Version:** 23.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-040 implementation base:** `da690504d360a5b06f53783e9f86e0d7bf73cc01`
**State effective on:** merge of the RSH-040 pull request
**Next unit:** `RSH-041` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-040 after RSH-039 merged. That authority is consumed on validated merge and does not extend to RSH-041.

## RSH-040 acceptance boundary

- 20 enter-exit leak cycles are locked at `src/game/leak-cycles/`;
- live `ResourceRegistry.disposeAll` stays idempotent;
- live Object3D disposal still excludes shared textures;
- Playwright 20-cycle soak harness stays `dTex≤2` / `dGeo≤2`;
- required CI keeps the 2-cycle soak-smoke;
- context-loss recovery is not enforced (RSH-041);
- 30-minute soak is not enforced (RSH-042);
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 stays OPEN — no production JS/asset byte-size CI check;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality/`stream-flag.ts`/registry/soak sources and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-041 context-loss structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 40 |
| Deferred | 27 |
| Remaining | 27 |
| Queue head | RSH-041 |
| RSH-041 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-041 may be created or executed.
