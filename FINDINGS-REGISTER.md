# RUSH Israel — Findings Register

**Version:** 1.1.0  
**Verified main baseline:** `0afa4e61086d0d37a05579b037baf6d18b2672a9`  
**Date:** 28 August 2026  
**Total:** 42 findings — 12 P0, 18 P1, 12 P2  
**Status:** 36 OPEN, 5 MITIGATED, 1 CLOSED

## Status rules

- `OPEN`: verified issue without accepted remediation.
- `MITIGATED`: remediation or policy exists, but final enforcement or acceptance evidence is missing.
- `CLOSED`: owner-accepted remediation is merged and its validation passes.

RSH-002 establishes governance policy. It does not falsely close the live public-visibility mismatch or branch-protection work reserved for later units.

| ID | Severity | Status | Finding | Current evidence | Planned remediation |
|---|---|---|---|---|---|
| P0-01 | P0 | **OPEN** | Repository visibility conflicts with the private-code statement | GitHub reports public visibility; RSH-002 sets a private target but the live owner setting has not changed. | Owner visibility setting and RSH-012 |
| P0-02 | P0 | **OPEN** | main is not protected | The live main branch has no protection, required checks or ruleset. | RSH-008 |
| P0-03 | P0 | **MITIGATED** | No branch-and-PR delivery workflow exists | RSH-001 and RSH-002 use unit branches and PRs; governance and a PR template now define the workflow, but technical enforcement is pending. | RSH-002, RSH-008 |
| P0-04 | P0 | **OPEN** | No GitHub Actions CI is present | No tracked workflow or status evidence exists. | RSH-007 |
| P0-05 | P0 | **OPEN** | The QA command is not self-contained | Browser and cache smoke scripts expect an already-running server. | RSH-006 |
| P0-06 | P0 | **OPEN** | Automation contains absolute /workspace paths | Multiple QA, golden, KTX2 and lock scripts hard-code /workspace. | RSH-005 |
| P0-07 | P0 | **OPEN** | Secret scanning is too narrow | The current script scans only src/game and a small pattern set. | RSH-024 |
| P0-08 | P0 | **MITIGATED** | Operational contracts are ignored by Git | Governance, contribution and security contracts are now versioned; AGENTS files and startup.sh remain ignored. | RSH-002, RSH-004 |
| P0-09 | P0 | **CLOSED** | Program status sources contradict one another | PR #1 merged canonical CURRENT-STATE, QUEUE, MASTER-PLAN and NEXT authority; historical files are explicitly non-controlling. | RSH-001 |
| P0-10 | P0 | **MITIGATED** | The last audit is stale and its sequencing rules were violated | RSH-001 reset the queue and preserves the violation as evidence; product scope and vertical-slice enforcement remain pending. | RSH-009, RSH-010, RSH-025 |
| P0-11 | P0 | **OPEN** | No version, tag, release or rollback baseline exists | The repository has no tags, releases or accepted rollback procedure. | RSH-003, RSH-063, RSH-064, RSH-067 |
| P0-12 | P0 | **OPEN** | Root licensing and asset provenance are incomplete | There is no root licence or complete provenance manifest. | RSH-011, RSH-012 |
| P1-01 | P1 | **OPEN** | Production QA-hook removal is not enforced by GitHub | A local script exists but no required CI check executes it. | RSH-007, RSH-024 |
| P1-02 | P1 | **OPEN** | Timed-record hashes are generated but not verified on read | Record liveness checks physicsVersion only. | RSH-023 |
| P1-03 | P1 | **OPEN** | Timed-record writes are fire-and-forget | recordBest starts asynchronous persistence without awaiting or serialising. | RSH-023 |
| P1-04 | P1 | **OPEN** | Save failures and corruption are silently swallowed | Write errors are ignored and malformed saves fall back to empty state. | RSH-021, RSH-022 |
| P1-05 | P1 | **OPEN** | The build command performs database migration | npm run build invokes db:migrate. | RSH-024 |
| P1-06 | P1 | **OPEN** | Template auth, DB, multiplayer and Grok infrastructure is not product-scoped | Large template subsystems remain while the game uses local state. | RSH-020 |
| P1-07 | P1 | **OPEN** | The dependency set is broader than the observed product surface | Numerous UI, auth, query, table and chart packages require a usage audit. | RSH-020 |
| P1-08 | P1 | **OPEN** | Package identity and runtime requirements are undefined | package.json is named app-builder-workspace and lacks product version and engine policy. | RSH-004, RSH-012, RSH-063 |
| P1-09 | P1 | **OPEN** | The toolchain cannot be reproduced exactly | No tracked Node version, packageManager declaration or usable environment example exists. | RSH-004 |
| P1-10 | P1 | **OPEN** | Lint is not part of qa:ci | The lint script exists but is not executed by the aggregate gate. | RSH-007 |
| P1-11 | P1 | **OPEN** | The complete test suite is not part of qa:ci | qa:ci selects tests rather than running the complete test command. | RSH-007 |
| P1-12 | P1 | **OPEN** | Important validation scripts are outside the main gate | Golden, damage, Ayalon lock, HaShalom, auth and long-soak checks are not consistently enforced. | RSH-007, RSH-008, RSH-035, RSH-042 |
| P1-13 | P1 | **OPEN** | No accepted real-device performance baseline exists | No verified desktop/mobile p95, memory or draw-call evidence exists. | RSH-037, RSH-043 |
| P1-14 | P1 | **OPEN** | Core source files are excessively large | world.ts, tracks.ts, engine.ts, game-app.tsx and vehicle.ts concentrate unrelated responsibilities. | RSH-014 through RSH-018 |
| P1-15 | P1 | **OPEN** | Content, rendering, physics, UI and QA are tightly coupled | Large modules mix world construction, gameplay, rendering and test hooks. | RSH-013 through RSH-020 |
| P1-16 | P1 | **OPEN** | Catalogue breadth precedes a verified vertical slice | There are 56 track-card assets while no track has an owner-approved release freeze. | RSH-010, RSH-025 through RSH-036 |
| P1-17 | P1 | **OPEN** | Golden evidence does not yet form a trusted acceptance authority | Agent-generated captures exist; owner approval and unique authority are not recorded. | RSH-035, RSH-036 |
| P1-18 | P1 | **MITIGATED** | EXECUTION_PLAN.md is an operational monolith | RSH-001 removed it from queue authority, but the historic monolith remains. | RSH-001 |
| P2-01 | P2 | **OPEN** | Product metadata still references Israel and New York | Root metadata conflicts with the proposed Israel-focused Version 1. | RSH-012 |
| P2-02 | P2 | **MITIGATED** | CODEOWNERS and contribution templates are absent | RSH-002 adds CODEOWNERS, a PR template and contribution policy; acceptance is pending merge. | RSH-002 |
| P2-03 | P2 | **OPEN** | Commit-signing policy is not enforced | Historical commits are commonly unsigned; only the GitHub merge commit is verified. | RSH-003, RSH-063 |
| P2-04 | P2 | **OPEN** | Commit cadence and direct-main history reduce reviewability | Many historical changes entered main directly in rapid succession. | RSH-002, RSH-008 |
| P2-05 | P2 | **OPEN** | No changelog or architecture-decision register exists | Repository changes and durable technical decisions lack dedicated registers. | RSH-003, RSH-063 |
| P2-06 | P2 | **OPEN** | No dependency-update policy exists | Dependabot/Renovate and dependency-audit cadence are undefined. | RSH-004, RSH-020 |
| P2-07 | P2 | **OPEN** | A beta Nitro version is on the build path | The package uses a beta Nitro version without an accepted stability decision. | RSH-004, RSH-020 |
| P2-08 | P2 | **OPEN** | README does not document reproducible setup and validation | Node, npm ci, Playwright, validation and deployment requirements are incomplete. | RSH-004, RSH-012 |
| P2-09 | P2 | **OPEN** | No bundle or asset budget is enforced | The repository has no accepted size threshold or CI budget. | RSH-039 |
| P2-10 | P2 | **OPEN** | Touch-action behaviour is not explicitly locked | Pointer cancellation exists, but browser gesture suppression is not a verified contract. | RSH-044 |
| P2-11 | P2 | **OPEN** | Crash reporting, telemetry and privacy policy are undefined | The product has no accepted collection and retention policy. | RSH-048 |
| P2-12 | P2 | **OPEN** | No browser and device support matrix exists | Supported Chrome, Edge, Firefox, Safari and mobile versions are undefined. | RSH-043 |
