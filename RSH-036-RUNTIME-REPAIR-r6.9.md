# RSH-036 r6.9 — Font evidence and controlled visual attribution

Date: 2026-09-06. Repair base: `751e1ecabe5e93dcd14215db6fa1bdeac913ed1f`.
Main unchanged; 35/67 accepted; RSH-036 unaccepted; all 13 release gates open.

## Implemented
Read-only font snapshots preserve the old `fonts` field but add face descriptors,
failed/loaded counts and explicit false typography/immutable-byte qualifications.
A settled empty/failed set can no longer be misread as the intended fonts loading.

Three real-app font scenarios collect actual platform glyph usage in Hebrew and
Arabic. Stylesheet and font-file denial must both leave multilingual text and
Ayalon startup functional. Online CDN responses are hashed in memory; font binaries
are never written. These are controlled probes, not full offline/PWA qualification.

The source/assets by camera 2x2 diagnostic keeps production sources unchanged,
uses measured matrices and restores each camera control for stability. All four
poses remain diagnostic, not replacement golden authorities. Actual results and
limits are in RSH-036-GOLDEN-FACTORIAL-r6.9.json and the latest PR checkpoint.

## Validation at preparation time
835 local unit tests passed, zero failures/skips, with local TypeScript 5.8.3.
25 added unique cases: 23 font-evidence cases and two current-source guards.
Locked remote tests, browser cases, build and original-golden comparison pending.
Later verified CI is recorded in the PR checkpoint; pending is not acceptance.

## Preserved / outstanding
Original CSS typography, renderer, camera, driving, assets, PNGs and thresholds
are unchanged. Three remote font references remain mutable/unqualified. No font
licensing, complete external closure or physical-device qualification is claimed.
Quantitative pairwise camera/source differences are overlapping non-additive
measurements, not a decomposition of all original-golden mismatched pixels.

## Verified camera/source diagnostic

Read-only run 34011119090, job 101427013368: SUCCESS. Artifact 9982561420
SHA-256 `3547ac43a413a70408afab1b012cba39b2795a3f1c7fe35a675797de553e6626`
contains 24 captured PNGs with verified hashes and 8 byte-identical repeated
controls. No physics movement, page errors or GL errors occurred.

| Frame | Source/assets difference at historical camera | Camera-only difference on current source | Repeated-control pixel differences |
|---|---:|---:|---:|
| g01 | 670900 / 1024000 | 172470 / 1024000 | 0 |
| g05 | 523792 / 1024000 | 59770 / 1024000 | 0 |
| g07 | 416260 / 1024000 | 346703 / 1024000 | 0 |
| g08 | 579355 / 1024000 | 75952 / 1024000 | 0 |

Restoring the historical camera alone does not remove the source/assets
difference. These nonlinear, overlapping pairwise comparisons are **not**
additive fractions of the original golden failures. There were zero original
golden comparisons in this diagnostic. Further individual world/material
controls remain required; no accepted gameplay is rolled back.
