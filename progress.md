Original prompt: בדוק מצב rush-israrel תקן כל הבעיות והשלם את התוכניות עד הסוף!

# Implementation progress 2026-10-15

- Base: PR 83 at 6395474913c071cb25bc2720238a7b8072045288.
- Scope: implementation and evidence, with device, asset provenance and owner acceptance gates kept open until verified.
- Confirmed npm test invokes the existing wall-clock soak through check-damage-required.test.mjs; this connection alone does not prove a successful or sufficient soak.
- Starting with current typecheck/test failures and runtime correctness before source-lock migration.

## Previous session record

# Progress — honest

Branch `agent/playable-session`. Not a release.

Also on this branch:
- The locked `scripts/soak-menu-race.mjs` now exits 0 on 20 Ayalon enter-exit cycles. Textures stayed at 30. Geometries were 1191 on 17 cycles and 1142 on cycles 6, 8 and 20. Nothing climbed past 1191. The script only fails if the last count is higher than the first, so a last read of 1142 still passes.
- Before the boot render, the same script failed: the first sample was 1143 and the last was 1190. One render now runs before the test hook exists. A short Ayalon drive after that still reached 13 m/s on the road with no damage.

Not done: a 30-minute soak, devices, the architecture locks, Alpha through release.

## Implementation continuation: 2026-10-15
- Working branch: fix/rush-completion-2026-10-15, based on PR 83 head 6395474913c071cb25bc2720238a7b8072045288. Main b2c0d46 remains unchanged.
- Current-source unit tests: 194 passing in implementation-current-suite-04.log; historical exact-tree contracts: 466 passing separately. TEST-CLASSIFICATION.json accounts for every old and new test; current 1800s test is explicit in required CI, not silently skipped.
- Implemented state reset/input release, causal car/race rewind state with assisted-record disqualification, monotonic overtake rewards, zero-cash/idempotent result settlement, geometry/car/physics/tune/condition record fingerprints, namespaced and validated ghosts, uncapped frame telemetry, shared texture/pass ownership, open-track rails/endpoints, static geometry queries, Jaffa elevation continuity, valid smoothstep expressions, hydration readiness and two React static-child defects.
- Accessibility/PWA complete flags are false. No product unit is declared 100%. COMPLETION-PLAN.md continues the original MP-001..046 backlog; PRODUCT-READINESS.json supersedes historical product-completion claims.
- Main protection was read live via GitHub API: active ruleset 23177340, strict required-ci / validate, PRs, no bypass, force push/deletion blocked. Legacy protection endpoint is 403; this does not negate the accessible ruleset evidence.
- Real 66-image licensing CSV and current protection evidence are under evidence/2026-10-15. Private distribution is not public release authorization.
- 56 real worlds assembled in Chromium with real assets: zero non-finite geometries, zero cached texture disposal, zero duplicate disposal; head-on real-building impact test passed. 8/8 pure simulation routes passed (not browser/device acceptance).
- Browser drive 200m passed; full qa:raw passed after ramp test was corrected to compare height at the car's actual post-motion position. Acceleration runner now explicitly loads TypeScript on pinned Node 22.
- Stable lifecycle test passed 20 measured cycles after two warm-ups, all 30 textures / 1194 geometries. Old before-first-frame sampling failed 1159->1194; it is not accepted as a leak result.
- Full 1800s wall-clock soak is running in immutable source snapshot work/rush-soak-snapshot-2026-10-15-r2, source tree f8a454e3329ad8f5c58b4236f8724c081ca03b85e84b4a4f56c7a2ce645f8da0, port 8092. Log work/implementation-soak-30min-frozen-r2.log. It is evidence for that snapshot only: later ghost/sign/cache changes require current-head CI, not a new freeze claim. First frozen soak failed on a real React console error; that failure is preserved and not counted as pass.
- qa-v1-races.mjs runs actual assisted fixed-step browser engines with world colliders/AI/traffic. Initial false failures were replay cuts after finish; corrected to check continuity only during racing. Seven tracks completed; Ayalon was interrupted by our Vite HMR while editing sign-assets. A clean full rerun is required. Heavy collision damage in Jaffa/Rothschild remains a playability/polish concern, not a 100% result.
- Unversioned game/basis files now revalidate; Nitro emits no-cache routes before static filesystem. Content fingerprint pipeline and actual A->B rollback remain open.
- Removed runtime sign-120 CanvasTexture in favor of deterministic sign-speed120.svg with creation evidence. check:canvas now passes. Need final production QA-hook check after this source change.
- ESLint ignores generated artifacts/ (the historical fixture had caused false vendored lint errors); current source lint passed 0 errors / 112 pre-existing warnings.
- No commit, push or new PR yet. Next: clean full V1 browser rerun, current unit/historical/typecheck/lint/security/production verification, commit + reviewable draft PR, observe required CI, retain full soak proof, update exact-source evidence and open external gates. Do not mark owner/device/licence/visual/signing gates complete.

