# RSH-036 — Product-owned document head and visual provenance (r6.8)

Date: 6 September 2026. Verified repair base: `46d361365ccde29d528861051f9529c08ec725ab`.
Main: `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a`. Accepted 35/67, remaining 32.
RSH-036 is unaccepted. No merge, freeze, release or RSH-037 activation.

## Actual product repair

The Vite integration and deployed Nitro middleware previously invoked the shared
platform head injector. That function can add `grok.com/grok-app-builder/extensions.js`,
platform project/creator metadata and host-derived remote share-card URLs to product
HTML. The two serving paths now use `scripts/rush-head.mjs`: local PWA manifest and
icon links, product mobile title and missing mobile/theme tags only. Existing title,
owner metadata and body content are preserved. Forwarded host/project/card inputs
cannot add vendor head resources through this injector. Existing local install and
manifest endpoints remain compatible.

The streaming implementation preserves UTF-8 across byte splits, passes post-head
bytes through, handles incomplete heads and bounds head buffering to 1 MiB. After a
limit error the stream stays failed. It is an injector for our documents, not a
sanitizer for arbitrary hostile HTML. It does not remove scripts an owner already
placed in a document.

The unchanged shared platform helper remains available to its historical tests.
Its exact reviewed hash and allowed named exports form an explicit product-import
boundary. Namespace/default/dynamic imports, re-exports and unsafe renamed exports
are rejected in the analysed product/build graph. A change to the shared bytes
invalidates qualification. This is not a general sandbox against arbitrary eval.

All seven discovered external reference expressions remain visible in the generated
inventory. Four vendor-head expressions are separately qualified as dormant behind
that reviewed import boundary. Three Google Fonts references remain unqualified;
fonts were not downloaded, replaced, distributed or claimed offline-safe. Complete
external dependency closure is still false. Device, licensing and offline/update
acceptance are separate open gates.

## Regression evidence and required validation

The same 25 product-head cases produced 20 passes / 5 failures on the prior Vite and
Nitro implementations, then 25/25 passes on this repair. They include actual Vite
transforms and execution of the actual middleware with only bundler imports adapted.
Eight boundary tests cover allowed exports, aliases, unsafe access, current consumers
and hash/serving drift. These 33 cases passed locally. The imported JS module also
passed a focused strict local typecheck; that is not the locked project typecheck.
Two new real served-document/network cases are wired into the existing runtime
browser suite. Candidate exact-head CI, browser checks, build, safe legacy capture
and the unchanged original golden command must run; preparation-time text is not
an acceptance record. Latest verified CI results belong in the PR checkpoint.

## Controlled visual provenance, not a new image authority

`RSH-036-GOLDEN-ATTRIBUTION-r6.8.json` records the original August 26 source archive
and an actual direct-engine replay. Provenance run 34005654970 recovered 306 original
Git blobs without mismatch. Run 34005914831 rendered four frames from the original
source/assets and four from the current source/assets using the same locked
dependencies and browser. No product source, PNG authority or threshold was changed.

All four spawn positions were identical. Effective chase-camera follow distance
changed from 7.4 to 9.2 and height from 1.92 to 2.28; measured camera deltas were
+0.36 vertically and -1.8 on Z at all four poses, with FOV 58 unchanged. World ramps
were 32 versus 50, colliders 541 versus 546, while both tracks had 781 samples and
length 2604.8979999999788. The spline, named golden-camera catalogue and quality
profile were byte-identical; that did NOT imply identical effective cameras.
The ancestry contains geometry additions after the original image commit.

These are eight diagnostic captures, zero original-golden comparisons. The replay
uses direct engines and instant camera without HUD, not the original screenshot
recipe or its old runner. It establishes real camera/world differences and rejects
an explanation based solely on startup timing or font labels. It does not assign
all mismatched pixels to one cause, prove modern art quality, excuse a failed gate
or authorize restoring obsolete gameplay just to match old screenshots.

## Next acceptance work

Retain both capture safeguards, resource rollback, repeated day/night and visible
Rothschild regressions. Attribute each golden mismatch quantitatively using camera-
only and world/material-controlled diagnostics. Preserve original references and
thresholds; any future reference transition needs its own explicit provenance and
approval gate, never an automatic replacement. Finish font dependency qualification
without changing visual identity silently. Validate actual runtime and production
output after product-head changes. All 13 release gates stay open and 66 asset
licences remain unverified.

Local final preflight: 810/810 unit cases passed, adding 40 unique cases (25 product
head, 8 import boundary, 7 current/historical source guards). The first full run
had one obsolete 62-source assertion after the partial inventory grew to 69; it
was corrected to the exact actual count, not removed. Local TypeScript 5.8.3 is
not substituted for the locked remote install.
