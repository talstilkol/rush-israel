# RSH-036 — unchanged golden gate failure, 2026-09-05

Master-plan r6.3 acceptance addendum. Applies to AUD-13 / CR-03 visual acceptance
and RSH-036. This does not create or activate a later unit.

Preparation run **33988721068**, candidate tree
`3a06144763611b539ff064dfe1bb390b15467e1f`, passed all normal source-validation
steps: 591/591 unit tests, 8/8 browser cases, lint (124 warnings/0 errors), locked
QA/typecheck and development build. Its overall conclusion is **FAILURE** because
the following unchanged `npm run qa:golden` command crashed.

## Actual failure

The script captured `ayalon-day-g01.png`, `ayalon-day-g05.png` and
`ayalon-day-g07.png`, then failed in `setNight(true)` with:

`TypeError: Cannot read properties of undefined (reading 'color')`

Stack: world `setClock` -> engine `applyClockSky` -> `setNight` -> QA controls.
The night frame and pixel-comparison report were **not produced**. Three captured
images are NOT three passed comparisons. No successful golden comparison count
or mismatch percentage can be inferred from this interrupted run.

Static inspection finds the Ayalon canal material appended to `waterMats` without
a corresponding entry in `bodies`. The clock-change loop reads `bodies[i].color`
for every water material. Repair material/color association with direct day/night
and repeat-cycle tests; do not hide the failure by skipping the night frame,
ignoring the exception or changing thresholds/baselines.

The separate persistent black rothschild scene is still unresolved. No shared
root cause between these two visual problems has been established.

## Evidence

Artifact **9976008655**, 1,298,335 bytes; SHA-256
`0e789590167b0cac9bebcc97aa4b75e1a51fb0455bb670d005be1c46acb8fa73`.
Contains full unit/QA/build logs, actual browser results, three captured day
frames, golden error log and validated source-tree metadata.

Normal required CI does not include this golden command. A green normal run must
not supersede this failed acceptance gate. Freeze remains false; RSH-036 remains
unaccepted, 35/67 units accepted, 32 remaining. No merge or release is permitted
while these blockers remain.
