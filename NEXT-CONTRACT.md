# RUSH Israel — NEXT Contract

**Version:** 15.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-028 implementation base:** `d9b25b6ad8a035041c699d64860f9dac357b774d`
**State effective on:** merge of the RSH-028 pull request
**Next unit:** `RSH-029` — deferred and not authorised

## Authority

The current plain `next` / `המשך` instruction authorised exactly RSH-028. That authority is consumed on validated merge and does not extend to RSH-029.

## RSH-028 acceptance boundary

- Version 1 Ayalon remains id `ayalon`, width `28`, theme `highway`, open A→B;
- track POIs stay nine inspired placements (stations + Azrieli/ToHa/Electra/Moshe Aviv/Midtown);
- builder `place*` calls stay eight, plus IBM, Yovel, Platinum, TAU, HaShalom tube and mall recipes;
- GIS/navigation claims and owner freeze remain forbidden;
- track source, world, builders, spline, physics, rendering, save/records and `ayalon.lock` are unchanged;
- no RSH-029 asphalt lock structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 28 |
| Deferred | 39 |
| Remaining | 39 |
| Queue head | RSH-029 |
| RSH-029 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-029 may be created or executed.