## Final-source verification continuation
- All eight isolated-source assisted browser races reached result UI, did not persist official records/stars, and repeated finish did not alter rewards. Heavy damage remains open.
- Production menu-to-driving keyboard smoke passed without exposed QA hooks; no-cache headers verified. Visual inspection found Ayalon structures/planes obstructing the view; MP-006/022/030 remain open.
- Final-runtime 1800s soak is running on isolated tree 35e56ceab2770a0abafd6faf6f28aabbf1d42850456c79b6ecd58dda46c8ce65. Running is not passed.
- Vite generated cache is excluded from source lint, like other generated output; this does not suppress application-source diagnostics.

- Committed and pushed eb4516712099e2bf320ee3d4507395355db28245; draft PR 84 targets main, no merge. Hosted run 38807141774 current-source unit/build/security and historical jobs passed; browser/soak still running at observation.
- Earlier r2 snapshot soak genuinely passed: elapsedMs 1800226, 15 completed races, offRoadRatio 0. This predates later source and is not final-head acceptance or physical-device p95.
- Visual investigation found low interchange ramps/supports intruding on the race road. New clearance filter preserves a 4.5m envelope, shifts side-ramp centers outside the carriageway, omits on-road piers and uses geometric static placement. All 56 worlds pass including real Ayalon ramp/pier clearance checks. New runtime requires fresh exact-head CI; previous soak stays historical.

- Reviewed open Dependabot PR 82 and PR 47; integrated only brace-expansion 1.1.18->1.1.21, nested brace-expansion 5.0.9->5.0.12, js-yaml 4.3.1->4.3.2 version/resolved/integrity records. Unrelated optional-package removals were not applied. Complete lock identity remains enforced with a documented new SHA-256. npm ci --no-audit passed with 274 packages. This is named patch integration, not a claim of a complete vulnerability audit.

- Full browser runtime rerun on clean f03d13f completed all eight assisted V1 races, then exposed a directional assumption in ramp-smoke: a valid descending HaShalom ramp produced a negative endpoint difference. The test now requires real ascending AND descending ramps, correct height direction, <=0.85m surface error, and >=3m vertical span for each. Both measured spans were 3.38m; no threshold was lowered.

- Removed remaining unsupported completion flags for RTL and onboarding (both false, alongside accessibility/offline).
- Manual night/assist condition changes mark a race assisted even before GO. The disqualification survives in-place engine reset. The real UI Restart now creates a fresh engine with current UI settings and a newly bound record class, rather than retaining an original condition fingerprint. A dedicated real-browser condition/restart check is included in required browser QA.

- Hosted 6297ab2 browser job 116677136327 failed because the QA command exceeded 900000ms, after all eight V1 browser races and subsequent driving checks had completed. The unchanged harness default was too short for the expanded runtime suite on hosted software rendering. Browser command budget is now 1800000ms inside a 35-minute job; all assertions and the separate 1800-second soak remain required. The failed run is preserved and not accepted.

- Candidate still review rejected a near-vertical g06 route-photo view. Static photo queries in frameWorld and QA landmark frames still used progress-biased nearestIndex; they now use closestSample, while moving chase-camera continuity retains nearestIndex. Added actual-browser photo placement regression requiring the intended 28m back offset within real sample-spacing tolerance, real Photo mode, and no JS/console errors. Captures remain unapproved and are not a golden freeze.

- Production visual inspection exposed an underpass regression missed by X/Z-only continuity: actual car y snapped to9.4m above a0.691m road. Added real-world regression first and preserved its failing output. probeRamp now rejects candidates above the existing1.2m entry tolerance for every candidate.40actual underpass cases now stay on the lower road; all56worlds and ascending/descending ramp tests pass.
- PHYSICS_VERSION is8 to separate changed behavior in records/ghosts.15real browser acceleration runs (3per actual car) were compared against unchanged v7 target means:8.45/6.6/4.9/5.8/3.45s, all within the unchanged0.1s regression and15percent claim bands. Only baseline version/authority metadata changed; target means/tolerances were retained. Full V1 QA now checks grounded Y continuity and finite3Dpositions as well as X/Z. Earlier v7 CI/soaks cannot accept this changed physics.

- Physics8 clean full V1 browser rerun passed8/8 actual assisted races with grounded vertical continuity checks and result UI;194current tests/typecheck/current-source secrets passed again. Strict default qa:accel passed against the version8 baseline with unchanged target means and thresholds. Full raw suite and regenerated historical fixture checks are still running at commit preparation.
- Vite now excludes generated artifacts from its file watcher: historical HTML/tsconfig extraction previously reloaded the active game and invalidated two runs. Those interrupted runs remain failures, not passes.
- Hosted prior0f697d7 required CI genuinely succeeded, including1800377ms wall-clock soak with1completed race and offRoadRatio0. Its headless p95Worst14493.9ms is not device performance acceptance, and its physics7 does not accept this changed physics8 candidate. New exact-head CI is required.

