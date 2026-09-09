# RUSH Israel — r6.15 verification addendum

Date: 2026-09-09. Active unit: **RSH-036, unaccepted**. This supplements, and does not replace, MASTER-PLAN.md, MASTER-PLAN-r6.json and NEXT-CONTRACT.md version 20.14.0. The original 67 units, 42 historical findings, six repair bundles and 25 audit IDs remain intact. Acceptance remains **35/67; 32 units remain**. RSH-037 must not be started or prepared.

## Closed follow-up: exact published r6.15 evidence

The verified product is commit `ec79dbefaef2de415c252ef0ce1cd1b76c634df3`, tree `2dddd463ceca148ee7ac0f3817ba052bcacb0ea5`, not synthetic merge `a4181335e5aea91ee2dbf6978d5aef0718960927`. Required CI run 34325442324, job 102381514184 completed successfully at 2026-09-09T07:53:39Z.

Both source and result archives were downloaded and verified by byte length, SHA-256 and ZIP CRC. The 786 source blobs and byte sizes match the retained manifest; reconstruction using paths and Git modes matches the published tree. Missing, unexpected or mismatching source files: zero. Final TAP and ci-summary independently report 1,091 passing unit tests, zero failures and zero skipped. Final lint reports 123 warnings and zero errors. All 25 captured evidence files are present with matching lengths. These figures were read from final artifacts, not copied from preparation.

Machine-readable identities, digests, methods and limits are in [the published-CI verification record](docs/evidence/r6.15-published-ci-verification.json). This closes the earlier pending artifact-content audit for that exact product commit only. Later documentation or product commits require their own CI evidence; this report does not inherit or fabricate an exact-head PASS.

## Closed follow-up: consumed helper files

The helper branch `agent/rsh-036-r615-validation-20260909` is retained. Four regular commits advanced it from `3e68a18e993c9a23361740eea3e9c100aab2eeda` to `c93438d21aca7ef5a8bc90467a2b6545849fde83`. The comparison contains only four deletions: `.github/workflows/rsh036-r615-prepare.yml`, `.r615-spawn`, `.r615-transfer-0` and `.r615-transfer-1`. Historical bytes remain in Git. No main or product-code changes were included in that cleanup.

## Unchanged acceptance blockers and execution order

Normal-CI success is not visual qualification or freeze approval. The separate original-golden result remains **0/4 from preparation run 34324754353**. The normal published-CI run did not execute that screenshot comparison. Keep the original 1280x800 references, pixel threshold 0.12, failure threshold 8%, generation-11 ayalon.lock and historical owner approval. Reference transitions require separate explicit approval and provenance.

Continue only within RSH-036, in the existing contract order:

1. Reproduce pitched/rolled body and roof, bridge-underside/low-passage and overlapping-obstacle failures; add old-code-failing regression tests before each runtime fix. The upright 1.6-unit body proxy and 1.77 contact radius are not full envelope or route qualification.
2. Resolve the four locked-view appearance, material and occlusion differences without replacing references or relaxing thresholds.
3. Qualify physics-record compatibility. Version 7 and stored records are unchanged; no silent deletion or conversion.
4. Qualify the three font dependencies without distributing font files, and qualify rendering performance.

Preserve 546 prior collider records, all 50 ramp recipes, eight checkpoints, both travel directions, gradients, steering, all five cars, landing, loading and recovery coverage. Keep unit tests, browser measurements, repeated runs and visual comparisons separate. The explicit 85-path freeze list remains partial, not proof of complete coverage. All 13 release gates and 66 unverified asset licences remain open.

This addendum resolves only the two named follow-ups. It does not change acceptance authorities, grant freeze, authorize merge or release, activate RSH-037, rewrite history, delete refs or authorize public distribution.
