# RSH-036 — r6.13 bidirectional support repair candidate

Date:2026-09-07 (Asia/Jerusalem). Base:394a9324dd1fb185335833c12a97b0d71ccc55d2.
35/67 accepted;32 remaining. RSH-036 is unaccepted. No merge, freeze, release,
RSH-037 activation, reference replacement or relaxed visual thresholds.

## Reproduced defects and repair scope
The verified r6.12 trace had25 downward snaps (>1.2), up from18, including all
seven changed samples479-485. Any ramp overrode the road, even a deck much lower
than the current supporting road. Simply rejecting higher decks exposed that path.

The shared query now excludes a buried deck when an in-footprint, reachable main
road is closer to the current height. A car already supported on a lower deck
keeps it, and a distant main road is not treated as a global floor. Wheel probes
use the centre-selected deck rather than mixing unrelated bridge surfaces into
road contact. This also prevents a reachable edge of an otherwise unreachable
incline from lifting a road-supported body.

Instant ramp attachment now requires reachable upward entry or continuity from
an already-supported slope; rising and freely falling cars use gravity until
contact. Removing the first-frame altitude clamp prevents a separate downward
teleport before airborne hysteresis settles. Gravity18, step allowance1.2,
contact tolerance0.04 and existing handling/acceleration constants are retained.
This is a support behavior correction, not a new general collision solver.

## Validation plan and evidence boundaries
24 actual-car unit cases plus11 report-validator cases are added. The identical24
actual-car cases produced6 passes/18 failures on the verified old source, then24
passes/0 failures after repair. A focused140-case run (58 contact/support/report
cases plus82 retained source guards) passed locally with TypeScript5.8.3. Two
complete local runs were interrupted without totals; no full local pass is claimed. Existing23
ramp-contact cases are retained, including low-ramp entry and downward query as a
landing target. Report fixtures are not actual driving evidence. Execute the same
24 actual-car cases against old and new vehicle bytes, then the complete suite.

Real browser checks rebuild Ayalon and use all50 real ramps and real colliders:
781 route starts,250 isolated supported-recipe probes, and seven240-step motion
traces. Both jump directions are asserted; the seven regressions require unchanged
road height. Nonfinite/missing/inconsistent route evidence fails. Normal CI keeps
the complete raw contact trace for independent inspection. Repeat execution and
sample counts are not additional unique test cases.

Preparation and exact published-head CI must verify locked dependencies, governance,
full units, lint, QA/typecheck, all retained browser tests and development build.
Original golden comparison is a separate required gate. Normal CI success cannot
override its failure. Preparation-time pending fields are not acceptance claims.

## Preservation and unresolved work
Original PNGs, thresholds, generation11 lock, owner approval, physics calibration,
ramp recipes, meshes, camera, CSS, binary assets and package locks are unchanged.
Historical projections remain exact-hash-bound; current source guards reject
rollback. AUD-21 stays a candidate;21 audit items,42 historical findings,6 repair
bundles and all67 original units are retained without accepted-count inflation.

Full body/roof/column clearance, complete airborne/collision behavior, art/reference
review, three mutable font dependencies and physics/record-version policy remain
open. No physical-device qualification or exhaustive every-line review is claimed.
All13 release gates are open;66 asset licences unverified. No font files distributed.


## Historical candidate1/2 driving validation hold (superseded only by evidence below)
Initial locked preparation34071681721 passed941 units, all781 bidirectional route
starts (25->0 downward snaps),250 supported probes and1680 moving steps, then
FAILED the unchanged combined driving sequence. Later runtime/build/golden steps
were skipped. This is retained failed evidence, not an accepted preparation.

Controlled run34072084083 repeats that exact sequence3 times per revision: old3/3
passes; candidate3/3 failures. Candidate right-steering starts off-track at speed
1.0873345987477152 and ends reversing at-0.25944739361439206 after an earlier
impact. Its direction sign is not a forward-steering measurement. The impact and
lateral-drift behavior are not declared fixed, random or unchanged.

The revised smoke retains the original200m straight corridor and separately
measures both directions after independent reset/warmup. Every steering sample
must remain forward at>=12, grounded, on-track, without impact and with crawl mix
<=.001; wrapped angular threshold0.03 is unchanged.12 new harness fixtures test
these strict preconditions; they are not real vehicle cases. Browser cleanup and
raw result retention are guaranteed on failures. Full locked QA must run again.

Read RSH-036-DRIVING-REVIEW-r6.13.json and retain the original failed-sequence hold
for traffic/impact/evasive qualification before freeze. Isolated steering success
does not make that combined sequence pass. No acceptance or golden waiver.


## r6.13 candidate3 — grade-direction correction; earlier failures retained
Candidate2 run34072958959 passed956 units, both independent forward steering
checks and bidirectional route/motion probes, but FAILED the unchanged acceleration
regression for4/5 cars. Runtime/build/golden steps after that failure were skipped.
This is a real discovered interaction, not a new baseline or a passing workflow.

AUD-22 identifies full ramp slope being applied to perpendicular travel, plus
velocity-sign dependence of signed body gravity. Force and pitch now use the ramp
height derivative projected onto body-forward. Coefficients16.2/7.4, uphill
threshold0.04, pitch3.4, gravity18 and all car/launch calibration bytes are unchanged.
Sixteen real-car unit cases produced2 passes/14 failures before,16 passes after.
Local controlled simulation restores all five acceleration times within the
unchanged0.1-second regression band; it is not locked browser acceptance.

The original combined driving sequence and BOTH unchanged signed0.03 assertions
are restored as mandatory, in addition to the12-sample independent forward checks.
No combined-sequence waiver remains. Failed candidate1 and candidate2 evidence
is retained in the driving/grade reports. Candidate3 full locked QA, exact-head
source verification, retained runtime and original-golden checks remain pending.

Master plan retains67 units,42 historical findings,6 bundles;22 audit items after
AUD-22. Missing reverse mappings AUD-18/AUD-21 to RSH-036 were reconciled.35 units
remain accepted and32 remaining. Body/roof/column clearance, complete traffic and
airborne behavior, art/immutable fonts and physics/record-version policy remain
open; a passed sampled trace is not freeze/release/device acceptance.


## r6.13 resumed — exact physics-clock validation (AUD-23)
Candidate3 run34074163606 passed972 units, the restored original driving sequence,
independent steering and all five unchanged acceleration gates. It then failed
the wall-clock airborne smoke; remaining runtime/build/golden steps were skipped.
Those are retained failures, not a full successful validation.

Diagnostic34074531361 compared three real-engine trials: wall waits advanced only
24/24/36 ticks (0.2/0.2/0.3 seconds); all113-step controlled trials landed. The test
now uses one synchronous actual-engine probe with exact tick checks. The existing
220ms ramp and50+900ms falling budgets,2.2-unit drop,120Hz and gravity18 are unchanged.
Initial fall must match gravity, midpoint must be airborne, and landing must be
grounded/on-track. Missing/stalled/extra clocks, clamped descent and false landing
flags fail. Three browser trials retain raw evidence and always close the browser.
18 harness cases cover success and negative conditions. This is not a rendering
performance fix or full collision/device qualification.

The complete unpublished candidate was recovered from hash-verified original
transport in read-only run34118044362, exactly reproducing treeecf736ff767a18ddb1d3339e01a072dc72c5d6b9.
Final preparation and exact published-head CI remain pending at document creation.
Master plan now contains23 audit items;67 units,42 findings and6 bundles are retained.
No freeze, merge, original-image replacement, new thresholds or later-unit activation.
