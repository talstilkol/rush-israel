# RUSH Israel — NEXT Contract

**Version:** 1.1.0  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**Verified baseline:** `0afa4e61086d0d37a05579b037baf6d18b2672a9`  
**Accepted unit:** `RSH-001`  
**Active unit:** `RSH-002`  
**Active branch:** `agent/rsh-002-repository-governance`  
**Active Draft PR:** `head:agent/rsh-002-repository-governance` → `base:main`

## 1. Meaning of `next`

`next` authorises work on exactly one current queue-head unit. It does not
authorise a merge, force-push, history rewrite, direct `main` write or
later-unit pre-creation.

## 2. Mandatory preflight

Before any action:

1. Read the current `main` HEAD from GitHub.
2. Read all open PRs and relevant branches.
3. Read `CURRENT-STATE.json`, `QUEUE.json`, `MASTER-PLAN.md`, this contract,
   `FINDINGS-REGISTER.md` and `REPOSITORY-GOVERNANCE.md`.
4. Reconcile any GitHub change after the recorded baseline.
5. Stop rather than execute a later unit if the queue head is open,
   incomplete or unaccepted.

## 3. Current transition

RSH-001 was accepted through PR #1 and merged at
`0afa4e61086d0d37a05579b037baf6d18b2672a9`.

RSH-002 is the sole queue-head unit. It establishes repository governance and
visibility policy.

- A repeated `next` before acceptance must inspect and finish **RSH-002 only**.
- It must not start, branch, commit or open a PR for RSH-003.
- RSH-003 becomes eligible only after explicit owner approval and merge of
  RSH-002 into `main`.

## 4. RSH-002 scope

RSH-002 may change only governance and canonical control files:

- `REPOSITORY-GOVERNANCE.md`;
- `CONTRIBUTING.md`;
- `SECURITY.md`;
- `.github/CODEOWNERS`;
- `.github/PULL_REQUEST_TEMPLATE.md`;
- the canonical state, queue, findings, master plan and NEXT contract.

It must not change game source, runtime, build configuration, assets,
dependencies, CI workflows, branch rules, releases, milestones or labels.

## 5. Visibility decision

The policy target is **private, owner-controlled development**.

GitHub reported the live repository as **public** at RSH-002 start. The current
tooling does not expose a repository-visibility mutation. RSH-002 must record
this truthfully and must not claim the setting changed.

Until GitHub metadata confirms `private`:

- no secret or confidential asset may be committed;
- public distribution remains unauthorised;
- finding P0-01 remains open;
- the owner-level visibility action remains required.

## 6. Unit execution standard

Each unit must have:

1. exact scope and exclusions;
2. a clean branch based on the verified controlling base;
3. only the files required by that unit;
4. deterministic validation evidence;
5. updated queue/current-state records;
6. a Draft PR;
7. no completion claim while required evidence is missing.

## 7. Prohibited actions

- merge without explicit owner approval;
- direct write to `main`;
- force-push;
- Git history rewrite;
- create later-unit branches or PRs;
- mark estimates as measured facts;
- replace historical evidence with fabricated reconstruction;
- use stale chat state when GitHub differs;
- claim private visibility while GitHub reports public.

## 8. RSH-002 acceptance criteria

RSH-002 may be accepted only when:

- the five governance files in section 4 exist;
- ownership, visibility, branch, PR, review and merge policies are explicit;
- current public visibility and target private visibility are both recorded;
- RSH-001 is `accepted` and RSH-002 is the only `draft_pr_open` unit;
- RSH-003 is `queued_blocked`;
- `QUEUE.json` still contains exactly 67 ordered units;
- both JSON control files parse;
- no game, runtime, build, asset, dependency or CI file changes;
- no repository-setting change is falsely claimed;
- no RSH-003 branch, commit or PR exists;
- the PR remains unmerged until owner approval.

## 9. Next eligible unit

`RSH-003 — Baseline, milestones, labels and release register`, blocked pending
RSH-002 acceptance and merge.
