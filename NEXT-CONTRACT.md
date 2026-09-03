# RUSH Israel — NEXT Contract

**Version:** 18.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-035 implementation base:** `0f53ae1e1451c3eff30a15829c0c0f43762feeb4`
**State effective on:** merge of the RSH-035 pull request
**Next unit:** `RSH-036` — deferred and not authorised

## Authority

The current plain `next` / `המשך` instruction authorised exactly RSH-035. That authority is consumed on validated merge and does not extend to RSH-036.

## RSH-035 acceptance boundary

- the unique Ayalon golden pack is the existing 20 non-placeholder Ayalon / HaShalom frames;
- `hashalom-g04.png`, `hashalom-g05.png`, `hashalom-g06.png` and `hashalom-ramp.png` remain non-authority placeholders with SHA-256 `38a303adb7188d398628e58223973cb31d37ccf37d597da33c8ac442b4052094`;
- pixel-golden stays frames `ayalon-day-g01.png`, `ayalon-day-g05.png`, `ayalon-day-g07.png`, `ayalon-night-g08.png` at threshold `0.12` / fail `8%`;
- `ayalon.lock` stays generation `11`;
- owner unique-pack approval is recorded; placeholders are not unique evidence;
- Ayalon freeze, GIS/navigation claims and public distribution remain forbidden;
- golden PNG bytes, `ayalon.lock`, `hashalom-photo.json`, track / world / physics / audio / HUD sources and `package.json` are not rewritten;
- no RSH-036 freeze structure exists.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 35 |
| Deferred | 32 |
| Remaining | 32 |
| Queue head | RSH-036 |
| RSH-036 authorised | No |
| Current authority remaining | 0 |
| Save schema version | 3 |
| Unverified asset files | 66 |
| Release gates | 0/13 |

A new explicit owner instruction is required before RSH-036 may be created or executed.
