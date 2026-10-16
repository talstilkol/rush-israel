# Acceleration reference epoch review

The hosted d6f8b6e driving job rejected `golden-baseline/accel.json` before measurements: reference epoch11 did not match `PHYSICS_VERSION12`. The preceding runtime change separated records after landmark contact-layout fixes; it did not change the acceleration model or car definitions.

This correction changes the reference epoch and explanatory authority only. All other fields match the actual archived parent reference byte-for-value, including the five means, gameplay claims,0.1-second regression tolerance,15% claim tolerance and original `generatedFromPhysicsVersion:8`. No baseline-update override is used. A new unit guard fails on the actual old header and passes after the correction.

`accel-first.json` records five actual browser-engine cars with three successful trials each. These are deterministic simulated 0–100 trials, not measured real-car physics. `accel-full-suite.json` comes from the subsequent canonical driving-lifecycle suite. The frozen browser runtime is the clean d6 clone; all436 source/public hashes equal this commit. Updated reference/test/control files are separately hashed in `proof.json`.

The first local full-suite attempt omitted `SOAK_URL`; the lifecycle script therefore attempted the default8080 address and failed with connection refused. Its actual transcript and failed JSON remain here. The corrected invocation supplies both `SMOKE_URL` and `SOAK_URL` for frozen8124. No game code, gates, tolerances or cycle counts were changed to pass.

Lint currently reports0 errors and119 warnings:111 runtime warnings plus8 from the already committed historical evidence protocol. The preceding111 count was collected before that protocol was copied into the evidence tree; it must not be presented as a new clean-tree119-to111 improvement.

The parent CI remains failed. Any parent30-minute result retains its exact d6 SHA. The new commit needs its own hosted CI and real1800-second soak. This patch does not establish full physical calibration, all-track collision acceptance, graphics quality, accessibility, physical-device performance, rights clearance or product/release acceptance.
