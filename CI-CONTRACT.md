# RUSH Israel — 1. Current CI contract

1.1 The required GitHub context remains `required-ci / validate`. The active main ruleset was read on 2026-10-15; see `evidence/2026-10-15/github-protection.json`.
1.2 The workflow checks the exact PR head, uses Ubuntu 24.04, Node 22.16.0, npm 10.9.2 and lockfile installation. Dependency audit metadata is not sent by `npm ci --no-audit`.

2. Required jobs

| Job | Source and purpose |
|---|---|
| unit | Current source: governance configuration, dependency policy, lint, TypeScript, `npm test`, production build with QA-hook rejection, secrets and portable paths |
| browser | Current source: all 56 real world definitions, native Canvas/assets, driving, ramp, WebGL, acceleration, colliders, airborne behavior, damage, and 20 lifecycle cycles |
| soak | Current source: damage smoke followed by 1800 wall-clock seconds with real input steering, finite state, forward progress, at least one completed race, off-road limits and no browser errors |
| historical | Unchanged historical contracts executed against the exact audited `b2c0d46` Git tree; this establishes historical consistency only |
| validate | Runs with `if: always()` and fails unless every preceding job succeeded; skipped/cancelled/failing jobs cannot produce green acceptance |

2.1 Each producing job uploads diagnostics on success or failure. No `continue-on-error` is used.
2.2 The soak job has a 45-minute limit. Its nested command and test timeouts exceed the full 30-minute measurement. A smoke duration is explicitly labelled diagnostic and cannot satisfy the long acceptance.
2.3 Browser QA has a 30-minute command budget inside a 35-minute job. Hosted run 38808938418 completed all eight races but reached the former 15-minute command cap during lifecycle checks. This budget change removes no assertions and does not shorten the soak.
2.3 `TEST-CLASSIFICATION.json` accounts for every test file. `npm test` rejects an unclassified file. Historical source digests have not been rewritten to match new behavior.

3. Evidence boundary

3.1 Before this migration, `npm test` did invoke the old 1800-second soak indirectly. Its old success condition did not demonstrate a completed race. It is now an explicit required job with stronger driving assertions.
3.2 A workflow definition or a green historical test is not a green live CI run. Record the exact current head and completed GitHub run before calling CI verified.
3.3 A green CI run is code evidence. Product acceptance requires all 13 gates in `PRODUCT-READINESS.json`, physical devices, owner/legal evidence and the release procedure. `npm run check:release` remains fail-closed while those are missing.
