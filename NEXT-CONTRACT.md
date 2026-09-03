# RUSH Israel — NEXT Contract

**Version:** 15.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-027 implementation base:** `dddae060b76ac2b4abe8de1046a374e8eb7725fc`
**State effective on:** merge of the RSH-027 pull request
**Next unit:** `RSH-028` — deferred and not authorised

## Authority

The current plain `next` / `המשך` instruction authorised exactly RSH-027. That authority is consumed on validated merge and does not extend to RSH-028.

## RSH-027 acceptance boundary

- Version 1 Ayalon remains id `ayalon`, width `28`, 8 lanes of 3.5, theme `highway`, open A→B;
- interchange ramps stay 50 (6×7 plus Galuyot 4, LaGuardia 2, flyovers 2) with deck height 9.4;
- edge barriers stay visual/physical walls at `width/2 + 1.55` with radii `+0.62` / `-1.05`;
- open-track checkpoints stay eight fractions of `(i + 1) / 8.15`;
- GIS/navigation claims and owner freeze remain forbidden;
- track source, world, builders, spline, physics, rendering, save/records and `ayalon.lock` are unchanged;
- no RSH-028 landmark lock structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 27 |
| Deferred | 40 |
| Remaining | 40 |
| Queue head | RSH-028 |
| RSH-028 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-028 may be created or executed.
