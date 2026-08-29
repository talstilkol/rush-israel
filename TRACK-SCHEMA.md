# RUSH Israel — Canonical Track Schema

**Unit:** RSH-013  
**Machine authorities:** `TRACK-SCHEMA.json`, `TRACK-SOURCE-PIN.json`  
**Historical schema source commit:** `94524201dfe87f1f22f8d8bdd9d97aad507c0438`  
**Reconciled live-main source commit:** `e9b7683330bb288e9e5005e595f699b58d7ad20f`  
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
at compile time and by the validator against the exact `TrackDef` partition, and are
immediately frozen before any runtime consumer can observe them.

## Type and catalogue authority

The validator compares the machine schema directly with:

- the complete `TrackId` union;
- the complete `CityId` union;
- the literal union declared by `TrackDef.theme`;
- the exact required and optional `TrackDef` keys;
- all 56 classification entries;
- the declared counts of **56 total, 8 MVP and 48 deferred**.

The complete `src/game/types.ts` source is also pinned to Git blob
`f2ce095b2fcd4f9fa6f55ce0c3413ffa8d09d6c0`. This protects the transitive aliases
behind `TrackDef`, including geometry, sky, water, street and POI types.

An unused enum member, incorrect count, incomplete helper-key list or weakened
transitive type authority therefore fails CI even when the current track objects do
not exercise the drifted value.

## Point collection forms

The committed catalogue uses two reviewed point forms:

1. an array literal containing at least three entries;
2. the Ayalon zero-argument IIFE, which declares a local array, appends generated
   entries with `push`, and returns that same local array as its final statement.

The IIFE may not return a different array, contain nested functions or reassign the
returned array. Other point-expression forms fail closed.

## Runtime-data integrity

RSH-013 maintains three primary runtime-definition authorities:

| Authority | Algorithm | Exact identity |
|---|---|---|
| Complete reconciled `src/game/tracks.ts` source | Git blob SHA-1 | `e26454223f8a598cdf516af7c7c3f494162e2616` |
| Ordered track-definition closure | SHA-256 | `a1ccf6f71ca7c4bad7fbc1280aecb04cdc4390ca400cf183cd3fde916d14294d` |
| Aggregate including configured support sources | SHA-256 | `1f10ef1b656fb61b414aed82a1918ade65c5093fcedf486b2aa3b37527d5dfb7` |

`TRACK-SOURCE-PIN.json` fixes the complete reconciled pre-modularization source
byte-for-byte. A syntax form not understood by a semantic mutation guard still
changes the Git blob identity and therefore fails CI. Updating both the JSON pin and
source is also rejected by a validator-held accepted baseline. RSH-014 is the only
declared owner-authorized unit that may replace this single-file pin with a modular
source manifest.

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

All runtime source files that import or re-export `TRACKS` or `getTrack`, including
static, dynamic, CommonJS and aliased imports, are discovered by the validation gate.
The accepted consumer set and each consumer Git blob are pinned, so mutations from a
consumer outside `tracks.ts` also fail closed.

## Identity-wrapper boundary

`src/game/track-schema.ts` imports the canonical type-only `TrackDef` authority from
`./types` and exports `defineTrack` and `defineTracks`. The validator requires both
functions to retain their exact generic bounds and return their sole parameter
unchanged. A wrapped `TRACKS` array is accepted only when `defineTracks` is a named
runtime import from `./track-schema`; a local or differently sourced function with
the same spelling is rejected.

## RSH-014 transition rule

RSH-014 may relocate the 56 definitions into one module per track only when:

- runtime IDs and order remain unchanged;
- both semantic integrity digests remain exact;
- the single-file source pin is replaced by an exact modular source manifest;
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
| Is the complete reconciled pre-modularization source pinned? | **Yes** |
| Does it agree with `TrackDef` and all 56 IDs? | **Required by CI** |
| Is the complete transitive `types.ts` authority pinned? | **Yes** |
| Is the theme enum checked directly against `TrackDef.theme`? | **Yes** |
| Are declared 56/8/48 counts enforced? | **Yes** |
| Is `math.ts` included in the aggregate integrity authority? | **Yes** |
| Are external catalogue consumers protected? | **Yes** |
| May an arbitrary function named `defineTracks` wrap the catalogue? | **No** |
| May RSH-014 change runtime track data or order? | **No** |
| Is RSH-015 authorized by this unit? | **No** |
| Are any release gates closed by this unit? | **No — 0/13 remains** |
