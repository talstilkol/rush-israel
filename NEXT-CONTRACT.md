# RUSH Israel — NEXT Contract

**Version:** 15.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-026 implementation base:** `1714aa96dc2a0fd402eed004b591541b41bfdb83`
**State effective on:** merge of the RSH-026 pull request
**Next unit:** `RSH-027` — deferred and not authorised

## Authority

The current plain `next` instruction authorised exactly RSH-026. That authority is consumed on validated merge and does not extend to RSH-027.

## RSH-026 acceptance boundary

- Version 1 Ayalon remains id `ayalon`, width `28`, 8 lanes of 3.5, theme `highway`, open A→B;
- the live IEEE spline stays 27 samples (last latitude 32.104) and is hashed, not rewritten;
- the opposite carriageway stays visual-only at offset 46;
- GIS/navigation claims and owner freeze remain forbidden;
- track source, world, physics, rendering, save/records and `ayalon.lock` are unchanged;
- no RSH-027 collider/ramp lock structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 26 |
| Deferred | 41 |
| Remaining | 41 |
| Queue head | RSH-027 |
| RSH-027 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-027 may be created or executed.
