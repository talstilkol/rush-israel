# Contributing to RUSH Israel

RUSH Israel is an owner-controlled private product. Contributions are accepted
only when explicitly authorised by `@talstilkol`.

## Required workflow

1. Re-read the live `main` HEAD and canonical control files.
2. Work on the single eligible queue-head unit only.
3. Create `agent/rsh-###-short-slug` from the verified `main` SHA.
4. Keep every change inside the unit's written scope.
5. Update `CURRENT-STATE.json`, `QUEUE.json` and `NEXT-CONTRACT.md` when the
   program state changes.
6. Open one Draft PR.
7. Retain deterministic validation evidence.
8. Wait for explicit owner approval before merge.

## Prohibited

- direct writes to `main`;
- force-push or history rewrite;
- pre-creating later units;
- committing secrets, personal data or unlicensed assets;
- marking partial work complete;
- treating `next` as merge approval;
- public distribution or licensing without an explicit owner decision.

## Commit messages

Use:

```text
RSH-###: imperative summary
```

## Pull-request minimum

The PR must identify the exact base and head SHA, list all changed files,
describe validation, declare exclusions and confirm that no later unit was
started.

Repository rules are defined in `REPOSITORY-GOVERNANCE.md`.
