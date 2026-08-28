# RUSH Israel — NEXT Contract

**Version:** 2.1.0  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**Transition base:** `6932a74ca23f125e212f37fa0db73da377eaabe3`  
**Accepted units after PR #7 merge:** `RSH-001`–`RSH-006`  
**Queue head after PR #7 merge:** `RSH-007`

## 1. Source of truth

GitHub and the canonical control documents govern the program. Live GitHub evidence
supersedes chat summaries and recorded SHAs whenever they differ.

The first action of the next unit must read the actual `main` HEAD created by PR #7
and record that merge SHA in `CURRENT-STATE.json`, `QUEUE.json` and
`BASELINE-REGISTER.json`.

## 2. Meaning of a future plain `next`

A plain `next` authorises implementation of exactly one eligible queue-head unit.

After PR #7 merges, that unit is:

`RSH-007 — Create GitHub Actions CI`

A plain `next` does not authorise RSH-008, direct `main` writes, force-push,
history rewrite, release creation or public distribution.

## 3. Completed bounded batch

The owner instruction `make next 5` authorised exactly:

1. `RSH-002` — accepted through PR #2;
2. `RSH-003` — accepted through PR #3;
3. `RSH-004` — accepted through PR #5;
4. `RSH-005` — accepted through PR #6;
5. `RSH-006` — accepted when PR #7 merges.

The batch is complete and its authority is exhausted. It does not authorise
automatic creation of an RSH-007 branch, commit or PR.

## 4. Mandatory preflight for RSH-007

Before any RSH-007 write:

1. read the live `main` HEAD and PR #7 merge result;
2. record the actual PR #7 merge SHA in all canonical acceptance registers;
3. read all open PRs and relevant branches;
4. confirm there is no pre-existing RSH-007 branch or PR;
5. read `CURRENT-STATE.json`, `QUEUE.json`, `MASTER-PLAN.md`,
   `MILESTONE-REGISTER.md`, this contract and `FINDINGS-REGISTER.md`;
6. reconcile any live GitHub change before creating the RSH-007 branch.

## 5. RSH-007 scope

RSH-007 may create GitHub Actions CI and the minimum supporting changes required to
run a clean-clone install, static validation and self-starting QA harness on GitHub.

It must not:

- enforce branch protection or rulesets; that is RSH-008;
- change game design, assets or product scope;
- publish a tag or release;
- start RSH-008.

## 6. Unit standard

Every unit must have:

1. an exact verified `main` base SHA;
2. one dedicated queue-head branch;
3. written scope and exclusions;
4. deterministic changed-set evidence;
5. updated canonical state;
6. one PR with an exact head;
7. no completion claim beyond available evidence;
8. no later-unit pre-creation.

## 7. RSH-006 evidence boundary

RSH-006 provides:

- automatic repository-local Vite startup;
- readiness probing and fail-closed server reuse;
- startup, command and cleanup timeouts;
- process-tree cleanup on Linux, macOS and Windows;
- `128+signal` exit semantics;
- timer and listener cleanup;
- toolchain/lockfile metadata regression validation;
- source-level deterministic tests.

It does not claim clean-clone GitHub-hosted execution. That evidence belongs to
RSH-007. Finding P0-05 remains `MITIGATED`, and release gates remain `0/13`.

## 8. Prohibited actions

- write directly to `main`;
- force-push or rewrite history;
- claim the repository is private while GitHub reports public;
- claim runtime CI evidence before RSH-007 runs;
- create a tag, release or public distribution artifact;
- start RSH-008 before RSH-007 is accepted.

## 9. Canonical post-merge state

| Metric | Value |
|---|---:|
| Accepted units | 6/67 |
| Remaining units | 61 |
| Units in review | 0 |
| Queue head | RSH-007 |
| Queue-head state | Eligible on a future `next` |
| RSH-007 branch/PR | None |
| Release gates | 0/13 |
