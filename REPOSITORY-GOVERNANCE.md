# RUSH Israel — Repository Governance and Visibility Policy

**Version:** 1.0.0  
**Established by:** `RSH-002`  
**Canonical repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**Owner:** `@talstilkol`

## 1. Authority

GitHub is the sole current source of truth. Program order is controlled by
`CURRENT-STATE.json`, `QUEUE.json`, `MASTER-PLAN.md`, `NEXT-CONTRACT.md`,
`FINDINGS-REGISTER.md` and this policy.

Chat summaries, local clones and historical planning files cannot override live
GitHub state.

## 2. Ownership and distribution

RUSH Israel is a **private, owner-controlled product**.

- Target repository visibility: **private**.
- Live visibility at the start of RSH-002: **public**.
- Public distribution, public release, public licensing, public archive
  submission and public asset redistribution are **not authorised**.
- A future public release requires a separate explicit owner decision, a
  complete licence/provenance gate and an update to the canonical plan.
- While GitHub still reports the repository as public, contributors must assume
  every committed byte is publicly readable. Secrets, private keys, personal
  data and unlicensed private assets must never be committed.

The visibility setting is an owner-level GitHub setting. RSH-002 records the
decision and the unresolved live-setting mismatch without claiming it changed.

## 3. Canonical branch

`main` is the canonical branch.

- Direct writes to `main` are prohibited.
- Force-push and history rewrite are prohibited.
- Every change uses exactly one clean unit branch based on the verified `main`
  HEAD.
- Branch format: `agent/rsh-###-short-slug`.
- Later units must not be branched, committed or pre-created.
- Historical unit branches are retained until an explicit cleanup decision;
  they are not deleted automatically.

## 4. Pull-request workflow

Each program unit is delivered through one Draft PR.

A PR must contain:

1. unit ID and exact verified base SHA;
2. scope and explicit exclusions;
3. complete changed-file list;
4. deterministic validation evidence;
5. updated canonical state and queue files;
6. confirmation that no later unit was started;
7. an owner-approval checkbox.

`next` authorises work on the queue head only. It does not authorise merging.

## 5. Review and merge

- `@talstilkol` is the code owner and final approval authority.
- Explicit owner approval is required before every merge.
- Automatic merge is disabled by policy.
- Default merge method: **merge commit**, preserving the accepted PR boundary
  and exact PR head.
- Squash or rebase merge requires explicit owner authorisation for that PR.
- A moved PR head must be revalidated before merge.
- Unresolved blocking review threads prohibit merge.

Technical enforcement through branch rules and required checks is deferred to
`RSH-008`, after the CI checks exist. Until then, this policy and
`NEXT-CONTRACT.md` are mandatory procedural controls.

## 6. Commit and change discipline

- One unit may contain multiple commits, but every commit must remain inside
  that unit's scope.
- Commit messages begin with the unit ID.
- Generated files, binary assets and dependency changes require explicit scope.
- No fabricated evidence, reconstructed historical bytes or false completion
  claims are permitted.
- Estimates must be labelled as estimates; measured results require retained
  evidence.

## 7. Security

Security-sensitive information must be handled under `SECURITY.md`.

- Never place a secret in source, PR text, issue text, logs or artifacts.
- A suspected secret exposure blocks merge.
- Rotation is required after exposure; deleting the current file is not proof
  that the secret was never exposed.
- Public issue disclosure of an active vulnerability or credential is
  prohibited.

## 8. Repository-setting matrix

| Control | Live at RSH-002 start | Policy target | Enforcement unit |
|---|---|---|---|
| Visibility | Public | Private | Owner GitHub setting / RSH-012 verification |
| Canonical branch | `main` | `main` | RSH-002 |
| Direct `main` writes | Technically possible | Prohibited | RSH-008 |
| Required PR | Not technically enforced | Required | RSH-008 |
| Required status checks | 0 | Required after CI exists | RSH-008 |
| Force-push | Not protected | Prohibited | RSH-008 |
| Auto-merge | Disabled | Disabled | RSH-002 |
| Code owner | Absent | `@talstilkol` | RSH-002 |
| PR template | Absent | Required | RSH-002 |

## 9. Emergency changes

An emergency does not permit silent direct writes.

The owner may explicitly authorise an emergency PR that:

- uses an `agent/rsh-###-*` branch;
- states the incident and rollback plan;
- limits changes to the minimum safe repair;
- receives post-change validation;
- updates the canonical state.

## 10. RSH-002 acceptance criteria

RSH-002 is acceptable when:

- this policy is versioned;
- `CONTRIBUTING.md`, `SECURITY.md`, `CODEOWNERS` and the PR template exist;
- current public visibility and target private visibility are both recorded;
- no claim is made that the live setting changed;
- RSH-001 is recorded as accepted and RSH-002 as the sole unit in review;
- RSH-003 remains blocked and uncreated;
- no game, runtime, build, asset or dependency file changes;
- the PR remains unmerged until explicit owner approval.
