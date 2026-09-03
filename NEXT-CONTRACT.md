# RUSH Israel — NEXT Contract

**Version:** 15.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-031 implementation base:** `7a4451f4c55fe8aa44ad7999fc6de6e1c78c868c`
**State effective on:** merge of the RSH-031 pull request
**Next unit:** `RSH-032` — deferred and not authorised

## Authority

The current plain `next` / `המשך` instruction authorised exactly RSH-031. That authority is consumed on validated merge and does not extend to RSH-032.

## RSH-031 acceptance boundary

- Daylight look stays `summer14` (exposure 0.56, wetness 0.18, night 0, vis 1);
- day lights stay hemi `0xa8c8e8/0x4a5248/0.68`, key `0xfff0d0/1.12`, fill `0xc4d8f0/0.28`, ambient `0xb0c4d8/0.32`;
- baked day sky stays `/game/sky-day.png` 1024×512 equirect, not HDRI;
- IBL stays the live tiny three-object PMREM (`bakeEnv(night=false)`), not a real-sky IBL;
- color pipeline stays sRGB + ACES filmic;
- GIS/navigation claims and owner freeze remain forbidden;
- `sky-assets.ts`, `postfx.ts`, `world.ts`, engine lighting, Ayalon locks and `ayalon.lock` are unchanged;
- no RSH-032 night/headlight/weather structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 31 |
| Deferred | 36 |
| Remaining | 36 |
| Queue head | RSH-032 |
| RSH-032 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-032 may be created or executed.
