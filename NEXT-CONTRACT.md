# RUSH Israel — NEXT Contract

**Version:** 20.1.0
**Date:** 2026-09-05
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**Verified main:** `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a`
**Active:** `RSH-036`, PR #39, `agent/rsh-036-ayalon-freeze` — in review, not accepted.

## Standing owner authority

The explicit owner instruction on 5 September 2026 authorises repository-wide review, repairs, master-plan improvements and serial execution of all remaining units. Additional improvement plans do not require renewed permission. Every interactive `next` resumes the actual live GitHub checkpoint. Only one program unit is active at a time; future units cannot bypass predecessor acceptance. Historical one-unit grants remain historical records, not the current authority.

No public distribution, force-push, history rewrite, invented evidence or acceptance without validation is authorised. Do not release or merge a failed/incomplete candidate. Branch candidates are allowed for validation.

## Actual counts

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 35 |
| In review | 1 |
| Authorised, not activated | 31 |
| Remaining | 32 |
| Release gates green | 0/13 |
| Unverified asset files | 66 |

## Next work

- Verify the current PR head and exact-head required CI, including the new `runtime-recovery-smoke.mjs` browser gate. Local preparation: 567/567 tests passed; never substitute that for locked remote CI.
- Finish CR-03: generated static/dynamic/runtime-asset dependency closure and add/remove detection. The current 41-file explicit inventory is partial; `freeze_granted=false` is mandatory.
- Finish AUD-17: partial road-texture and interrupted-constructor resource ownership tests and fixes. Startup/records/minimap behavior changes are candidates pending browser and visual gates.
- Preserve all original golden PNGs, generation-11 `ayalon.lock`, the historical owner approval, 20 unique frames and four non-authority placeholders. Re-run visual/freeze checks with unchanged thresholds; do not refresh baselines to hide drift.
- Resolve blocking review findings and verify all acceptance evidence before merge. RSH-036 is not accepted; RSH-037 may not activate yet.

`MASTER-PLAN-r6.json` r6.2 retains 67 original units, 42 historical findings, 17 audit items and six repair bundles. Read `RSH-036-RUNTIME-REPAIR-r6.2.md` and the PR checkpoint for actual evidence, not estimates or predicted results.
