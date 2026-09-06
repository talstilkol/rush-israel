# RSH-036 — Safe capture output and immutable CI actions (r6.7)

Date: 6 September 2026. Verified repair base: `5f7be6290f84cce752b93946174fbf7b29f8ed73`.
Main remains `e01d91de5dfa11685a51dcea90c1dbc8e2d2148a`. RSH-036 remains in review,
35/67 accepted and 32 remaining. No freeze, release, merge or RSH-037 activation.

## Scope and behavioral changes

Both golden commands now share `scripts/golden-output.mjs`. The output cannot
be the immutable canonical baseline, its ancestor or descendant, or overlap an
alternate comparison directory. Canonical path resolution rejects aliases and
broken links. All known output entries are checked before cleanup; symbolic
links, hard links and non-files are rejected. Writes create files exclusively,
preventing an existing linked target from being overwritten. Cleanup touches
only the current command's declared diagnostic filenames.

`qa:ayalon` now defaults to `artifacts/ayalon-capture`, not `golden-baseline`.
Use `GOLDEN_OUTPUT` for an alternate safe capture directory. Ambiguous historical
`GOLDEN_DIR` output and `UPDATE_GOLDEN=1` are rejected before browser startup.
It awaits the actual hydrated Ayalon engine, preserves its original four poses,
500/400/500 ms waits and steering smoke check, records phase/failure evidence and
closes an acquired browser in `finally`. A successful capture explicitly reports
**zero comparisons**, never an art acceptance. Browser failures cannot reuse an
old passing capture report. The original pixel comparison still uses its distinct
450/400/500 ms recipe, original PNGs, 1280x800 viewport, threshold 0.12 and limit 8%.

A new 22-case filesystem/legacy-runner suite covers overlap, aliases, dangling
links, hard links, exclusive writes, stale reports, ambiguous flags, four-frame
success and seven browser failure phases. The renderer adapter is simulated in
these unit cases; a real browser execution is required separately.

## CI action identity

The following official `v4` refs were read through GitHub on 6 September 2026,
and the workflow pins exactly those existing implementations, not a new major version:

| Action | Verified commit |
|---|---|
| actions/checkout | `11d5960a326750d5838078e36cf38b85af677262` |
| actions/setup-node | `49933ea5288caeca8642d1e84afbd3f7d6820020` |
| actions/upload-artifact | `ea165f8d65b6e75b540449e92b4886f43607fa02` |

Sources: the corresponding `https://api.github.com/repos/actions/{action}/git/ref/tags/v4`
GET responses. This is upstream identity verification, not an exhaustive audit
of action implementations, runner images, transitive downloads or third-party security.
The normal workflow still has `contents: read` and now runs the real legacy
capture/steering check on every required-CI revision, separately from comparisons. Nine direct pin tests plus two
new governance negative tests reject mutable tags, unknown action IDs, arbitrary
40-character hashes and unknown/local/container action references. The dependency
inventory records reviewed action identities explicitly instead of treating any
40-character string as proof. Existing governance assertions are updated to test
immutable identity, not weakened to accept any tag.

## Validation and remaining work

The previous published source passed 733 unit cases, 20 actual-game browser cases
and five readiness fixtures in required CI run 33999898243. Its original golden
comparison failed 0/4 in separate preparation run 33999614477. Those failures
remain evidence, not current-candidate test results.

Candidate normal exact-head CI, real legacy capture and unchanged golden comparison
must run before any validation claim is promoted. The generated inventory now
also follows the legacy capture entrypoint. Three mutable action references are
resolved to explicit verified identities; seven potential font/host references
remain unqualified. Complete dependency closure and freeze acceptance remain false.
The observed original-versus-current rendered geometry/material differences are
not yet a proven causal explanation of the four golden mismatches. Do not restore
obsolete product code or replace PNG authorities merely to force a passing score.

Next: preserve both writer safeguards; qualify the remaining seven external
references with source and runtime evidence; perform source/camera/asset bisection
for all four original golden failures. Retain all day/night, asset rollback and
visible Rothschild regressions. All 13 release gates remain open and 66 asset
licences unverified. No physical-device qualification is claimed.

Local preflight: 770/770 unit cases passed using the container TypeScript 5.8.3,
not a locked npm install. The first 768-case run had three obsolete v4-tag assertions;
they were migrated to exact verified action identity, with two added negative cases.
The corrected total adds 37 unique cases to the 733-case live baseline: 22 output/runner,
9 action identity, 2 governance negatives and 4 source-evolution guards.
