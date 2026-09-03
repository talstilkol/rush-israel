# RUSH Israel — NEXT Contract

**Version:** 15.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-032 implementation base:** `04d922adc712a73cb0ccc7bd444a64b7b9157afd`
**State effective on:** merge of the RSH-032 pull request
**Next unit:** `RSH-033` — deferred and not authorised

## Authority

The current plain `next` / `המשך` instruction authorised exactly RSH-032. That authority is consumed on validated merge and does not extend to RSH-033.

## RSH-032 acceptance boundary

- Night look stays `night` (exposure 1.22, wetness 0.22, night 1, vis 0.9);
- night lights stay hemi `0x6a88b0/0x2a241c/0.52`, key `0xc8d4e8/0.38`, fill `0xffc070/0.48`, ambient `0x4a6080/0.28`;
- baked night sky stays `/game/sky-night.png` 1024×512 equirect, not HDRI;
- IBL stays the live tiny three-object PMREM (`bakeEnv(night=true)`), no disc/ground at night;
- headlights stay two `0xfff1c8` spots at intensity 28 with emissive 5.2;
- weather stays `clear,rain,storm,hamsin` with default `clear`;
- default boot stays day / clear;
- GIS/navigation claims and owner freeze remain forbidden;
- `sky-assets.ts`, `postfx.ts`, `world.ts`, `car-mesh.ts`, `physics.ts`, engine lighting, Ayalon locks and `ayalon.lock` are unchanged;
- no RSH-033 physics-calibration structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 32 |
| Deferred | 35 |
| Remaining | 35 |
| Queue head | RSH-033 |
| RSH-033 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-033 may be created or executed.
