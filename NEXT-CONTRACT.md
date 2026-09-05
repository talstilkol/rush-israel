# RUSH Israel — NEXT Contract

**Version:** 20.4.0
**Checkpoint date:** 2026-09-06, Asia/Jerusalem
**Repository:** talstilkol/rush-israel
**Canonical main:** e01d91de5dfa11685a51dcea90c1dbc8e2d2148a
**Verified repair base:** 3486e3351f596670e9fb0a55387bf0ecdcd442df
**Active unit:** RSH-036, PR39, agent/rsh-036-ayalon-freeze; not accepted.

## Authority and counts

Standing owner audit/repair/plan-improvement authority applies. Execute serially;
only one programme unit active. Accepted35/67, remaining32, release gates0/13,
unverified asset files66, audit IDs18, legacy findings42, repair bundles6.
Do not merge a failed or incomplete candidate; no force-push, history rewrite,
public distribution, invented evidence, or automatic golden rebaselining.

## Current repairs and acceptance limits

The r6.4 water/night and Rothschild capacity fixes passed normal exact-head
run33993082441 with614 unit and12 browser cases. They remain preserved.
All four original golden comparisons failed at threshold0.12 and limit8%.

r6.5 implements atomic caches for the8 families listed in the unchanged original
RSH-036-ASSET-BATCH-REVIEW.json. The same48 controlled regressions give5 pass/43
fail on r6.4 and48/48 on this repair;5 extra helper cases pass. New actual-browser
cases cover failure cleanup, complete retry and concurrency for each family.
Read the latest PR checkpoint for their actual exact-head CI results; this
preparation document does not claim they have run.

## Next RSH-036 work

1. Re-read live main/PR/reviews and latest source/test artifacts; reconcile before writes.
2. Verify the new eight-family asset tests and retained water/Rothschild tests on
   exact-head required CI. Inspect RSH-036-ASSET-BATCH-REPAIR.json and actual logs.
3. Run scripts/golden-provenance.mjs with full Git history. The four original
   PNGs were introduced at b0e3e525 on26August2026. Trace source, camera and
   configuration changes without attributing differences to hashes alone.
4. Re-run unchanged qa:golden; preserve failed comparisons and original images.
   Do not mark a normal CI pass as visual acceptance.
5. Finish CR-03 generated static/dynamic/runtime-asset closure with add/remove
   and unresolved-edge tests. The 56-path explicit list remains PARTIAL.
6. Resolve blocking review findings and all acceptance gates before evaluating
   merge of RSH-036. RSH-037 is not active.
