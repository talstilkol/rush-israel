# RUSH Israel — CI Contract

**Unit:** RSH-007  
**Workflow:** `.github/workflows/required-ci.yml`  
**Required job name:** `required-ci / validate`

## Trigger boundary

The workflow runs on:

- every pull request targeting `main`;
- every push to `main`;
- manual `workflow_dispatch`.

It has read-only repository contents permission, one concurrent run per workflow/ref,
and a 45-minute job timeout.

## Reproducible environment

| Item | Value |
|---|---|
| Runner | `ubuntu-24.04` |
| Node.js | `.nvmrc` → `22.16.0` |
| npm | `10.9.2` |
| Install | `npm ci` |
| Browser | Playwright Chromium |
| Auth | disabled for CI |

## Required execution order

1. exact checkout;
2. exact Node/npm verification;
3. lockfile-only dependency installation;
4. Playwright Chromium installation;
5. `npm run lint`;
6. complete `npm test` suite;
7. self-starting `npm run qa:ci` gate;
8. deterministic `npm run build:dev`.

A non-zero result from any command fails the job. No step uses `continue-on-error`.

## Evidence boundary

RSH-007 establishes the first GitHub-hosted clean-checkout execution authority.
A workflow file alone is not a pass: the exact PR head must have a completed,
successful `required-ci / validate` result before merge.

Branch-protection enforcement and retained diagnostic artifacts are handled by
RSH-008. Until then, the workflow result is operational evidence but is not yet
a repository settings requirement.
