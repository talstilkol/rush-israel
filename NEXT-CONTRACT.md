# RUSH Israel — NEXT Contract

**Version:** 20.6.0
**Checkpoint date:** 2026-09-06, Asia/Jerusalem
**Repository:** talstilkol/rush-israel
**Canonical main:** e01d91de5dfa11685a51dcea90c1dbc8e2d2148a
**Verified repair base:** 5f7be6290f84cce752b93946174fbf7b29f8ed73
**Active:** RSH-036 / PR #39 / agent/rsh-036-ayalon-freeze — not accepted.

## Authority and reconciliation
Standing owner audit/repair/master-plan improvement authority applies. One active
programme unit; 35/67 accepted, 32 remaining. Release gates 0/13, unverified assets 66.
No public distribution, history rewrite, force-push or automatic golden replacement.
Re-read live main, PR, reviews and exact-head artifacts before editing. Never restore
an older local bundle over a newer published GitHub head.

## r6.7 work
Both capture commands protect canonical and selected reference directories, reject
linked file targets and write outputs exclusively. `qa:ayalon` defaults to
`artifacts/ayalon-capture`; override with `GOLDEN_OUTPUT`, never `GOLDEN_DIR`.
Captures and steering checks are not comparisons or visual acceptance. Failure
reports and browser cleanup apply to both commands. Image bytes and pixel thresholds
remain unchanged. Three CI action identities are pinned and validated, with explicit
provenance rather than trusting any syntactically valid hash. Seven potential remote
font/host references still require qualification. Full closure remains false.

## Next work
1. Read RSH-036-RUNTIME-REPAIR-r6.7.md and the latest PR checkpoint together. Committed
   preparation status is not a substitute for later exact-head CI results.
2. Inspect the new normal-CI and actual legacy-capture results. Preserve the existing
   20 game/resource cases and five readiness-fixture cases; do not add repeated runs
   to the count of unique tests.
3. Attribute each of the four original golden failures through source/camera/asset
   provenance and controlled bisection. Use original 0.12 threshold, 8% limit and PNGs.
4. Qualify the seven remaining external font/host references and runtime conditions;
   an action pin is not full proof of the remote execution environment.
5. Maintain complete generated local inventory and added/removed-file detection,
   resource rollback, repeated day/night and visible Rothschild scene assertions.
6. Only validated acceptance can grant a freeze and activate RSH-037.
