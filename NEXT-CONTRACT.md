# RUSH Israel — NEXT Contract

**Version:** 22.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-039 implementation base:** `817ab7ed71d396b200188b16c27d627a1f2d7814`
**State effective on:** merge of the RSH-039 pull request
**Next unit:** `RSH-040` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-039 after RSH-038 merged. That authority is consumed on validated merge and does not extend to RSH-040.

## RSH-039 acceptance boundary

- bundle, streaming and cache budgets are locked at `src/game/perf-budgets/`;
- live cache remains `server/middleware/game-cache.ts` (`/game/` + `/basis/` immutable max-age=31536000) and HTML `no-cache`;
- glTF / mesh / music streaming stay off;
- Ayalon draw-call target is 80;
- production `finishNow` remains forbidden;
- leak cycles are not enforced (RSH-040);
- P1-13 stays OPEN — no accepted real-device baseline;
- P2-09 is CLOSED;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live cache/quality sources and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-040 leak-cycle structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 39 |
| Deferred | 28 |
| Remaining | 28 |
| Queue head | RSH-040 |
| RSH-040 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-040 may be created or executed.
