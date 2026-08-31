# RUSH Israel — Dependency Policy

**Authority:** RSH-020  
**State:** effective on validated merge  
**Package manager:** npm 10.9.2  
**Lock authority:** committed `package-lock.json`

## Rules

1. Every direct dependency must be used by the RUSH Israel product, build, validation or asset tooling.
2. Runtime and development dependencies are separated; build-only tooling must not ship as a runtime direct dependency.
3. `npm ci`, `npm test`, `npm run qa:ci` and `npm run build:dev` must pass on the exact candidate head.
4. The lockfile is mandatory and changes only in an isolated owner-authorised unit or dependency PR.
5. Automated dependency PRs are disabled while the strict serial queue is active; updates may not bypass the queue.
6. Registry and vulnerability review is performed at least monthly and before every release candidate.
7. Security updates are isolated, reviewed, lockfile-backed and must preserve the frozen product and asset boundaries.
8. Unused direct dependencies are removed rather than retained speculatively.
9. Nitro is accepted only at the exact pin `3.0.260610-beta`; on 31 August 2026 npm reported that same version as the `latest` dist-tag. Any replacement requires full exact-head validation.

## Current boundary

| Metric | Before RSH-020 | After RSH-020 |
|---|---:|---:|
| Runtime direct packages | 52 | 10 |
| Development direct packages | 22 | 20 |
| Total direct packages | 74 | 30 |
| Removed direct packages | — | 44 |

The retained `/__grok/*` URLs are product-owned PWA compatibility paths. They do not authorise or reintroduce template authentication, database, multiplayer or preview-host infrastructure.
