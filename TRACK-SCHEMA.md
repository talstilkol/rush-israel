# RUSH Israel — Canonical Modular Track Authority

**Units:** RSH-013 schema; RSH-014 modularization
**Machine authorities:** `TRACK-SCHEMA.json`, `TRACK-MODULE-MANIFEST.json`
**Implementation base:** `0273520da4924cb3e71ff41b2ea75788a45bf757`
**Validator:** `scripts/check-track-schema.mjs`

## Exact boundary

| Metric | Value |
|---|---:|
| Per-track modules | 56 |
| Unique TrackId values | 56 |
| MVP | 8 |
| Deferred | 48 |
| Runtime data changes | 0 |
| Runtime order changes | 0 |
| Release gates | 0/13 |

Every track is defined exactly once in `src/game/tracks/<id>.ts` and default-exported through the canonical `defineTrack` helper. `src/game/tracks/index.ts` constructs `TRACKS` with `defineTracks` in the preserved runtime order. `src/game/tracks.ts` remains the stable public facade.

## Integrity

| Authority | Exact identity |
|---|---|
| Reconstructed RSH-013 source Git blob | `e26454223f8a598cdf516af7c7c3f494162e2616` |
| Ordered runtime-definition SHA-256 | `a1ccf6f71ca7c4bad7fbc1280aecb04cdc4390ca400cf183cd3fde916d14294d` |
| Aggregate SHA-256 | `1f10ef1b656fb61b414aed82a1918ade65c5093fcedf486b2aa3b37527d5dfb7` |
| `types.ts` Git blob | `f2ce095b2fcd4f9fa6f55ce0c3413ffa8d09d6c0` |
| `math.ts` Git blob | `c215daef16056d5d7c142db964ed93f82c74f8e8` |
| `world.ts` Git blob | `07b7e0b559e66f89641357db5aa2be8bcd8c3135` |

The manifest stores exact source identities for all 56 modules, the shared authority, the ordered index and the facade. A deterministic loader reconstructs the pre-modularization source byte-for-byte from those authorities; no duplicate runtime catalogue is stored. Existing schema, Ayalon-lock and mutation tests therefore continue to validate the same accepted data.

## Change control

RSH-014 may relocate definitions only. It changes no IDs, data, order, classification, assets or dependencies. RSH-015 remains unauthorised and cannot alter this authority without a new explicit owner instruction and reviewed validation.
