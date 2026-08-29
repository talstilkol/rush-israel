# RUSH Israel — Asset Provenance and Licence Inventory

**Unit:** RSH-011  
**Observed source commit:** `d8259877740a2feab6533f1723fd21be8fb2f6c2`  
**Machine authority:** `ASSET-PROVENANCE.json`  
**Inventory scope:** every tracked file recursively under `public/`

## Exact inventory result

| Metric | Exact value |
|---|---:|
| Shipping files under `public/` | **134** |
| Media/model/font/binary asset files | **131** |
| Shipping files with unverified licence evidence | **67** |
| Asset files with unverified licence evidence | **66** |
| Pinned `public/game` directory entries | **65** |
| Pinned `public/game` Git tree SHA-1 | `332fe666fd91590787856c32cf2040b8f6adb7d0` |
| Public distribution authorised | **No** |
| Legal clearance complete | **No** |
| Release gates green | **0/13** |

The inventory is complete as a file-coverage register. Legal clearance is not complete.
A complete inventory must not be confused with permission to distribute the files.

## Group classification

| Group | Files | Asset files | Recorded status | Public distribution clearance |
|---|---:|---:|---|---|
| Generated game assets | 64 | 64 | Evidence split between `public/game/LICENSES.md` and `scripts/bake-gantry.mjs` | **No — root product licence remains RSH-012** |
| Game asset evidence document | 1 | 0 | Evidence document | Not applicable |
| Basis Universal runtime | 2 | 1 | Khronos Basis Universal, Apache-2.0 | **Yes, with notice** |
| Track-card images | 56 | 56 | Source and licence not recorded | **No** |
| Grok install/template material | 8 | 7 | Template origin inferred; permission not recorded | **No** |
| Root branding assets | 3 | 3 | Source and licence not recorded | **No** |
| **Total** | **134** | **131** |  |  |

## Verified or identified material

### Generated game assets

Two evidence sources jointly cover the 64 files:

1. `public/game/LICENSES.md` records procedural textures and the five extrusion-car
   GLB/GLTF pairs as generated for the repository.
2. `scripts/bake-gantry.mjs` enumerates and writes the remaining 12 PNGs: six gantry
   signs, five station signs and `dest-rail.png`.

The complete flat `public/game` directory, including `LICENSES.md`, is pinned by Git
object identity to tree SHA `332fe666fd91590787856c32cf2040b8f6adb7d0`.
Changing a path or byte requires an explicit reviewed pin update. RSH-011 records the
generation claims but does not convert them into a public licence. RSH-012 must
establish the root owner-controlled licence and align repository metadata.

### Basis Universal

The repository contains:

- `public/basis/basis_transcoder.js`
- `public/basis/basis_transcoder.wasm`

The existing evidence document identifies these as Khronos Basis Universal material
under Apache-2.0. Distribution requires preservation of applicable notices.

## Unverified material and blockers

### 56 track-card images

Every live `TrackId` has one `public/tracks/<id>.jpg` image. The repository contains
no source URL, creator identity, generation record, permission, licence, acquisition
date or transformation record for these images. They remain **unverified**.

Required resolution: replace them with owner-generated material or add verifiable
source and licence evidence for every file.

### Eight Grok install/template files

Seven visual assets and one CSS file exist under `public/__grok/`. Their path and
branding suggest template origin, but the repository contains no licence or permission
record. They remain **unverified**.

Required resolution: remove, replace or add explicit licence/permission evidence.

### Three root branding files

- `public/favicon.svg`
- `public/og.jpg`
- `public/x-banner.jpg`

No source or generation evidence is recorded. They remain **unverified**.

## Enforcement

`scripts/check-asset-provenance.mjs` must fail when:

- a tracked `public/` file is not classified exactly once;
- provenance group IDs are duplicated, missing or substituted;
- a classified file disappears or group counts drift;
- any `public/game` path or byte changes without a reviewed tree-pin update;
- either generated-asset evidence family disappears or no longer enumerates its outputs;
- a track card does not correspond one-to-one with the 56 canonical `TrackId` values;
- an unverified group is represented as legally cleared;
- public distribution is enabled while a blocker remains;
- release-gate truth differs from 0/13.

## Decision

| Question | Answer |
|---|---|
| Is the `public/` file inventory complete? | **Yes — 134/134 files** |
| Are all 64 generated-game asset identities pinned? | **Yes — one complete Git tree pin** |
| Is provenance evidence complete? | **No** |
| Is licence clearance complete? | **No** |
| May the repository claim public-release readiness? | **No** |
| Does RSH-011 close release gate 1 or 12? | **No** |
