# RUSH Israel — Canonical Track Schema

**Unit:** RSH-013  
**Machine authority:** `TRACK-SCHEMA.json`  
**Observed source commit:** `94524201dfe87f1f22f8d8bdd9d97aad507c0438`  
**Validator:** `scripts/check-track-schema.mjs`

## Exact catalogue boundary

| Metric | Exact value |
|---|---:|
| Track definitions | **56** |
| Unique `TrackId` values | **56** |
| Version 1 MVP tracks | **8** |
| Deferred tracks retained | **48** |
| Release gates green | **0/13** |

The canonical order is shared by `TrackId`, `TRACKS` and
`TRACK-CATALOGUE-CLASSIFICATION.json`. Additions, removals, reordering or implicit
MVP promotion are prohibited without explicit owner authorization.

## Required TrackDef properties

| Group | Properties |
|---|---|
| Identity | `id`, `nameHe`, `nameEn`, `city`, `cityHe`, `cityEn` |
| Presentation | `lengthHint`, `description`, `descriptionEn`, `image` |
| Geometry | `width`, `points`, `elevation` |
| Environment | `sky`, `ground`, `sand`, `theme` |
| Navigation | `streets`, `pois`, `checkpointCount` |
| Determinism | `seed` |

Optional properties are exactly `water`, `waters`, `clearZones` and `open`.
Unknown or duplicate top-level properties are rejected.

## Semantic enforcement

The validator parses the TypeScript source with the TypeScript compiler API and
fails when any of the following occurs:

- `TrackId`, `CityId` or `TrackDef` drift from the machine schema;
- the source does not parse cleanly;
- the catalogue contains other than 56 object-literal definitions;
- IDs are missing, duplicated, reordered or differ from the classification authority;
- a track lacks a required field or contains an unknown top-level field;
- an image path differs from `/tracks/<TrackId>.jpg`;
- width, seed or checkpoint values are invalid;
- points, sky, elevation, street, POI, water or clear-zone structures are malformed;
- a street range is outside normalized progress or is reversed;
- the exact eight-track MVP set changes;
- release-gate truth differs from `0/13`.

## Compile-time boundary

`src/game/track-schema.ts` exports `defineTrack` and `defineTracks`. These helpers
preserve literal inference while requiring `TrackDef` compatibility. RSH-014 may use
them when relocating each definition into its own module.

## RSH-014 transition rule

RSH-014 is authorized to relocate the 56 definitions into one module per track only
when all observable runtime data and canonical ordering remain unchanged. It may
adapt the validator to the modular source layout, but it may not change a track ID,
MVP membership, geometry, localized text, image, environment, seed or gameplay data.

## Decision

| Question | Answer |
|---|---|
| Is there one machine-readable track schema? | **Yes** |
| Does it agree with `TrackDef` and all 56 IDs? | **Required by CI** |
| May RSH-014 change runtime track data? | **No** |
| Is RSH-015 authorized by this unit? | **No** |
| Are any release gates closed by this unit? | **No — 0/13 remains** |
