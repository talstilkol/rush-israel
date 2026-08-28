# RUSH Israel — NEXT Contract

**Version:** 2.0.0  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**Verified `main`:** `6932a74ca23f125e212f37fa0db73da377eaabe3`  
**Accepted units:** `RSH-001`–`RSH-005`  
**Active unit:** `RSH-006`  
**Active branch:** `agent/rsh-006-self-starting-qa-harness`

## 1. Source of truth

GitHub and the canonical control documents govern the program. Before every unit,
read the live `main` HEAD, open PRs, relevant branches, `CURRENT-STATE.json`,
`QUEUE.json`, `MASTER-PLAN.md`, this contract and `FINDINGS-REGISTER.md`.

Live GitHub evidence supersedes chat summaries and recorded SHAs when they differ.

## 2. Default meaning of `next`

A plain `next` authorises implementation of exactly one eligible queue-head unit.
It does not normally authorise merge, force-push, history rewrite, direct `main`
write or later-unit pre-creation.

A bounded instruction such as `make next N` may explicitly authorise implementation,
review and merge of the named consecutive units. The exact bounds must be recorded in
`CURRENT-STATE.json` and `QUEUE.json`; authority ends after the last listed unit.

## 3. Current bounded batch

The owner instruction `make next 5` authorises exactly:

1. `RSH-002` — accepted through PR #2;
2. `RSH-003` — accepted through PR #3;
3. `RSH-004` — accepted through PR #5;
4. `RSH-005` — accepted through PR #6;
5. `RSH-006` — current and final batch unit.

`RSH-007` is not part of this authorisation. It must not be branched, committed,
opened or executed automatically when RSH-006 merges.

## 4. Mandatory unit standard

Every unit must have:

1. an exact verified `main` base SHA;
2. a dedicated queue-head branch;
3. scope and explicit exclusions;
4. deterministic changed-set evidence;
5. updated canonical state when program state changes;
6. one PR whose exact head is recorded;
7. no completion claim beyond available evidence;
8. no later-unit pre-creation.

## 5. RSH-006 scope

RSH-006 delivers a self-starting QA harness that:

- starts repository-local Vite automatically on `127.0.0.1:8080`;
- waits for readiness before browser QA;
- rejects an unknown pre-existing server by default;
- allows explicit reuse only with `QA_REUSE_SERVER=1`;
- preserves command exit status and enforces timeouts;
- terminates server and command process trees on success, failure or signal;
- works on Linux, macOS and Windows;
- makes public QA commands self-contained while retaining internal `:raw` commands;
- includes unit tests and operator documentation.

## 6. RSH-006 evidence boundary

RSH-006 may claim implementation and source-level deterministic validation. It may
not claim a clean-clone GitHub-hosted execution because GitHub Actions does not yet
exist. That runtime evidence belongs to `RSH-007`.

Consequently finding P0-05 becomes `MITIGATED`, not `CLOSED`, when RSH-006 merges.
Release gates remain `0/13`.

## 7. RSH-006 acceptance criteria

RSH-006 is acceptable only when:

- `scripts/run-with-server.mjs` owns server startup, readiness and cleanup;
- `scripts/run-with-server.test.mjs` covers parsing, startup constraints and probes;
- `QA-HARNESS.md` documents public/raw commands, reuse, timeouts and cleanup;
- `npm run qa` and `npm run qa:ci` invoke the harness;
- browser-dependent standalone QA commands invoke the harness;
- static checks do not start an unnecessary server;
- the two-cycle soak entry is cross-platform;
- no dependency version, lockfile, game source or asset changes occur;
- canonical state contains exactly 67 ordered units;
- RSH-007 has no branch, commit or PR;
- the PR is merged only under the current bounded owner authorisation.

## 8. Prohibited actions

- write directly to `main`;
- force-push or rewrite history;
- claim the repository is private while GitHub reports public;
- claim runtime CI evidence before RSH-007;
- create a tag, release or public distribution artifact;
- start RSH-007 under the current batch.

## 9. State after RSH-006 merge

After acceptance:

| Metric | Value |
|---|---:|
| Accepted units | 6/67 |
| Remaining units | 61 |
| Next queue head | RSH-007 |
| RSH-007 automatic execution | No |
| Release gates | 0/13 |

A future plain `next` may begin **RSH-007 only** from the newly verified `main` HEAD.
