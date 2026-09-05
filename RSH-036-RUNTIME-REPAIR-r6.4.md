# RSH-036 — water-clock repair r6.4

Date: 2026-09-05. Verified source base: `59b71fccf137296697017e04eef19eef998ac597`.
Canonical main: `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a`, unchanged.
RSH-036 remains in review. Accepted 35/67; remaining 32. No freeze grant or merge.

## Reproduced defect and actual repair

The exact previous setClock water-loop expression throws on the procedural canal
because it reads bodies[i].color with no matching catalogue body. The unchanged
prior golden run 33988721068 also reproduced this using the real Ayalon world.
Every water material now owns its daytime base colour. The canal is registered
with its original daytime 0x2a6a78 colour. The original standard-water clock
formula is retained, including its nightAmount > 0.35 dimming threshold. Repeated
updates reset from the base rather than compounding darkness. Normal-map animation
continues to operate on the same materials. No road, physics, camera or asset
bytes were intentionally changed by this repair.

Ten direct water-clock unit cases pass locally. New browser cases exercise the
actual Ayalon, Namal and Rothschild engine/world for 43 transitions each, checking
water material counts and repeatable day/night values. These cases must pass on
locked dependencies remotely before browser success is claimed. No unit test
or source hash substitutes for visual acceptance.

## Historical integrity and programme scope

Known world changes have exact reverse deltas to the previously verified source.
The world-builder reconstruction helper applies only that hash-bound projection;
unknown edits receive no exemption. Independent current-source checks reject
mutations, deletion and rollback. Original historical world digests are unchanged.

Master plan r6.4 retains 67 original units, 42 historical findings and six repair
bundles. AUD-18 records the independently reproduced water-clock defect. The
explicit 45-source inventory remains partial; freeze_granted stays false. Existing
13 release gates and 66 unresolved asset licences remain unchanged.

## Mandatory evidence still required at preparation

Locked full-suite CI, browser water-clock cases, full QA/typecheck and build;
then all four original golden captures and comparisons with threshold 0.12 and
failure limit 8%. Preserve original PNGs, generation-11 ayalon.lock and owner
approval. The prior golden crash must be superseded by actual results, not erased.
Persistent Rothschild black rendering, complete dependency closure and analogous
sky/tree batch recovery remain unresolved. RSH-037 is not active.


## Remaining asset-batch audit

A controlled loader audit ran the eight unchanged Promise.all asset families
(sky, tree, flare, water, curb, facade, sign and car). Pair batches fail without
explicitly disposing successful siblings. Four map-based families return from
retry while members are still missing because their guard checks any nonempty
cache, not completeness. Full results and exact source hashes are recorded in
RSH-036-ASSET-BATCH-REVIEW.json. These are simulated resource/network results,
not physical GPU measurements. No fix is claimed for these eight families.

Declared plan counts are now checked against the actual collections and queue.
Duplicate audit/repair identities and stale declared totals fail validation.

## Actual remote validation obtained after preparation

Source preparation run 33991445999 tested tree
`2b883a551a70ffb557295ddf7604fd4adc570ab5`. Its normal validation steps
passed: 605 unit cases, 11 browser cases, full QA/typecheck, lint and build.
The real engine completed 43 day/night transitions on each of Ayalon, Namal
and Rothschild (129 total), with 1, 2 and 0 water materials respectively.
Every tested material returned to its stable daytime state. The prior water
lookup crash did not recur. Artifact 9976843683 has SHA-256
`577f50ab1856e38ba6e3ac9f062ef32ff90e372a518f948e87d11f439803b9af`.

The overall preparation workflow FAILED at the unchanged golden comparison,
not the repaired day/night transition. All four 1280x800 images were captured
and compared at the original threshold 0.12 and failure limit 8%:

| Frame | Different pixels / 1,024,000 | Reported difference | Verdict |
|---|---:|---:|---|
| ayalon-day-g01.png | 632,366 | 61.75% | FAIL |
| ayalon-day-g05.png | 536,734 | 52.42% | FAIL |
| ayalon-day-g07.png | 452,019 | 44.14% | FAIL |
| ayalon-night-g08.png | 680,895 | 66.49% | FAIL |

Zero of four comparisons passed. No PNG, golden source threshold, camera
source or generation-11 ayalon.lock was rewritten to hide these differences.
The historical failed-capture report remains intact. The new failure requires
source/camera/baseline provenance investigation, not automatic rebaselining.

A read-only Rothschild diagnostic sampled a 7x7 framebuffer grid. All 49
samples were black normally. Temporarily hiding the complete MeshStandardMaterial
family yielded 49 nonblack samples. Hiding other material families, clearing
fog/environment, disabling world render callbacks or overriding materials did
not resolve it. This localizes investigation but does not identify or repair a
single offending object. These visibility changes were diagnostic only and do
not enter product sources. No shared cause with the water crash is established.

Finalization run 33991821655 validated the additional plan-count guards and
batch-audit records on tree `b9d17ff594a894cd72e9b8c4901c3e988b978a12`:
607 unit tests passed, 124 lint warnings, zero lint errors. Artifact 9976868799
has SHA-256 `a5e4e549afbd8f6cbee9d04fdc6eca6d1de455d35360d1a9b0c6e232a8fccd53`.
It did not rerun browser/golden checks; all runtime and browser-test bytes match
the first preparation tree. Only this report and NEXT-CONTRACT were amended
later to record actual outcomes. Normal exact-published-head CI is separately
required; its verified result must be read from the current PR checkpoint.

RSH-036 is still blocked. No merge, release, freeze grant or later-unit start.

## Further causal isolation and canopy repair

Read-only run33992134755, artifact9976963396 (SHA-256
0cc19af657c6f115d1b8cebbad05e586707f7c770429ea9409360171a24b709b), found
one overflowing live InstancedMesh: Rothschild foliage count1152, capacity960.
All49 sampled positions were black initially. Temporarily bounding the draw count
made43/49 nonblack; restoring1152 restored49/49 black. These temporary diagnostic
mutations were not product changes. They establish a causal reproduction on this
Chromium renderer, not a cross-device rendering qualification.

The actual product fix allocates ficusN *12 =1536 slots. All96 trees and1152
canopy components are retained; no counts are clamped, no meshes hidden, and no
material/camera values are changed. Four new unit cases execute the actual source
construction block with a bounded matrix-store double: current480-sample route,
old960-slot negative reproduction,19 sampling boundaries and the maximum128-tree
case. All pass. The intended fix now has a separate actual engine capacity and
scene-pixel gate, and the existing closed-route UI test checks viewport pixels
away from HUD edges. Passing status for those gates awaits remote execution.

Local complete candidate suite:614 passed,0 failed/skipped/cancelled. Historical
builder reconstruction uses only exact known reverse deltas; unknown edits remain
rejected. The exact current-source inventory has18 entries. The explicit freeze
inventory is46 paths but remains partial and grants no freeze. This is a further
repair within r6.4/RSH-036; no new audit ID or accepted unit is created.