- Current save recheck executed all38existing schema/recovery checks against changed source:36passed;2failed only their historical SHA authority checks. New test-current-save-behavior.mjs explicitly excludes those2named identity contracts (still required against b2c in the historical job), and all36current checks pass. Required CI now runs this current recheck separately; these overlapping historical checks are not counted as new unique tests or full save acceptance.
- Airborne smoke used timed unhydrated DOM clicks and one run lost its execution context. It now waits for the real hydration marker and actionable buttons; original ramp/drop/landing assertions are unchanged and passed in the subsequent raw run. That raw run later failed because local invocation omitted SOAK_URL and attempted8080; this is preserved as a failed invocation. Correct-URL lifecycle/damage diagnostics are rerunning. No full raw pass is claimed from that interrupted command.
- Final unit suite194passed, current-save recheck36passed, lint0errors111warnings, governance contract and production QA-hook build passed. Physics8 required CI on38a3f10 is superseded by the next test-harness/current-save commit; wait for the new exact head before gate acceptance.

- Lifecycle diagnostics previously watched pageerror but missed React console.error. Added console error capture and reproduced an actual failure before changing the component: RaceController's pause-volume label passed a static children array to jsx. Whole-src TypeScript AST inspection found exactly this one remaining static-array jsx call. Changed it to jsxs; the strengthened20-cycle run is in progress with its first3measured cycles stable at30textures/1095geometries and no console errors. Current194unit/typecheck/lint pass again (0errors111warnings). Exact-head full CI must rerun; earlier4c/38runs are superseded.

- Hosted27de1f2 run38817204486 correctlyFAILEDoverall: browser command hit1800000ms at lifecyclecycle16/20, after earlier runtime checks had passed. The separate real driving soak SUCCESS measured1800284ms,2completedraces,offRoadRatio0,p95Worst7938.7msheadless. No full27CIpass is claimed. Raw failedbrowser/soak artifacts were preserved separately.
- Browser CI is now split into worlds-races and driving-lifecycle matrix jobs. A deterministic dispatcher verifies that all7canonical qa:runtime:raw gates are covered exactlyonce, then runs their unchanged npm commands. Both matrix jobs remain required through needs.browser.result; fail-fast=false preserves diagnostics. Each retains the existing30-minute command/35-minute job budgets. The separate1800s soak is unchanged.
- Lifecycle reporting now writes passed=false at startup and after each measured cycle, with expectedCycles/measuredCycles/status. Only completing every requested cycle writes passed=true. A killed20-cycle run can no longer leave the earlier2-cycle smoke verdict as its result. No memory thresholds were changed.
- Precommit194unit tests/lint0errors111warnings/governance and exact7-gate split-coverage verification passed. Next candidate still requires both real dispatched browser groups and exact-head hosted fullCI/1800s soak. Game source/assets/physics calibration are unchanged from27de1f2.

## 2026-10-16: Physics 9 median safety and measurable quality contract
- User explicitly authorized rewriting the plans and implementing all necessary improvements. Added QUALITY-TARGETS.md, reconciled all 46 original tasks and committed the 67-unit coverage crosswalk with required current-source graph/coverage tests. Product acceptance remains 0/67.
- Root cause: Rothschild racers spawned on the landscaped center island; road steering assistance pulled valid carriageway traffic toward that island. Shared median geometry and lane offsets now guide mesh generation, steering assistance, player/rival/traffic/police spawns. Other tracks retain the existing centerline behavior. PHYSICS_VERSION=9 separates records.
- Isolated old-force regression: 20 driving cases failed with original fa4630a vehicle.ts and current test geometry; all 20 pass after the fix. All 217 current unit checks and TypeScript pass; lint has zero errors and 111 existing warnings.
- Actual browser world audit: 56 scenes, 40 underpass cases and 20 median-driving cases with real colliders passed, zero median-case damage. Fifteen browser acceleration runs passed unchanged numerical targets and tolerance. Actual-grid Rothschild race completed 3 laps with damage 0.569; this remains a playability problem, not an accepted track.
- A full browser suite and the skill client were interrupted by my live plan/catalogue edits triggering Vite reload. Interrupted results are not passes. Freeze the candidate before repeating the browser gates; keep later evidence writes outside the serving tree.
- Next: corner speed and obstacle-aware AI, Jaffa maximum damage, camera clipping/art; Q-DRIVE/Q-ART remain open. New exact-head full CI and 1800-second soak are required before claiming current code gates. Physical Windows/mobile tests, 66 asset rights and human acceptance remain unavailable.
