# RUSH Israel — NEXT Contract

**Version:** 17.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-034 implementation base:** `550c681445b2473cbd377131b60715ade0e58774`
**State effective on:** merge of the RSH-034 pull request
**Next unit:** `RSH-035` — deferred and not authorised

## Authority

The current plain `next` / `המשך` instruction authorised exactly RSH-034. That authority is consumed on validated merge and does not extend to RSH-035.

## RSH-034 acceptance boundary

- live Version 1 audio stays Web Audio `oscillator` with four radio stations Pulse 101 / Yam FM / Underground / White Night at `126 / 94 / 138 / 108` BPM;
- FMOD, Howler and streamed music stay forbidden;
- keyboard steer is `A`/`←` = `+1` and `D`/`→` = `-1`; throttle / brake are `W`/`↑` and `S`/`↓`;
- HUD speed is integer km/h from `speed * 3.6`;
- touch stays `md:hidden` with Rewind, Brake, Drift, Nitro and Gas;
- gamepad stays index `0` with `padCurve(dead 0.12, exp 1.6)` and no force-feedback;
- `audio.ts`, `input.ts`, `hud.tsx`, `touch-controls.tsx`, `cars.ts`, `physics.ts` and `package.json` are not rewritten;
- GIS/navigation claims, owner freeze and public distribution remain forbidden;
- night/daylight/Ayalon/physics locks stay unchanged;
- no RSH-035 golden-pack structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 34 |
| Deferred | 33 |
| Remaining | 33 |
| Queue head | RSH-035 |
| RSH-035 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-035 may be created or executed.
