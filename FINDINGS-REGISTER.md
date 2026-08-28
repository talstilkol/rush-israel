# RUSH Israel — Findings Register

**Version:** 1.0.0  
**Verified main baseline:** `bf08477a44aae0bfc5fee7329f83885adb85c3d8`  
**Date:** 28 August 2026  
**Total:** 42 findings — 12 P0, 18 P1, 12 P2

## Status rules

- `OPEN`: verified issue without accepted remediation.
- `MITIGATED`: remediation exists but final acceptance evidence is still missing.
- `CLOSED`: owner-accepted remediation is merged and its validation passes.

RSH-001 creates the control plane that addresses status drift, but no finding is closed until the controlling PR is accepted and merged.

| ID | Severity | Status | Finding | Verified evidence | Planned remediation |
| --- | --- | --- | --- | --- | --- |
| P0-01 | P0 | OPEN | Repository visibility conflicts with the private-code statement | Repository metadata reports public visibility while README says the code is private. | RSH-002, RSH-012 |
| P0-02 | P0 | OPEN | main is not protected | The live main branch has no branch protection or required status checks. | RSH-002, RSH-008 |
| P0-03 | P0 | OPEN | No branch-and-PR delivery workflow exists | Before RSH-001, main was the only branch and the repository had no pull requests. | RSH-002 |
| P0-04 | P0 | OPEN | No GitHub Actions CI is present | No tracked workflow directory or GitHub status evidence exists on the verified HEAD. | RSH-007 |
| P0-05 | P0 | OPEN | The QA command is not self-contained | Browser and cache smoke scripts expect an already-running server at 127.0.0.1:8080. | RSH-006 |
| P0-06 | P0 | OPEN | Automation contains absolute /workspace paths | Multiple QA, golden, KTX2 and lock scripts hard-code /workspace, preventing portable execution. | RSH-005 |
| P0-07 | P0 | OPEN | Secret scanning is too narrow | The current script scans only src/game and a small pattern set; it does not cover the full tree or Git history. | RSH-024 |
| P0-08 | P0 | OPEN | Operational contracts are ignored by Git | AGENTS.md, AGENTS.project.md and startup.sh are excluded, so critical operating rules are not version-controlled. | RSH-002, RSH-004 |
| P0-09 | P0 | OPEN | Program status sources contradict one another | progress.md reports 0/13 while older audits and task documents mention 2/13 or other partial counts. | RSH-001 |
| P0-10 | P0 | OPEN | The last audit is stale and its sequencing rules were violated | The live HEAD is 119 commits ahead of the 26 August audit baseline, including work on non-Ayalon tracks before a verified Ayalon freeze. | RSH-001, RSH-009, RSH-010, RSH-025 |
| P0-11 | P0 | OPEN | No version, tag, release or rollback baseline exists | The repository has no tags or releases and no accepted rollback procedure. | RSH-003, RSH-063, RSH-064, RSH-067 |
| P0-12 | P0 | OPEN | Root licensing and asset provenance are incomplete | There is an asset note under public/game, but no root licence or complete provenance manifest covering all shipped assets. | RSH-011, RSH-012 |
| P1-01 | P1 | OPEN | Production QA-hook removal is not enforced by GitHub | A local script checks finishNow and __controlsTest, but no required CI check executes it on proposed changes. | RSH-007, RSH-024 |
| P1-02 | P1 | OPEN | Timed-record hashes are generated but not verified on read | Record liveness checks physicsVersion only; invalid or forged hashes are not rejected. | RSH-023 |
| P1-03 | P1 | OPEN | Timed-record writes are fire-and-forget | recordBest starts asynchronous persistence without awaiting or serialising the write. | RSH-023 |
| P1-04 | P1 | OPEN | Save failures and corruption are silently swallowed | Write errors are ignored and malformed saves fall back to empty state without backup or user-visible recovery. | RSH-021, RSH-022 |
| P1-05 | P1 | OPEN | The build command performs database migration | npm run build invokes db:migrate, coupling compilation to an external production-side effect. | RSH-024 |
| P1-06 | P1 | OPEN | Template auth, DB, multiplayer and Grok infrastructure is not product-scoped | Large template subsystems remain in the repository even though the driving game currently uses local state. | RSH-020 |
| P1-07 | P1 | OPEN | The dependency set is broader than the observed product surface | Numerous UI, auth, query, table and chart packages require a usage audit and removal decision. | RSH-020 |
| P1-08 | P1 | OPEN | Package identity and runtime requirements are undefined | package.json is named app-builder-workspace and lacks a product version and explicit Node/npm engine policy. | RSH-004, RSH-012, RSH-063 |
| P1-09 | P1 | OPEN | The toolchain cannot be reproduced exactly | No tracked Node version, packageManager declaration or usable environment example is present. | RSH-004 |
| P1-10 | P1 | OPEN | Lint is not part of qa:ci | The lint script exists but is not executed by the current aggregate CI command. | RSH-007 |
| P1-11 | P1 | OPEN | The complete test suite is not part of qa:ci | qa:ci selects several tests instead of running the repository's full npm test command. | RSH-007 |
| P1-12 | P1 | OPEN | Important validation scripts are outside the main gate | Golden, damage, Ayalon lock, HaShalom, auth and long-soak checks are not consistently enforced. | RSH-007, RSH-008, RSH-035, RSH-042 |
| P1-13 | P1 | OPEN | No accepted real-device performance baseline exists | There is instrumentation and local smoke logic, but no verified desktop/mobile p95, memory or draw-call evidence. | RSH-037, RSH-043 |
| P1-14 | P1 | OPEN | Core source files are excessively large | world.ts, tracks.ts, engine.ts, game-app.tsx and vehicle.ts together exceed 667 KB and concentrate unrelated responsibilities. | RSH-014, RSH-015, RSH-016, RSH-017, RSH-018 |
| P1-15 | P1 | OPEN | Content, rendering, physics, UI and QA are tightly coupled | Large modules mix world construction, gameplay state, rendering details and test hooks. | RSH-013 through RSH-020 |
| P1-16 | P1 | OPEN | Catalogue breadth precedes a verified vertical slice | There are 56 track-card assets while no single track has an owner-approved release freeze. | RSH-010, RSH-025 through RSH-036 |
| P1-17 | P1 | OPEN | Golden evidence does not yet form a trusted acceptance authority | Agent-generated captures exist; several named files share identical blobs and owner approval is not recorded. | RSH-035, RSH-036 |
| P1-18 | P1 | OPEN | EXECUTION_PLAN.md is an operational monolith | The 262 KB file mixes historic notes, research, queue instructions and implementation detail, making status drift likely. | RSH-001 |
| P2-01 | P2 | OPEN | Product metadata still references Israel and New York | The root route description conflicts with the proposed Israel-focused Version 1 scope. | RSH-009, RSH-012 |
| P2-02 | P2 | OPEN | Repository contribution controls are absent | There is no CODEOWNERS file, pull-request template or issue template. | RSH-002, RSH-003 |
| P2-03 | P2 | OPEN | Commits and future releases are not signed | The verified HEAD is unsigned and no signing policy exists. | RSH-002, RSH-063, RSH-067 |
| P2-04 | P2 | OPEN | Recent work was committed directly without review evidence | The history contains many rapid direct commits and no PR review trail. | RSH-002, RSH-008 |
| P2-05 | P2 | OPEN | There is no changelog or architecture decision log | Product and technical decisions are spread across large planning files and commit messages. | RSH-003, RSH-063 |
| P2-06 | P2 | OPEN | Dependency-update policy is missing | No Dependabot, Renovate or documented audit cadence is present. | RSH-004, RSH-007 |
| P2-07 | P2 | OPEN | A beta Nitro version is in the build path | The application depends on a dated beta build without an explicit risk decision. | RSH-004, RSH-020 |
| P2-08 | P2 | OPEN | README is insufficient for clean-room reproduction | It omits Node/npm requirements, npm ci, Playwright setup, validation, deployment and supported devices. | RSH-004, RSH-012 |
| P2-09 | P2 | OPEN | Bundle and asset budgets are undefined | No required limit guards JavaScript, textures, models or route-card growth. | RSH-039 |
| P2-10 | P2 | OPEN | Touch controls do not explicitly disable browser gestures | Pointer cancellation is handled, but the control surface lacks an explicit touch-action contract. | RSH-044 |
| P2-11 | P2 | OPEN | Privacy, telemetry and crash-reporting policy is undefined | There is no accepted declaration of what is collected, stored or transmitted. | RSH-048 |
| P2-12 | P2 | OPEN | Browser and device support is undefined | No canonical compatibility matrix or minimum-version policy exists. | RSH-043 |

## Summary

| Severity | Count | Closed |
|---|---:|---:|
| P0 | 12 | 0 |
| P1 | 18 | 0 |
| P2 | 12 | 0 |
| **Total** | **42** | **0** |
