# RUSH Israel — NEXT Contract

**Version:** 14.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-025 implementation base:** `6597d7251d0f9c7ef24bf4b20ca44506bf651970`
**State effective on:** merge of the RSH-025 pull request
**Next unit:** `RSH-026` — deferred and not authorised

## Authority

The current plain `next` instruction authorised exactly RSH-025. That authority is consumed on validated merge and does not extend to RSH-026.

## RSH-025 acceptance boundary

- Version 1 Ayalon identity remains id `ayalon`, width `28`, theme `highway`, open A→B;
- the existing golden/reference pack is hashed, including four byte-identical HaShalom placeholders;
- pixel-golden remains threshold `0.12` and fail `>8%`;
- GIS/navigation claims and owner freeze are forbidden;
- track source, world, physics, rendering, save/records and `ayalon.lock` are unchanged;
- no RSH-026 implementation structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 25 |
| Deferred | 42 |
| Remaining | 42 |
| Queue head | RSH-026 |
| RSH-026 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-026 may be created or executed.
