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

`TrackId` and `TRACK-CATALOGUE-CLASSIFICATION.json` share one canonical ID order.
The existing `TRACKS` array has an independent runtime order. Both must contain the
same 56 unique IDs, but RSH-013 does not reorder runtime data. RSH-014 must preserve
the existing runtime order exactly while relocating definitions.

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

## Point collection forms

The committed catalogue uses two reviewed point forms:

1. an array literal containing at least three entries;
2. the Ayalon zero-argument IIFE, which creates a local array, appends generated
   points with `push`, and returns that same array.

Other point-expression forms fail closed.

## Semantic enforcement

The validator parses TypeScript with the compiler API and fails when:

- `TrackId`, `CityId` or `TrackDef` drift from the machine schema;
- the source does not parse cleanly;
- the catalogue contains other than 56 object-literal definitions;
- definition IDs are missing, duplicated or differ as a set from either authority;
- a track lacks a required field or contains an unknown top-level field;
- an image path differs from `/tracks/<TrackId>.jpg`;
- width, seed or checkpoint values are invalid;
- points, sky, elevation, street, POI, water or clear-zone structures are malformed;
- a street range is outside normalized progress or is reversed;
- the exact eight-track MVP set changes;
- the pinned ordered runtime-definition digest changes;
- release-gate truth differs from `0/13`.

## Runtime-data pin

The validator hashes each complete `ObjectLiteralExpression.getText()` and then
hashes the ordered array of `{ id, source_sha256 }` records. This protects every
localized string, coordinate expression, visual setting, seed and gameplay field,
while preserving the current runtime order independently of canonical `TrackId` order.
The exact digest is captured by exact-head CI and then committed before acceptance.

## Compile-time boundary

`src/game/track-schema.ts` exports `defineTrack` and `defineTracks`. These helpers
preserve literal inference while requiring `TrackDef` compatibility. RSH-014 may use
them at module boundaries.

## RSH-014 transition rule

RSH-014 may relocate the 56 definitions into one module per track only when the
ordered runtime-definition digest remains unchanged. It may adapt the validator to
the modular source layout, but it may not change a track ID, runtime order, MVP
membership, geometry, localized text, image, environment, seed or gameplay data.

## Decision

| Question | Answer |
|---|---|
| Is there one machine-readable track schema? | **Yes** |
| Does it agree with `TrackDef` and all 56 IDs? | **Required by CI** |
| Is canonical ID order the same as runtime definition order? | **No — intentionally independent** |
| May RSH-014 change runtime track data or order? | **No** |
| Is RSH-015 authorized by this unit? | **No** |
| Are any release gates closed by this unit? | **No — 0/13 remains** |
