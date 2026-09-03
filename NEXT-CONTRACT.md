# RUSH Israel — NEXT Contract

**Version:** 15.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-030 implementation base:** `a42a99bed98c4a55b343e744cf374e68d3b51899`
**State effective on:** merge of the RSH-030 pull request
**Next unit:** `RSH-031` — deferred and not authorised

## Authority

The current plain `next` / `המשך` instruction authorised exactly RSH-030. That authority is consumed on validated merge and does not extend to RSH-031.

## RSH-030 acceptance boundary

- Version 1 ships exactly five fictional cars (`sabra`, `carmel`, `kfir`, `negev`, `yam`);
- bodies stay the live extruded Meshopt kit (`gt`, `hatch`, `muscle`, `rally`, `super`);
- scanned / licensed-real / user-supplied hero glTF remain absent;
- LOD caps stay 40000 / 12000 / 4000 with player-car LOD0;
- silhouette gate stays five distinct 64×24 hashes;
- GIS/navigation claims and owner freeze remain forbidden;
- `cars.ts`, `car-mesh.ts`, `car-assets.ts`, physics, rendering, Ayalon locks and `ayalon.lock` are unchanged;
- no RSH-031 lighting structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 30 |
| Deferred | 37 |
| Remaining | 37 |
| Queue head | RSH-031 |
| RSH-031 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-031 may be created or executed.
