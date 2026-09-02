# RUSH Israel — Findings Register

**Version:** 2.3.0
**RSH-023 implementation base:** `33b280767913ef93b1dd8b73ab0e41a73636db38`
**State effective on:** merge of the RSH-023 pull request
**Date:** 2 September 2026
**Total:** 42 findings — 12 P0, 18 P1, 12 P2
**Status:** 14 OPEN, 7 MITIGATED, 21 CLOSED

## Status rules

- `OPEN`: verified issue without an accepted remediation.
- `MITIGATED`: accepted policy or implementation exists, but final enforcement or evidence is incomplete.
- `CLOSED`: remediation is accepted by the unit’s merge and its applicable validation passes.

Workflow execution and repository settings are separate authorities. A green workflow
does not close a branch-protection finding while GitHub reports the branch unprotected.
A complete asset inventory and proprietary root licence do not clear unverified assets.

| ID | Severity | Status | Finding | Current evidence | Planned remediation |
|---|---|---|---|---|---|
| P0-01 | P0 | **OPEN** | Repository visibility conflicts with the private-code statement | GitHub still reports public visibility. RSH-012 establishes an explicit proprietary licence but does not change repository visibility. | Owner changes visibility to private; live re-verification |
| P0-02 | P0 | **OPEN** | `main` is not protected | GitHub reports `protected=false`, required checks 0 and rulesets 0. RSH-008 records the desired ruleset, but no administrative mutation has been applied. | Owner applies `REPOSITORY-RULESET-DESIRED.json`; live re-verification |
| P0-03 | P0 | **MITIGATED** | No branch-and-PR delivery workflow exists | RSH-001–RSH-013 use isolated branches and PRs; governance, CODEOWNERS and templates are versioned. Live settings enforcement remains absent. | Apply the RSH-008 desired ruleset |
| P0-04 | P0 | **CLOSED** | No GitHub Actions CI is present | RSH-007 merged `required-ci / validate`; exact-head CI remains the acceptance authority. | RSH-007 |
| P0-05 | P0 | **CLOSED** | The QA command is not self-contained | The RSH-006 harness starts, validates and stops its own server in CI. | RSH-006, RSH-007 |
| P0-06 | P0 | **CLOSED** | Automation contains absolute `/workspace` paths | RSH-005 migrated executable automation to module-relative roots; `check:paths` prevents recurrence. | RSH-005 |
| P0-07 | P0 | **OPEN** | Secret scanning is too narrow | The current scan still covers only `src/game` and a small pattern set. | RSH-024 |
| P0-08 | P0 | **MITIGATED** | Operational contracts are ignored by Git | Governance, contribution, security, toolchain, QA, CI, product and metadata contracts are versioned; ignored AGENTS/startup files still require a decision. | RSH-002, RSH-004, RSH-012 |
| P0-09 | P0 | **CLOSED** | Program status sources contradict one another | Canonical state, queue, master plan and NEXT authority are merged; historical files are explicitly non-controlling. | RSH-001 |
| P0-10 | P0 | **MITIGATED** | The last audit is stale and sequencing rules were violated | The queue was reset, product scope was frozen, all 56 tracks were classified and asset/metadata authorities were established; vertical-slice enforcement remains pending. | RSH-009–RSH-012, RSH-025 |
| P0-11 | P0 | **MITIGATED** | No version, tag, release or rollback baseline exists | Immutable baseline, milestone, label and release registers exist; tags, releases and rollback proof remain absent. | RSH-063, RSH-064, RSH-067 |
| P0-12 | P0 | **MITIGATED** | Root licensing and asset provenance are incomplete | RSH-011 inventories 134/134 public files; RSH-012 establishes the proprietary root licence. Exactly 66 asset files remain unverified and uncleared. | Replace or document every unverified asset; keep public distribution blocked |
| P1-01 | P1 | **MITIGATED** | Production QA-hook removal is not enforced by GitHub | `check:qa` passes inside the required workflow, but GitHub does not yet require that check through branch settings. | Apply the RSH-008 desired ruleset; RSH-024 hardening |
| P1-02 | P1 | **CLOSED** | Timed-record hashes are generated but not verified on read | RSH-023 verifies SHA-256 record hashes on every load, drops stale physics versions and structurally invalid rows, and bounds storage to 24 per track/car plus 200 overall. | RSH-023 |
| P1-03 | P1 | **CLOSED** | Timed-record writes are fire-and-forget | RSH-023 serialises persist through one in-module chain, replaces `rush.records.v3` with canonical JSON, verifies the write, and returns structured duplicate/rejected/write-failed status without deleting source bytes. | RSH-023 |
| P1-04 | P1 | **CLOSED** | Save failures and corruption are silently swallowed | RSH-021 establishes deterministic schema/version handling. RSH-022 adds verified backup rotation, bounded exact-byte quarantine, explicit restore/fresh-start decisions, structured failures and accessible bilingual failure UI without deleting source or legacy bytes. | RSH-021, RSH-022 |
| P1-05 | P1 | **CLOSED** | The build command performs database migration | RSH-020 removes the DB subsystem and migration scripts; `npm run build` is exactly `vite build`. | RSH-020 |
| P1-06 | P1 | **CLOSED** | Template auth, DB, multiplayer and Grok infrastructure is not product-scoped | RSH-020 removes auth, DB, migrations, multiplayer, app-env and preview-host bridges. The retained `/__grok/*` PWA URLs are explicitly product-owned compatibility paths. | RSH-020 |
| P1-07 | P1 | **CLOSED** | The dependency set is broader than the observed product surface | RSH-020 reduces direct packages from 74 to 30: 10 runtime and 20 development packages; 44 unused direct packages are removed. | RSH-020 |
| P1-08 | P1 | **CLOSED** | Package identity and runtime requirements are undefined | RSH-004 fixes Node 22.16.0/npm 10.9.2; RSH-012 fixes product name, version `0.0.0-private`, private package status and `UNLICENSED` boundary. | RSH-004, RSH-012 |
| P1-09 | P1 | **CLOSED** | The toolchain cannot be reproduced exactly | RSH-007 clean checkout verified the pinned Node/npm toolchain and `npm ci`. | RSH-004, RSH-007 |
| P1-10 | P1 | **CLOSED** | Lint is not part of the required validation gate | `required-ci / validate` executes blocking ESLint. | RSH-007 |
| P1-11 | P1 | **CLOSED** | The complete test suite is not part of the required validation gate | `required-ci / validate` executes complete `npm test`. | RSH-007 |
| P1-12 | P1 | **OPEN** | Important validation scripts are outside the main gate | Golden, damage, Ayalon lock, HaShalom and long-soak checks are not all required on every PR. | RSH-035, RSH-042 and later CI expansion |
| P1-13 | P1 | **OPEN** | No accepted real-device performance baseline exists | No verified desktop/mobile p95, memory or draw-call evidence exists. | RSH-037, RSH-043 |
| P1-14 | P1 | **CLOSED** | Core source files are excessively large | RSH-014–RSH-017 establish track, world and engine boundaries. RSH-018 reduces `game-app.tsx` from 1540 to 179 lines and moves screens, HUD and race control into three manifest-bound modules with byte-exact reconstruction. | RSH-014–RSH-018 |
| P1-15 | P1 | **CLOSED** | Content, rendering, physics, UI and QA are tightly coupled | RSH-013–RSH-019 establish track, world, engine, UI and resource boundaries. RSH-020 removes unused template subsystems and pins the final direct dependency surface. | RSH-013–RSH-020 |
| P1-16 | P1 | **OPEN** | Catalogue breadth precedes a verified vertical slice | RSH-010 classifies 8 MVP and 48 deferred tracks, but no track has an owner-approved release freeze. | RSH-025 through RSH-036 |
| P1-17 | P1 | **OPEN** | Golden evidence does not yet form a trusted acceptance authority | Agent-generated captures exist; owner approval and unique authority are not recorded. | RSH-035, RSH-036 |
| P1-18 | P1 | **MITIGATED** | `EXECUTION_PLAN.md` is an operational monolith | RSH-001 removed it from queue authority, but the historic monolith remains. | RSH-001 |
| P2-01 | P2 | **CLOSED** | Product metadata references Israel and New York | RSH-012 aligns the root title, description, package metadata, Open Graph and both PWA runtime paths to the frozen Israel-inspired private product. | RSH-012 |
| P2-02 | P2 | **CLOSED** | CODEOWNERS and contribution templates are absent | RSH-002 merged CODEOWNERS, a PR template, contribution policy and governance contract. | RSH-002 |
| P2-03 | P2 | **OPEN** | Commit-signing policy is not enforced | Recent GitHub merge commits are verified, but historical commits and future enforcement are not governed by a required rule. | RSH-063 |
| P2-04 | P2 | **OPEN** | Commit cadence and direct-main history reduce reviewability | New work uses PRs, but historical rapid direct-main changes remain and technical settings enforcement is pending. | Apply desired ruleset |
| P2-05 | P2 | **OPEN** | No changelog or architecture-decision register exists | Baseline and release registers exist, but no changelog or ADR register exists. | RSH-063 and architecture units |
| P2-06 | P2 | **CLOSED** | No dependency-update policy exists | `DEPENDENCY-POLICY.md` defines lockfile authority, monthly/release review, isolated updates, exact-head validation and serial-queue restrictions. | RSH-020 |
| P2-07 | P2 | **CLOSED** | A beta Nitro version is on the build path | RSH-020 records npm registry evidence that `3.0.260610-beta` is the `latest` dist-tag, retains an exact pin and requires full validation for replacement. | RSH-020 |
| P2-08 | P2 | **CLOSED** | README does not document reproducible setup and validation | RSH-012 documents exact Node/npm versions, `npm ci`, development, full tests, self-starting QA and deterministic build commands. | RSH-012 |
| P2-09 | P2 | **OPEN** | No bundle or asset budget is enforced | No accepted size threshold or CI budget exists. | RSH-039 |
| P2-10 | P2 | **OPEN** | Touch-action behaviour is not explicitly locked | Pointer cancellation exists, but browser gesture suppression is not a verified contract. | RSH-044 |
| P2-11 | P2 | **OPEN** | Crash reporting, telemetry and privacy policy are undefined | No accepted collection and retention policy exists. | RSH-048 |
| P2-12 | P2 | **OPEN** | No browser and device support matrix exists | Supported Chrome, Edge, Firefox, Safari and mobile versions are undefined. | RSH-043 |
