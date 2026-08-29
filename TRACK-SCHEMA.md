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
Unknown or duplicate top-level properties are rejected. The exported
`TRACK_REQUIRED_PROPERTIES` and `TRACK_OPTIONAL_PROPERTIES` arrays are checked both
at compile time and by the validator against the exact `TrackDef` partition.

## Type and catalogue authority

The validator compares the machine schema directly with:

- the complete `TrackId` union;
- the complete `CityId` union;
- the literal union declared by `TrackDef.theme`;
- the exact required and optional `TrackDef` keys;
- all 56 classification entries;
- the declared counts of **56 total, 8 MVP and 48 deferred**.

An unused enum member, incorrect count or incomplete helper-key list therefore fails
CI even when the current track objects do not exercise the drifted value.

## Point collection forms

The committed catalogue uses two reviewed point forms:

1. an array literal containing at least three entries;
2. the Ayalon zero-argument IIFE, which declares a local array, appends generated
   entries with `push`, and returns that same local array as its final statement.

The IIFE may not return a different array, contain nested functions or reassign the
returned array. Other point-expression forms fail closed.

## Runtime-data integrity

RSH-013 maintains two related SHA-256 authorities:

| Authority | Exact digest |
|---|---|
| Ordered track-definition closure | `27c256ee36387d02d986132e5e8505c1ca1cecad5588857286f400c78c215e3f` |
| Aggregate including configured support sources | `93ee4c2c8ed1bd3776cca0cdb6de559c6ad34a9220d60935a73fe65c8194f65e` |

The track-definition closure hashes each complete canonical TypeScript AST plus the
recursive top-level presets and coordinate helpers referenced by that track. The
aggregate additionally pins configured support files by Git object identity.

The first configured support authority is:

| Module | Path | Git blob SHA-1 |
|---|---|---|
| `./math` | `src/game/math.ts` | `c215daef16056d5d7c142db964ed93f82c74f8e8` |

Changing localized text, geometry, sky presets, coordinate helpers, runtime order or
the configured math support source fails validation.

The referenced-definition closure is sealed. Every use of a local preset or helper
that contributes to `TRACKS` must remain inside its hashed declaration or the
`TRACKS` initializer. Any external read, alias, call, reassignment or mutation fails
closed, preventing an out-of-declaration write from changing effective runtime data
without changing a pinned authority.

## Identity-wrapper boundary

`src/game/track-schema.ts` exports `defineTrack` and `defineTracks`. The validator
requires both functions to return their sole parameter unchanged. A wrapped `TRACKS`
array is accepted only when `defineTracks` is a named runtime import from
`./track-schema`; a local or differently sourced function with the same spelling is
rejected.

## RSH-014 transition rule

RSH-014 may relocate the 56 definitions into one module per track only when:

- runtime IDs and order remain unchanged;
- both integrity digests remain exact;
- every module is checked through the canonical helpers;
- the 8/48 classification remains unchanged;
- no track data, asset or dependency is modified.

RSH-014 may adapt the validator to the modular source layout, but it may not change a
track ID, runtime order, MVP membership, geometry, localized text, image,
environment, seed or gameplay data.

## Decision

| Question | Answer |
|---|---|
| Is there one machine-readable track schema? | **Yes** |
| Does it agree with `TrackDef` and all 56 IDs? | **Required by CI** |
| Is the theme enum checked directly against `TrackDef.theme`? | **Yes** |
| Are declared 56/8/48 counts enforced? | **Yes** |
| Is `math.ts` included in the aggregate integrity authority? | **Yes** |
| May an arbitrary function named `defineTracks` wrap the catalogue? | **No** |
| May RSH-014 change runtime track data or order? | **No** |
| Is RSH-015 authorized by this unit? | **No** |
| Are any release gates closed by this unit? | **No — 0/13 remains** |
