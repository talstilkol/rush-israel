# RUSH Israel — Version 1 Track Catalogue Classification

**Unit:** RSH-010  
**Observed source commit:** `69765febef85d732d9ba79fe260fec78ee76b2df`  
**Machine authority:** `TRACK-CATALOGUE-CLASSIFICATION.json`  
**Source authorities:** `src/game/types.ts`, `src/game/tracks.ts`, `PRODUCT-DEFINITION.json`

## Result

| Metric | Exact value |
|---|---:|
| Live catalogue entries | 56 |
| Version 1 MVP | 8 |
| Deferred, retained | 48 |
| Deleted tracks | 0 |
| Release gates green | 0/13 |

## Frozen-name to repository-ID mapping

| # | Frozen Version 1 name | Exact repository ID |
|---:|---|---|
| 1 | Ayalon | `ayalon` |
| 2 | Rothschild | `rothschild` |
| 3 | Yarkon–Reading | `namal` |
| 4 | Jaffa | `oldjaffa` |
| 5 | Jerusalem–Scopus | `scopus` |
| 6 | Haifa–Carmel | `haifa` |
| 7 | Ramon | `ramon` |
| 8 | Hermon | `hermon` |

Mapping notes:

- `Yarkon–Reading` maps to `namal`: the live definition is North Tel Aviv and explicitly covers Reading Power Station and Yarkon Park.
- `Jaffa` maps to `oldjaffa`: the live definition covers Jaffa Port and the old-city circuit.
- `Jerusalem–Scopus` maps to `scopus`: the live definition is Mount Scopus.
- `Haifa–Carmel` maps to `haifa`: the live definition is Carmel Descent.

## Complete 56-entry classification

| Ordinal | Repository ID | Status | Frozen MVP name |
|---:|---|---|---|
| 1 | `hayarkon` | **DEFERRED** | — |
| 2 | `oldjaffa` | **MVP** | Jaffa |
| 3 | `telaviv` | **DEFERRED** | — |
| 4 | `namal` | **MVP** | Yarkon–Reading |
| 5 | `jerusalem` | **DEFERRED** | — |
| 6 | `haifa` | **MVP** | Haifa–Carmel |
| 7 | `eilat` | **DEFERRED** | — |
| 8 | `rothschild` | **MVP** | Rothschild |
| 9 | `ayalon` | **MVP** | Ayalon |
| 10 | `caesarea` | **DEFERRED** | — |
| 11 | `deadsea` | **DEFERRED** | — |
| 12 | `acre` | **DEFERRED** | — |
| 13 | `beersheva` | **DEFERRED** | — |
| 14 | `netanya` | **DEFERRED** | — |
| 15 | `hw1` | **DEFERRED** | — |
| 16 | `herzliya` | **DEFERRED** | — |
| 17 | `hanikra` | **DEFERRED** | — |
| 18 | `haifaport` | **DEFERRED** | — |
| 19 | `stellamaris` | **DEFERRED** | — |
| 20 | `tiberias` | **DEFERRED** | — |
| 21 | `golan` | **DEFERRED** | — |
| 22 | `hermon` | **MVP** | Hermon |
| 23 | `hw6` | **DEFERRED** | — |
| 24 | `hw2` | **DEFERRED** | — |
| 25 | `hw90` | **DEFERRED** | — |
| 26 | `petah` | **DEFERRED** | — |
| 27 | `rishon` | **DEFERRED** | — |
| 28 | `ashdod` | **DEFERRED** | — |
| 29 | `ashkelon` | **DEFERRED** | — |
| 30 | `scopus` | **MVP** | Jerusalem–Scopus |
| 31 | `walls` | **DEFERRED** | — |
| 32 | `modiin` | **DEFERRED** | — |
| 33 | `ramon` | **MVP** | Ramon |
| 34 | `hw40` | **DEFERRED** | — |
| 35 | `eilatmtn` | **DEFERRED** | — |
| 36 | `gushdan` | **DEFERRED** | — |
| 37 | `nazareth` | **DEFERRED** | — |
| 38 | `tzfat` | **DEFERRED** | — |
| 39 | `masada` | **DEFERRED** | — |
| 40 | `batyam` | **DEFERRED** | — |
| 41 | `rehovot` | **DEFERRED** | — |
| 42 | `nahariya` | **DEFERRED** | — |
| 43 | `ramla` | **DEFERRED** | — |
| 44 | `holon` | **DEFERRED** | — |
| 45 | `beitshan` | **DEFERRED** | — |
| 46 | `hadera` | **DEFERRED** | — |
| 47 | `lod` | **DEFERRED** | — |
| 48 | `kshmona` | **DEFERRED** | — |
| 49 | `raanana` | **DEFERRED** | — |
| 50 | `afula` | **DEFERRED** | — |
| 51 | `ksaba` | **DEFERRED** | — |
| 52 | `arad` | **DEFERRED** | — |
| 53 | `centralpark` | **DEFERRED** | — |
| 54 | `timessquare` | **DEFERRED** | — |
| 55 | `brooklynbridge` | **DEFERRED** | — |
| 56 | `manhattan` | **DEFERRED** | — |

## Control rules

- Every live `TrackId` must appear exactly once.
- The eight MVP IDs are fixed by this unit; implicit expansion is prohibited.
- All 48 deferred entries remain in source and are not deleted.
- A later change requires explicit owner authorization and a reviewed canonical change.
- Classification does not claim release readiness; release gates remain 0/13.
