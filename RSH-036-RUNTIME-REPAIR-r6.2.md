# RSH-036 — Runtime and CI-identity repair checkpoint r6.2

Date: 5 September 2026. State: candidate; unit acceptance blocked. Standing owner repair authorisation applies; one unit remains active.

## Independently verified input

- Main: `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a` (unchanged).
- PR #39 repair base: `ba89268646bf8890f8074642049b23369eda582d`.
- Exact 693-file input tree: `c74b50f2795c8a87e71fa650aac99969dc2a0672`, reproduced from the previous exact-head CI source archive.
- Previous required CI: 33979789973, 505 tests passed. This is **baseline** evidence, not proof for the new candidate.

## Implemented changes

1. `records.ts`: acquire storage inside the recovery boundary, distinguish read failure, never overwrite after a failed read, retain serialized writes and copy queued requests. New regressions fail 6/10 on baseline, pass 10/10 after repair.
2. `race-startup.ts` and race controller: catch loader/constructor/readiness failures, dispose an owned engine at most once, cancel stale callbacks, expose accessible error/recovery actions. Native module failures get an explicit page reload; asset/readiness failures get a fresh same-document attempt. No auto-reload loop.
3. `minimap-route.ts`, engine and HUD: mount the previously missing accessible 144x144 canvas, retain the final open-route sample, avoid open-route closure or preview wrap, preserve closed loops. New behavior must pass golden review; no golden files are updated.
4. CI summary: record actual checkout SHA/tree separately from triggering SHA, fail on dirty/mismatched/unverified CI identity, retain full test/lint/QA/build logs and parse TAP counts. Required CI adds real browser failure injection and screenshots.
5. Freeze candidate: revoke premature grant in code and manifest; refresh the partial inventory to 41 actual paths, not a claim of complete closure. Preserve all accepted historical authorities.
6. Historical byte checks: exact pinned reverse deltas project only known new bytes to verified earlier source. Unknown edits are not normalized. Separate current-source checks reject drift, deletion and rollback; binary golden evidence is not transformed. Production tests exercise real new modules.

## Preparation evidence (not remote acceptance)

- Node 22.16.0 / npm 10.9.2 available locally.
- `NODE_OPTIONS=--experimental-strip-types npm test`: **567 passed, 0 failed, 0 skipped**; +62 cases over baseline.
- Local compiler available: TypeScript 5.8.3. Local `npm ci` could not finish because registry DNS was unavailable. No locked local installation/build/browser success is claimed.
- Real browser script covers module abort/reload, texture abort/same-document retry, denied browser storage without writes, and actual open/closed HUD minimaps. Execution results must be read from the new exact-head CI artifacts, not inferred from the script's presence.

## Remaining blockers

CR-03 full transitive dependency closure; AUD-17 partial texture/constructor resource ownership; exact-head required CI and visual/freeze acceptance; blocking reviews. General test success does not accept the freeze.

Accepted **35/67**, remaining **32**, all **13** release gates open, **66** asset files unverified. No merge, later-unit activation, public release or real-device qualification is claimed.
