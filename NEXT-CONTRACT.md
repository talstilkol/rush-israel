# RUSH Israel — NEXT Contract

**Version:** 20.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-037 implementation base:** `4904161cc786061acc11942f76ed5666eb5ed61f`
**State effective on:** merge of the RSH-037 pull request
**Next unit:** `RSH-038` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-037 after RSH-036 merged. That authority is consumed on validated merge and does not extend to RSH-038.

## RSH-037 acceptance boundary

- performance instrumentation is locked at `src/game/perf-instrument/` with p50/p95/p99, draw calls, triangles and memory sampling;
- live sampling remains `RenderTelemetry` (cap 120) plus `renderer.info` GPU counters;
- JS heap stays optional `performance.memory`;
- budgets are not enforced (RSH-039);
- quality profiles are not defined (RSH-038);
- P1-13 stays OPEN — no accepted real-device baseline;
- Ayalon freeze stays granted with 36 hashes unchanged;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-038 quality-profiles structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 37 |
| Deferred | 30 |
| Remaining | 30 |
| Queue head | RSH-038 |
| RSH-038 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-038 may be created or executed.
