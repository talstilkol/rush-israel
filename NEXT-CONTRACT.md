# RUSH Israel — NEXT Contract

**Version:** 2.3.1  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**Verified base:** `7ea076d377225d5db3561faf81fe1cedce091a28`  
**Active unit:** `RSH-007`  
**Active branch:** `agent/rsh-007-github-actions-ci`  
**Active PR:** `#9`  
**Replaced PR:** `#8` — closed unmerged after the connector failed to mark the Draft Ready

## 1. Authority

GitHub and the canonical control documents govern the program. Live GitHub
evidence supersedes chat summaries and recorded SHAs whenever they differ.

The owner instruction `make next 5; confirm everything` explicitly authorises
sequential implementation, validation and merge of exactly:

1. `RSH-007` — Create GitHub Actions CI;
2. `RSH-008` — Enforce required checks, branch protection and CI artifacts;
3. `RSH-009` — Freeze the Version 1 product definition;
4. `RSH-010` — Classify the track catalogue into 8 MVP and 48 deferred tracks;
5. `RSH-011` — Create the complete asset provenance and licence inventory.

The batch closes after RSH-011. RSH-012 is not authorised.

## 2. Sequential execution

Each authorised unit still requires:

- re-reading the live `main` created by the prior merge;
- one new branch based on that exact SHA;
- one separate PR;
- deterministic changed-set and unit-specific validation;
- no later-unit pre-creation before the current unit is accepted;
- merge only after the applicable acceptance boundary passes.

## 3. Current queue head

`RSH-007 — Create GitHub Actions CI`

RSH-007 establishes the first GitHub-hosted clean-checkout authority. It is not
accepted merely because workflow YAML exists. The exact final head of replacement
PR #9 must have a completed successful job named:

`required-ci / validate`

## 4. Replacement-PR continuity

Draft PR #8 and replacement PR #9 use the same branch and linear branch history.
PR #8 was closed without merge solely because the connector's Ready-for-review
mutation failed. No validated bytes were discarded or reconstructed.

The pre-reconciliation head `fb1bc883b03fd254954393c2b6d0142de964f12d`
passed workflow run `33221515687`. After PR-number reconciliation, the new exact
final head must independently pass again before merge.

## 5. RSH-007 scope

RSH-007 may add:

- a pull-request and `main` GitHub Actions workflow;
- exact Node/npm and lockfile installation;
- Playwright browser provisioning;
- lint, complete unit tests, self-starting QA and build execution;
- CI operating documentation and canonical state updates;
- deterministic regression baselines that do not misrepresent unresolved claims.

It must not apply branch protection or rulesets; that remains RSH-008.

## 6. Transition to RSH-008

RSH-008 starts only after:

1. PR #9 final head succeeds in GitHub Actions;
2. PR #9 is merged under the owner's batch authorisation;
3. the live merge SHA is read from `main`;
4. RSH-007 acceptance is written into the next branch's canonical records.

## 7. Prohibited actions

- direct write to `main`;
- force-push or history rewrite;
- merging a failed or pending exact head;
- claiming branch protection exists without live GitHub evidence;
- claiming the repository is private while GitHub reports public;
- creating a tag, release or public distribution artifact;
- starting RSH-012 under this batch.

## 8. Current metrics

| Metric | Value |
|---|---:|
| Accepted units | 6/67 |
| In review | 1 |
| Remaining units | 61 |
| Queue head | RSH-007 |
| Batch units completed | 0/5 |
| Batch authority remaining | 5 |
| Release gates | 0/13 |
