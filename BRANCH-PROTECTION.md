# RUSH Israel — Branch Protection and Required Checks

**Unit:** RSH-008  
**Target branch:** `main`  
**Required check:** `required-ci / validate`

## Live state observed on 29 August 2026

| Setting | Live value |
|---|---:|
| `main` protected | No |
| Rulesets | 0 |
| Required status checks | 0 |
| Integration access to protection detail | HTTP 403 |
| Required CI workflow merged | Yes |
| Exact-head CI authority | Yes |

## Desired state

`REPOSITORY-RULESET-DESIRED.json` is the machine-readable target:

- every change reaches `main` through a pull request;
- `required-ci / validate` is required and must be current with `main`;
- unresolved review conversations block merge;
- only merge commits are allowed by program policy;
- force-push and branch deletion are blocked;
- repository administrators do not bypass the ruleset.

## Administrative limitation

The connected GitHub integration provides repository, branch-protection and
ruleset reads, but it does not expose an administrative mutation action. It is
therefore impossible in this session to apply the repository setting directly.

This is not represented as success. `REPOSITORY-SETTINGS-STATUS.json` keeps every
live protection claim `false`, and finding P0-02 remains open.

The owner action is exact:

1. open repository **Settings → Rules → Rulesets**;
2. create an active branch ruleset targeting `main`;
3. reproduce `REPOSITORY-RULESET-DESIRED.json` exactly;
4. save it without bypass actors;
5. re-run the live settings audit;
6. change the canonical claims only after GitHub confirms the setting.

## Workflow enforcement delivered in RSH-008

Even before the administrative setting is applied, the workflow now:

- validates the governance contract on every PR and `main` push;
- preserves a deterministic CI summary on every run;
- uploads diagnostics with `if: always()`;
- retains artifacts for 14 days;
- never suppresses a failing validation step.

Workflow execution is evidence. It does not substitute for branch protection.
