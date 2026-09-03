# RSH-035 — Produce the unique Ayalon golden pack and owner approval record

**Unit:** RSH-035
**Implementation base:** `0f53ae1e1451c3eff30a15829c0c0f43762feeb4`
**Base tree:** `3700c72ab79aefb96a0ba65adf92102a8058522f`
**Branch:** `agent/rsh-035-ayalon-golden`
**State effective on:** validated merge of the RSH-035 pull request

## Acceptance boundary

RSH-035 promotes the unique existing Ayalon / HaShalom golden frames to a
trusted visual authority and records explicit owner approval of that pack. It
does **not** regenerate screenshots, bump `ayalon.lock`, rewrite track /
world / physics / audio / HUD sources, hash every transitive Ayalon
dependency (RSH-036), or grant GIS accuracy / public distribution / the
Ayalon release freeze.

The four byte-identical HaShalom placeholders remain in the reference
inventory so later units cannot treat them as unique evidence.

## Locked identity (must remain exact)

| Field | Required value |
|---|---|
| Track id | `ayalon` |
| Unique authority frames | 20 existing Ayalon / HaShalom PNGs |
| Non-authority placeholders | `hashalom-g04.png`, `hashalom-g05.png`, `hashalom-g06.png`, `hashalom-ramp.png` |
| Placeholder SHA-256 | `38a303adb7188d398628e58223973cb31d37ccf37d597da33c8ac442b4052094` |
| Pixel-golden frames | `ayalon-day-g01.png`, `ayalon-day-g05.png`, `ayalon-day-g07.png`, `ayalon-night-g08.png` |
| Pixel threshold / fail | `0.12` / `8%` |
| `ayalon.lock` generation | `11` |
| `ayalon.lock` hash | `0c34b9d1f9ded36eaa8400c7aaba48a4f725033bfe25412a4648c36c73910d48` |
| Owner unique-pack approval | granted by this unit |
| Placeholders as unique evidence | forbidden |
| Ayalon freeze (RSH-036) | forbidden |
| GIS / navigation claim | forbidden |
| Public distribution | forbidden |

## Runtime preservation

| Domain | Change |
|---|---:|
| Golden PNG bytes | `0` |
| `golden-baseline/ayalon.lock` | `0` |
| `golden-baseline/hashalom-photo.json` | `0` |
| `src/game/tracks/ayalon.ts` | `0` |
| World / builders / physics / cars | `0` |
| Audio / HUD / input | `0` |
| `package.json` | `0` |
| Assets under `public/` | `0` |
| Release gates green | `0` |

The lock module at `src/game/ayalon-golden/` is the canonical unique-pack
record later G5 units may import. Fail-closed checking proves the live files
still match the unique hashes and that placeholders stay non-authority.

## Deferred boundary

RSH-036 — Freeze Ayalon and hash all transitive dependencies — remains
deferred, unauthorized and uncreated. RSH-035 does not add
`src/game/ayalon-freeze/` or RSH-036 transport files.
