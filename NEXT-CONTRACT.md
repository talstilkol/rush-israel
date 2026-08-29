# RUSH Israel — NEXT Contract

**Version:** 2.4.0  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**Verified base:** `88c7754b62c66cfdf59f8bfce847db2113eb09de`  
**Active unit:** `RSH-008`  
**Active branch:** `agent/rsh-008-required-checks-artifacts`  
**Active PR:** `#10`

## 1. Authority

GitHub and the canonical control documents govern the program. Live GitHub
evidence supersedes chat summaries and recorded SHAs whenever they differ.

The owner instruction `make next 5; confirm everything` authorises exactly:

1. `RSH-007` — accepted and merged by PR #9;
2. `RSH-008` — active;
3. `RSH-009` — blocked by RSH-008;
4. `RSH-010` — deferred inside the authorised batch;
5. `RSH-011` — final authorised unit.

The batch closes after RSH-011. RSH-012 is not authorised.

## 2. Sequential execution

Each authorised unit requires:

- the exact live `main` created by the preceding merge;
- a distinct branch and PR;
- exact-head GitHub Actions success;
- deterministic changed-set and unit-specific evidence;
- no later-unit pre-creation;
- merge only after the acceptance boundary passes.

## 3. Current queue head

`RSH-008 — Enforce required checks, branch protection and CI artifacts`

The code-controlled acceptance boundary is:

- governance contract validation passes;
- the stable check context remains `required-ci / validate`;
- CI diagnostics are collected with `if: always()`;
- at least `artifacts/ci-summary.json` is uploaded;
- artifact retention is exactly 14 days;
- the exact final PR head passes the complete required workflow.

## 4. Administrative truth boundary

Live GitHub currently reports:

| Setting | Value |
|---|---:|
| `main` protected | No |
| Required status checks | 0 |
| Rulesets | 0 |
| Branch-protection detail through integration | HTTP 403 |

The integration has no settings-mutation action. Therefore:

- `REPOSITORY-RULESET-DESIRED.json` records the exact target;
- `REPOSITORY-SETTINGS-STATUS.json` records every live claim as false;
- `BRANCH-PROTECTION.md` records the exact owner action;
- finding P0-02 remains open;
- RSH-008 must not claim that branch protection was applied.

## 5. Transition to RSH-009

RSH-009 starts only after:

1. PR #10 exact final head passes `required-ci / validate`;
2. the diagnostic artifact is confirmed on that run;
3. PR #10 merges under the owner batch;
4. its live merge SHA is recorded in the RSH-009 branch.

## 6. Prohibited actions

- direct write to `main`;
- force-push or history rewrite;
- merging a failed or pending exact head;
- treating a workflow as a substitute for live branch protection;
- claiming the repository is private while GitHub reports public;
- creating tags, releases or public-distribution artifacts;
- starting RSH-012 under this batch.

## 7. Current metrics

| Metric | Value |
|---|---:|
| Accepted units | 7/67 |
| In review | 1 |
| Remaining units | 60 |
| Queue head | RSH-008 |
| Batch units completed | 1/5 |
| Batch authority remaining | 4 |
| Release gates | 0/13 |
