# RSH-017 — Engine adapter preflight

**Verified:** 30 August 2026  
**Source of truth:** live GitHub  
**Scope:** RSH-017 only

## Live reconciliation

| Field | Exact value |
|---|---|
| Starting `main` | `ec35e159a9722812d945eaab984f9dc92645205f` |
| Starting main tree | `8aff09cb4cc582a240f99a8711d56780fd60acb9` |
| Open PRs before work | 0 |
| Reconciled branch | `agent/rsh-017-engine-adapters` |
| Force push/history rewrite | No |
| Product/runtime changes outside RSH-017 | 0 |
| RSH-018 structures | 0 |

The pre-existing RSH-017 transfer history was preserved and reconciled. Every temporary transfer, diagnostic, packaging-fix, finalizer and exact-type workflow or generator is absent from the candidate tree.

## RSH-016 evidence reconciled

| Evidence | Exact value |
|---|---|
| PR | `#19` — merged |
| Validated head | `300e08941e57167bb7ff583378d7833c292ef23a` |
| Merge SHA | `ec35e159a9722812d945eaab984f9dc92645205f` |
| Pre-merge CI | run `33282485982`, job `99179882016` |
| Pre-merge artifact | `9723427805` — `sha256:c9ee74985f4624e12d47373ce418cae87e7a2853d2857a577a020fc959ba271b` |
| Post-merge CI | run `33282738585`, job `99180547601` |
| Post-merge artifact | `9723500214` — `sha256:2f1c7dfec2dacb7bb2bd3ac1a708c3d61095eb00a82a755a11f146a5bc67343b` |
| Unit tests | `356 / 356` |
| Codex review | completed on exact RSH-016 head; no major findings |
| Open review threads | `0` |

## Final candidate architecture

| Concern | Methods | Lines | Bytes |
|---|---:|---:|---:|
| loop | 5 | 167 | 5,098 |
| rendering | 28 | 851 | 32,439 |
| physics | 23 | 748 | 26,440 |
| QA | 2 | 443 | 13,243 |
| **All adapters** | **58** | **2,209** | **77,220** |
| typed host boundary | — | 206 | 7,539 |
| engine facade | — | 1,207 | 41,703 |
| **Complete facade + adapters + host** | **58** | **3,622** | **126,462** |

| Identity | Exact value |
|---|---|
| Accepted RSH-016 engine SHA-256 | `3f4d54bbe0b68f9654ae8a92a2f56ce378a59a9790e8fbbe2ee05199ced192c1` |
| Accepted RSH-016 engine Git blob | `692663c6d05ab59c1d99c7a357999839b9ebb0ec` |
| Candidate engine SHA-256 | `e0de91cd924cab7c936a0658ec08a8b9afad00b5eb06861e602df72b69e804f7` |
| Candidate engine Git blob | `a04661751400830bed28e4995cafea04b691496e` |
| Typed host SHA-256 | `1304ae1070b2509eb42bcc9942f6ab141bca0d6c7be4b96068be8ac79409b51b` |
| Typed host Git blob | `2da01d857ca5b22958bcabb93e51bf9fcdbae947` |
| Engine-adapter manifest SHA-256 | `6a567b90ee71552b86985d6dbac8c8c8ce8e5ba65a579891c088777e51a472ec` |
| Accepted engine reconstruction | byte-for-byte exact |

## Exact type boundary

- exactly `199` adapter-visible `RaceEngine` members are declared;
- each host member is bound to its exact `RaceEngine["member"]` type;
- each adapter parameter is bound to `Parameters<RaceEngine["method"]>[index]`;
- adapter return types are inferred from the preserved accepted method bodies;
- each facade wrapper crosses the single explicit `engineAdapterHost(this)` bridge;
- permissive index signatures, ambient module overloads and `any` in the host boundary are forbidden;
- fail-closed tests reject host, signature and bridge drift.

## Typed-boundary correction evidence

| Evidence | Exact value |
|---|---|
| One-shot workflow run | `33329197568` |
| One-shot workflow job | `99304594101` |
| Result | `success` |
| Source correction commit | `5f6c67ce48352a278ed7a4069f7bdb7ca66d2354` |
| Source correction tree | `9f69c5c3c0368b4aa4bb71ec185c4602422cba7b` |
| Unit tests | `369 / 369` passed; `0` failed |
| TypeScript typecheck | passed |
| Lint | `0` errors; `131` warnings |
| Engine-adapter validator | `4` adapters / `58` methods; `0` runtime drift |
| Temporary RSH-017 workflows in source tree | `0` |
| Temporary RSH-017 generators in source tree | `0` |
| Product/runtime change caused by evidence reconciliation | `0` |

The source correction commit was authored by `github-actions[bot]`, so its automatic pull-request `required-ci` run `33329246637` concluded `action_required` without creating a validation job. This owner-authored evidence-only commit establishes the normal exact-head trigger. Acceptance still requires complete `required-ci / validate` success and Codex review on the resulting exact final owner head.
