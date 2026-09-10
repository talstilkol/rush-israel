# RSH-036 r6.20 — pin product font URLs without distributing font files

Candidate, 10 September 2026. Base 712af4195208228a09feec643441549952ecee55
(r6.19 slab-underside supports). No merge or freeze; 35/67 accepted; 32 remain.
r6.17 and r6.18 exact-head failures are retained. Do not relabel them as passes.

## r6.19 exact-head CI independently verified

Required CI **34389785192**, job **102594962162**: SUCCESS on checkout
`712af4195208228a09feec643441549952ecee55` / tree
`272972601cb727e51a3f0b18c05a10d7eecf3d7a`. Downloaded archives:

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| required-ci-34389785192-1 (10119573083) | 2,463,106 | `d9d515b9dd30c82f3e44d1c6146bc022002e59e0698eb19cd7beb03f342edd2a` |
| audit-source-34389785192-1 (10119147651) | 43,473,223 | `df0d0762c48295d21b6a39f4a3da95129cdf3c200d87695e02eedbfc04af8451` |

Final `ci-summary.json` and TAP: **1,149/1,149**. Lint 123 warnings / 0 errors.
Runtime-recovery ramp supports: passed, failedRamps 0, maxProtrusion 0, 176 piers.
Trigger merge `96c7407a...` is not the checkout. This is not freeze or original-golden
acceptance. Original golden remains 0/4 from preparation 34324754353.

## AUD-30: reviewed font URL pins

The three remaining unqualified externals were the Heebo/Noto stylesheet and the
two Google Fonts preconnect hosts. r6.9 already proved denied-font usability and
hashed CDN bodies in memory; those hashes are still observations, not pins.

`scripts/font-dependency-boundary.mjs` now pins the exact product URLs and
`--font-sans` stack. Family/weight/host drift, an extra Google Fonts family, or a
vendored `.woff2` fail closed. `src/styles.css` and `src/routes/__root.tsx` are
unchanged. Font files written: 0. `immutable_bytes_verified` stays false, so
`complete_dependency_closure` stays false. Freeze path count stays 85;
evolution sourceCount stays 58. The new helper is not added to either list.

Local unique cases: 9 in `scripts/font-dependency-boundary.test.mjs`. Previous
r6.19 suite 1,149 + 9 = 1,158 expected. Original golden, immutable CDN bytes,
rendering performance and freeze remain open.
