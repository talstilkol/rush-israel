# RUSH Israel — NEXT Contract

**Version:** 21.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-038 implementation base:** `91754100fc6a5d7bfc852e6aafa28cd17c1762ba`
**State effective on:** merge of the RSH-038 pull request
**Next unit:** `RSH-039` — deferred and not authorised

## Authority

The current standing owner instruction to finish the master plan authorised RSH-038 after RSH-037 merged. That authority is consumed on validated merge and does not extend to RSH-039.

## RSH-038 acceptance boundary

- quality profiles and dynamic-quality hysteresis are locked at `src/game/quality-profiles/`;
- live profiles remain `src/rendering/QualityProfile.ts` (compat / balanced / high / ultra / photo);
- live hysteresis remains `src/rendering/DynamicQualityController.ts` (drop p95>20 / 90 frames, raise p95<16 / 5 s);
- budgets are not enforced (RSH-039);
- P1-13 stays OPEN — no accepted real-device baseline;
- Ayalon freeze stays granted with 36 hashes unchanged;
- RSH-037 instrument lock stays historical (`QUALITY_PROFILES_DEFINED = false` there);
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources, engine adapters, live quality sources and `package.json` are not rewritten;
- GIS/navigation claims and public distribution remain forbidden;
- no RSH-039 perf-budgets structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 38 |
| Deferred | 29 |
| Remaining | 29 |
| Queue head | RSH-039 |
| RSH-039 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-039 may be created or executed.
