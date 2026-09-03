# RUSH Israel — NEXT Contract

**Version:** 19.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-036 implementation base:** `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a`
**State effective on:** merge of the RSH-036 pull request
**Next unit:** `RSH-037` — deferred and not authorised

## Authority

The current plain `next` / `המשך` instruction authorised exactly RSH-036. That authority is consumed on validated merge and does not extend to RSH-037.

## RSH-036 acceptance boundary

- Ayalon freeze is granted at `src/game/ayalon-freeze/` with 36 transitive SHA-256 hashes;
- historical unique-pack record stays `freeze_granted=false` on `AYALON-OWNER-APPROVAL.json` and `src/game/ayalon-golden/pack.ts`;
- unique authority frames stay 20; four HaShalom placeholders stay non-authority at `38a303adb7188d398628e58223973cb31d37ccf37d597da33c8ac442b4052094`;
- pixel-golden stays `ayalon-day-g01.png`, `ayalon-day-g05.png`, `ayalon-day-g07.png`, `ayalon-night-g08.png` at threshold `0.12` / fail `8%`;
- `ayalon.lock` stays generation `11`;
- GIS/navigation claims, owner-settings freeze and public distribution remain forbidden;
- golden PNG bytes, `ayalon.lock`, track / world / physics / cars / audio / HUD / input sources and `package.json` are not rewritten;
- no RSH-037 perf-instrument or quality-profiles structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 36 |
| Deferred | 31 |
| Remaining | 31 |
| Queue head | RSH-037 |
| RSH-037 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-037 may be created or executed.
