# RUSH Israel — NEXT Contract

**Version:** 20.3.0
**Checkpoint date (UTC):** 2026-09-05
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**Verified main:** `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a`
**Active:** `RSH-036`, PR #39, `agent/rsh-036-ayalon-freeze` — in review, not accepted.

## Standing owner authority

The owner's 5 September 2026 instruction authorises repository-wide review,
repairs, master-plan improvements and serial implementation of remaining units.
Additional improvement plans do not require renewed permission. Each `next`
resumes live GitHub state. Only one program unit may be active; future units
cannot bypass predecessor acceptance. No public distribution, force-push,
history rewrite, invented evidence or acceptance without validation is allowed.
Do not merge or release a failed/incomplete candidate.

## Current counts

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 35 |
| In review | 1 |
| Authorised but not activated | 31 |
| Remaining | 32 |
| Release gates green | 0/13 |
| Unverified asset files | 66 |
| Master plan r6.4 audit IDs | 18 |
| Historical findings retained | 42 |
| Repair bundles | 6 |

## Verified r6.4 outcome and limits

The water material/base-colour association is repaired. Real-engine tests passed
43 day/night transitions on each of Ayalon, Namal and Rothschild (129 total).
All 11 runtime browser cases passed in preparation run 33991445999. The original
r6.3 failed-capture document is retained as history, not the current crash status.

The unchanged golden command now captures and compares all four frames, but
**0/4 pass**: 61.75%, 52.42%, 44.14%, 66.49% differences versus the original
8% limit and threshold 0.12. Preparation run 33991445999 is an overall FAILURE.
Finalization run 33991821655 passed 607 unit tests and lint with 124 warnings /
0 errors. It does not override the golden failure. Read the latest PR checkpoint
for normal CI on the exact published head; never substitute prior-head results.

## Next work — RSH-036 only

1. Re-read live PR/main, source identity, current branch, CI artifacts and review
   comments before any write. Read RSH-036-RUNTIME-REPAIR-r6.4.md alongside this.
2. Validate the Rothschild canopy allocation repair and full-scene pixel gates.
   Diagnostic run33992134755 proves a live1152-instance draw overflowed its960
   matrix slots; capping/restoring the count reversed/reproduced black rendering.
   The actual repair allocates1536 slots and retains all96 trees/1152 instances,
   rather than hiding geometry. Run the new real-engine and actual HUD scene
   gates on the exact head. Preserve failure evidence; do not infer full track
   or golden acceptance from a visible frame alone.
3. Trace all four golden mismatches against source, camera, runtime configuration
   and baseline provenance. Preserve original PNGs, thresholds, generation-11
   ayalon.lock and historical owner approval. Do not automatically rebaseline.
4. Repair and regression-test the eight remaining asset-batch families recorded
   in RSH-036-ASSET-BATCH-REVIEW.json. Four pair loaders lack rejection cleanup;
   four Map loaders skip missing members on retry. These controlled mock results
   are not physical GPU qualification. Road repairs do not close all asset work.
5. Finish CR-03: generate complete static/dynamic/runtime-asset dependency closure
   with addition/removal and unresolved-edge tests. The explicit 46-path list is
   still partial and freeze_granted remains false.
6. Re-run exact-head normal CI and unchanged golden/freeze gates, resolve review
   blockers, and only then evaluate acceptance. RSH-037 remains inactive.
