# RUSH Israel — NEXT Contract

**Version:** 15.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-029 implementation base:** `e068f7a93b7a9d2febb86d25a7e9ba57f5733a39`
**State effective on:** merge of the RSH-029 pull request
**Next unit:** `RSH-030` — deferred and not authorised

## Authority

The current plain `next` / `המשך` instruction authorised exactly RSH-029. That authority is consumed on validated merge and does not extend to RSH-030.

## RSH-029 acceptance boundary

- Version 1 Ayalon remains id `ayalon`, width `28`, 8-lane baked asphalt kit;
- sidewalks stay absent on the highway theme;
- markings stay live edge/dash/chevron/arrow tokens;
- signs stay six interchange gantries, five station gantries and speed-90 plates;
- GIS/navigation claims and owner freeze remain forbidden;
- track source, world, builders, spline, physics, rendering, save/records and `ayalon.lock` are unchanged;
- no RSH-030 hero-car structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 29 |
| Deferred | 38 |
| Remaining | 38 |
| Queue head | RSH-030 |
| RSH-030 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-030 may be created or executed.
