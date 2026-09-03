# RSH-025 — Ayalon Acceptance Criteria and Reference Pack

**Unit:** RSH-025
**Implementation base:** `6597d7251d0f9c7ef24bf4b20ca44506bf651970`
**Base tree:** `1fb7bd783dba974ff1957f96841161f0c9db3323`
**Branch:** `agent/rsh-025-ayalon-acceptance`
**State effective on:** validated merge of the RSH-025 pull request

## Acceptance boundary

RSH-025 defines the Version 1 Ayalon acceptance criteria and inventories the
existing golden/reference screenshots. It does **not** lock road geometry,
rewrite landmarks, change physics, grant owner freeze, or claim GIS accuracy.

The frozen Version 1 product remains a fictional one-carriageway highway
inspired by Highway 20. This unit records that identity so later G5 units
cannot silently expand Ayalon into an 8+8 GIS reconstruction.

## Track identity (must remain exact)

| Field | Required value |
|---|---|
| Track id | `ayalon` |
| Hebrew name | נתיבי איילון |
| English name | Ayalon Highway |
| Theme | `highway` |
| Open (A→B) | `true` |
| Width | `28` |
| Checkpoint count | `8` |
| Street segments | 6 named interchanges |
| POIs | 9 inspired landmarks |
| GIS / navigation claim | forbidden |

Named street segments, in order: Kibbutz Galuyot, HaHagana, LaGuardia,
HaShalom, Savidor Center, Tel Aviv University.

Inspired POIs: HaHagana Station, HaShalom Station, Savidor Center, University
Station, Azrieli, ToHa Tower, Electra Tower, Moshe Aviv Tower, Midtown TLV.

## Reference pack

The pack is the existing `golden-baseline/` Ayalon and HaShalom PNG set plus
`ayalon.lock` and `hashalom-photo.json`. RSH-025 hashes those files; it does
not regenerate them and does not bump `ayalon.lock`.

Pixel-golden gate already in the repo:

- frames: `ayalon-day-g01.png`, `ayalon-day-g05.png`, `ayalon-day-g07.png`,
  `ayalon-night-g08.png`
- comparator: `scripts/pixel-golden.mjs`
- threshold `0.12`; fail when more than `8%` of pixels differ

Honest pack defects that later units must not treat as unique evidence:

- `hashalom-g04.png`, `hashalom-g05.png`, `hashalom-g06.png` and
  `hashalom-ramp.png` are byte-identical placeholders (same SHA-256).
- Owner freeze is **not** granted here (RSH-035).
- Geometry/width/lane lock is **not** rewritten here (RSH-026).

## Preservation

| Domain | Change |
|---|---:|
| Track source `src/game/tracks/ayalon.ts` | `0` |
| World / builders | `0` |
| Physics | `0` |
| Rendering | `0` |
| Save / records / recovery | `0` |
| `ayalon.lock` hash | `0` |
| Production-security scan | `0` |
| Assets under `public/` | `0` |
| Direct dependencies | `0` |
| Release gates green | `0` |

## Deferred boundary

RSH-026 — Lock Ayalon road geometry, widths and lanes — and RSH-027 — Lock
Ayalon ramps, barriers, colliders and checkpoints — are accepted on validated
merge. RSH-028 through RSH-030 are accepted on validated merge. RSH-031 remains deferred, unauthorized and uncreated.
