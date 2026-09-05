# RSH-036 — Ayalon freeze candidate: acceptance blocked

**Revision:** r6.2 / 2026-09-05  
**Implementation base:** `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a`  
**Verified repair base:** `ba89268646bf8890f8074642049b23369eda582d`  
**Branch:** `agent/rsh-036-ayalon-freeze`  
**Freeze granted:** **false**. Neither general CI success nor owner permission to implement is acceptance.

## Source inventory versus acceptance

The current explicit inventory contains 41 hashed paths. It is a **partial inventory**, not proof of full static/dynamic/runtime-asset dependency closure. CR-03 remains open. The unaccepted prior 36-path inventory and premature true grant are preserved in Git history at the repair base; they are not accepted authority.

This revision repairs denied-storage recovery, cancellable race startup, an unmounted minimap and open-route geometry. `RSH-036-RUNTIME-EVOLUTION.json` contains exact current hashes and reverse deltas to the independently verified base. Historical checkers use those deltas solely to verify earlier byte identities. Separate tests require the actual new production bytes and exercise their behavior.

## Locked historical evidence

Keep all original golden PNG bytes, `golden-baseline/ayalon.lock` generation 11, all 20 unique authority frames and four non-authority HaShalom placeholders unchanged. The original RSH-035 owner approval remains byte-identical with `unique_pack_approved=true` and `freeze_granted=false`. Pixel comparison retains threshold 0.12 and failure limit 8%; never update baselines to hide drift.

Track/world/physics/cars/audio/input data, package.json, package-lock.json and asset bytes are unchanged. HUD and runtime sources deliberately evolve under the standing owner repair authorisation and must be revalidated visually. No historic runtime-preservation claim is silently carried forward.

## Mandatory acceptance gates

1. Complete and independently validate static/dynamic/runtime-asset dependency coverage, including added/removed-file detection.
2. Exact published-head required CI: unit tests, lint, browser QA, fault-injection recovery and build.
3. Exact candidate visual/freeze validation against unchanged golden evidence; reconcile minimap and any other visual changes without weakening thresholds.
4. Resolve blocking review findings, confirm source identity, then validate a merge. Only that later accepted checkpoint can grant the freeze and activate RSH-037.

All 13 release gates remain open. GIS/navigation claims, public distribution, owner-settings freeze, force pushes and history rewrites remain forbidden. RSH-037 runtime structures remain absent.
