# RUSH Israel — Findings Register

**Version:** 1.3.0  
**Verified main baseline:** `88c7754b62c66cfdf59f8bfce847db2113eb09de`  
**Date:** 29 August 2026  
**Total:** 42 findings — 12 P0, 18 P1, 12 P2  
**Status:** 26 OPEN, 8 MITIGATED, 8 CLOSED

## Status rules

- `OPEN`: verified issue without an accepted remediation.
- `MITIGATED`: accepted policy or implementation exists, but final enforcement or evidence is incomplete.
- `CLOSED`: owner-accepted remediation is merged and its applicable validation passes.

Workflow execution and repository settings are separate authorities. A green
workflow does not close a branch-protection finding while GitHub reports the
branch unprotected.

| ID | Severity | Status | Finding | Current evidence | Planned remediation |
|---|---|---|---|---|---|
| P0-01 | P0 | **OPEN** | Repository visibility conflicts with the private-code statement | GitHub still reports public visibility; policy target is private. | Owner visibility setting and RSH-012 |
| P0-02 | P0 | **OPEN** | `main` is not protected | GitHub reports `protected=false`, required checks 0 and rulesets 0. RSH-008 records the exact desired ruleset, but the integration has no administrative mutation action. | Owner applies `REPOSITORY-RULESET-DESIRED.json`; live re-verification |
| P0-03 | P0 | **MITIGATED** | No branch-and-PR delivery workflow exists | RSH-001–RSH-008 use isolated branches and PRs; governance, CODEOWNERS and templates are merged. Live settings enforcement remains absent. | Apply the RSH-008 desired ruleset |
| P0-04 | P0 | **CLOSED** | No GitHub Actions CI is present | RSH-007 merged `required-ci / validate`; exact head `3cb2ca2…` passed run `33221919501`, job `99017575707`. | RSH-007 |
| P0-05 | P0 | **CLOSED** | The QA command is not self-contained | The RSH-006 harness started, validated and stopped its own server successfully in the clean RSH-007 GitHub runner. | RSH-006, RSH-007 |
| P0-06 | P0 | **CLOSED** | Automation contains absolute `/workspace` paths | RSH-005 migrated executable automation to module-relative roots; `check:paths` prevents recurrence. | RSH-005 |
| P0-07 | P0 | **OPEN** | Secret scanning is too narrow | The current scan still covers only `src/game` and a small pattern set. | RSH-024 |
| P0-08 | P0 | **MITIGATED** | Operational contracts are ignored by Git | Governance, contribution, security, toolchain, QA and CI contracts are versioned; ignored AGENTS/startup files still require a decision. | RSH-002, RSH-004, RSH-012 |
| P0-09 | P0 | **CLOSED** | Program status sources contradict one another | Canonical state, queue, master plan and NEXT authority are merged; historical files are explicitly non-controlling. | RSH-001 |
| P0-10 | P0 | **MITIGATED** | The last audit is stale and sequencing rules were violated | The queue was reset and violations preserved as evidence; product-scope and vertical-slice enforcement remain pending. | RSH-009, RSH-010, RSH-025 |
| P0-11 | P0 | **MITIGATED** | No version, tag, release or rollback baseline exists | Immutable baseline, milestone, label and release registers exist; tags, releases and rollback proof remain absent. | RSH-063, RSH-064, RSH-067 |
| P0-12 | P0 | **OPEN** | Root licensing and asset provenance are incomplete | No root licence or complete provenance manifest exists. | RSH-011, RSH-012 |
| P1-01 | P1 | **MITIGATED** | Production QA-hook removal is not enforced by GitHub | `check:qa` passes inside the required workflow, but GitHub does not yet require that check through branch settings. | Apply the RSH-008 desired ruleset; RSH-024 hardening |
| P1-02 | P1 | **OPEN** | Timed-record hashes are generated but not verified on read | Record liveness checks `physicsVersion` only. | RSH-023 |
| P1-03 | P1 | **OPEN** | Timed-record writes are fire-and-forget | `recordBest` starts asynchronous persistence without awaiting or serialising. | RSH-023 |
| P1-04 | P1 | **OPEN** | Save failures and corruption are silently swallowed | Write errors are ignored and malformed saves fall back to empty state. | RSH-021, RSH-022 |
| P1-05 | P1 | **OPEN** | The build command performs database migration | `npm run build` still invokes `db:migrate`; CI deliberately uses `build:dev`. | RSH-024 |
| P1-06 | P1 | **OPEN** | Template auth, DB, multiplayer and Grok infrastructure is not product-scoped | Large template subsystems remain while the game uses local state. | RSH-020 |
| P1-07 | P1 | **OPEN** | The dependency set is broader than the observed product surface | UI, auth, query, table and chart packages require a usage audit. | RSH-020 |
| P1-08 | P1 | **MITIGATED** | Package identity and runtime requirements are undefined | Node `22.16.0` and npm `10.9.2` are exact and enforced; product package name/version remain unresolved. | RSH-012, RSH-063 |
| P1-09 | P1 | **CLOSED** | The toolchain cannot be reproduced exactly | RSH-007 clean checkout verified the pinned Node/npm toolchain and `npm ci` with 440 packages and 0 vulnerabilities. | RSH-004, RSH-007 |
| P1-10 | P1 | **CLOSED** | Lint is not part of the required validation gate | `required-ci / validate` executes blocking ESLint and passed with 0 errors on the accepted RSH-007 head. | RSH-007 |
| P1-11 | P1 | **CLOSED** | The complete test suite is not part of the required validation gate | `required-ci / validate` executes complete `npm test`; 170 passed, 0 failed and 0 skipped on the accepted head. | RSH-007 |
| P1-12 | P1 | **OPEN** | Important validation scripts are outside the main gate | Golden, damage, Ayalon lock, HaShalom, auth and long-soak checks are not all required on every PR. | RSH-035, RSH-042 and later CI expansion |
| P1-13 | P1 | **OPEN** | No accepted real-device performance baseline exists | No verified desktop/mobile p95, memory or draw-call evidence exists. | RSH-037, RSH-043 |
| P1-14 | P1 | **OPEN** | Core source files are excessively large | `world.ts`, `tracks.ts`, `engine.ts`, `game-app.tsx` and `vehicle.ts` concentrate unrelated responsibilities. | RSH-014 through RSH-018 |
| P1-15 | P1 | **OPEN** | Content, rendering, physics, UI and QA are tightly coupled | Large modules mix world construction, gameplay, rendering and test hooks. | RSH-013 through RSH-020 |
| P1-16 | P1 | **OPEN** | Catalogue breadth precedes a verified vertical slice | There are 56 track-card assets while no track has an owner-approved release freeze. | RSH-010, RSH-025 through RSH-036 |
| P1-17 | P1 | **OPEN** | Golden evidence does not yet form a trusted acceptance authority | Agent-generated captures exist; owner approval and unique authority are not recorded. | RSH-035, RSH-036 |
| P1-18 | P1 | **MITIGATED** | `EXECUTION_PLAN.md` is an operational monolith | RSH-001 removed it from queue authority, but the historic monolith remains. | RSH-001 |
| P2-01 | P2 | **OPEN** | Product metadata still references Israel and New York | Root metadata conflicts with the proposed Israel-focused Version 1. | RSH-012 |
| P2-02 | P2 | **CLOSED** | CODEOWNERS and contribution templates are absent | RSH-002 merged CODEOWNERS, a PR template, contribution policy and governance contract. | RSH-002 |
| P2-03 | P2 | **OPEN** | Commit-signing policy is not enforced | Recent GitHub merge commits are verified, but historical commits and future enforcement are not governed by a required rule. | RSH-063 |
| P2-04 | P2 | **OPEN** | Commit cadence and direct-main history reduce reviewability | New work uses PRs, but historical rapid direct-main changes remain and technical settings enforcement is pending. | Apply desired ruleset |
| P2-05 | P2 | **OPEN** | No changelog or architecture-decision register exists | Baseline and release registers exist, but no changelog or ADR register exists. | RSH-063 and architecture units |
| P2-06 | P2 | **OPEN** | No dependency-update policy exists | Dependabot/Renovate and dependency-audit cadence are undefined. | RSH-020 |
| P2-07 | P2 | **OPEN** | A beta Nitro version is on the build path | The package uses a beta Nitro version without an accepted stability decision. | RSH-020 |
| P2-08 | P2 | **MITIGATED** | README does not document reproducible setup and validation | `TOOLCHAIN.md`, `QA-HARNESS.md` and `CI-CONTRACT.md` define exact setup and QA contracts; README integration remains pending. | RSH-012 |
| P2-09 | P2 | **OPEN** | No bundle or asset budget is enforced | No accepted size threshold or CI budget exists. | RSH-039 |
| P2-10 | P2 | **OPEN** | Touch-action behaviour is not explicitly locked | Pointer cancellation exists, but browser gesture suppression is not a verified contract. | RSH-044 |
| P2-11 | P2 | **OPEN** | Crash reporting, telemetry and privacy policy are undefined | No accepted collection and retention policy exists. | RSH-048 |
| P2-12 | P2 | **OPEN** | No browser and device support matrix exists | Supported Chrome, Edge, Firefox, Safari and mobile versions are undefined. | RSH-043 |
