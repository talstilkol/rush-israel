# RUSH Israel — NEXT Contract

**Version:** 16.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-033 implementation base:** `f8d055c86b80ba1a72555e41668e071f74b32536`
**State effective on:** merge of the RSH-033 pull request
**Next unit:** `RSH-034` — deferred and not authorised

## Authority

The current plain `next` / `המשך` instruction authorised exactly RSH-033. That authority is consumed on validated merge and does not extend to RSH-034.

## RSH-033 acceptance boundary

- `PHYSICS_VERSION` becomes `7`;
- five fictional `zeroTo100` claims stay `8.4 / 6.6 / 4.9 / 5.8 / 3.5` and `cars.ts` is not rewritten;
- launch law uses `launchAccel` with aero/rolling compensation below `V100_MPS` so net 0–100 matches the claim band `±15%`;
- gear dump `speed *= 0.94` is not applied while `|speed| <= V100_MPS`;
- `qa:accel` fails closed on `claimGaps` as well as regression drift;
- GIS/navigation claims, owner freeze and public distribution remain forbidden;
- night/daylight/Ayalon locks, `ayalon.lock` and package.json stay unchanged;
- no RSH-034 audio / HUD / input structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 33 |
| Deferred | 34 |
| Remaining | 34 |
| Queue head | RSH-034 |
| RSH-034 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-034 may be created or executed.
