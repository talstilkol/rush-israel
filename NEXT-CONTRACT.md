# RUSH Israel — NEXT Contract

**Version:** 1.0.0  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**Verified baseline:** `bf08477a44aae0bfc5fee7329f83885adb85c3d8`  
**Active unit:** `RSH-001`  
**Active branch:** `agent/rsh-001-canonical-program-control`  
**Active Draft PR:** `head:agent/rsh-001-canonical-program-control` → `base:main`

## 1. Meaning of `next`

`next` authorizes work on exactly one current queue-head unit. It does not authorize a merge, force-push, history rewrite, direct `main` write or later-unit pre-creation.

## 2. Mandatory preflight

Before any action:

1. Read the current `main` HEAD from GitHub.
2. Read all open PRs and relevant branches.
3. Read `CURRENT-STATE.json`, `QUEUE.json`, `MASTER-PLAN.md`, this contract and the findings register from the controlling ref.
4. Reconcile any GitHub change that occurred after the recorded baseline.
5. Stop rather than execute a later unit if the current queue head is still open, incomplete or unaccepted.

## 3. Current transition

RSH-001 is implemented on `agent/rsh-001-canonical-program-control` and remains the queue head while its Draft PR is open.

- A repeated `next` before acceptance must inspect and finish **RSH-001 only**.
- It must not start, branch, commit or open a PR for RSH-002.
- RSH-002 becomes eligible only after explicit owner approval and merge of RSH-001 into `main`.

## 4. Unit execution standard

Each unit must have:

1. exact scope and exclusions;
2. a clean branch based on the verified controlling base;
3. only the files required by that unit;
4. deterministic validation evidence;
5. an updated queue/current-state record when state changes;
6. a Draft PR;
7. no claim of completion while required evidence is missing.

## 5. Prohibited actions

- merge without explicit owner approval;
- direct write to `main`;
- force-push;
- Git history rewrite;
- create later-unit branches or PRs;
- mark estimates as measured facts;
- replace historical evidence with fabricated reconstruction;
- use stale chat state when GitHub differs.

## 6. RSH-001 acceptance criteria

RSH-001 may be accepted only when:

- exactly five canonical control files are added;
- both JSON files parse;
- the queue contains exactly 67 ordered units;
- the findings register contains exactly 42 findings: 12 P0, 18 P1 and 12 P2;
- release status is consistently `0/13`;
- no game, build, asset or runtime file changes;
- no RSH-002 branch, commit or PR exists;
- the PR remains unmerged until owner approval.

## 7. Next eligible unit

`RSH-002 — Repository governance and visibility policy`, blocked pending RSH-001 acceptance and merge.
