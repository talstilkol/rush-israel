# RSH-017 — Engine adapter preflight

**Verified:** 30 August 2026, 21:30 IDT  
**Source of truth:** live GitHub  
**Scope:** RSH-017 only

## Live reconciliation

| Field | Exact value |
|---|---|
| `main` | `ec35e159a9722812d945eaab984f9dc92645205f` |
| Main tree | `8aff09cb4cc582a240f99a8711d56780fd60acb9` |
| Open PRs before work | 0 |
| Existing RSH-017 branch head | `57b34767c3a1a3ae1bbf8d01a7d10984a23ea99e` |
| Branch relation | 3 ahead / 0 behind |
| Existing product changes | 0 |
| Existing temporary files | 2 |
| Force push/history rewrite | No |

The existing branch contained only the temporary source-transfer workflow and one incomplete overlay segment. Its history is preserved; both temporary paths must be absent from the final candidate tree.

## RSH-016 evidence reconciled

| Evidence | Value |
|---|---|
| PR | #19 — merged |
| Validated head | `300e08941e57167bb7ff583378d7833c292ef23a` |
| Merge SHA | `ec35e159a9722812d945eaab984f9dc92645205f` |
| Pre-merge CI | run `33282485982`, job `99179882016` |
| Pre-merge artifact | `9723427805` — `sha256:c9ee74985f4624e12d47373ce418cae87e7a2853d2857a577a020fc959ba271b` |
| Post-merge CI | run `33282738585`, job `99180547601` |
| Post-merge artifact | `9723500214` — `sha256:2f1c7dfec2dacb7bb2bd3ac1a708c3d61095eb00a82a755a11f146a5bc67343b` |
| Unit tests | 356 / 356 |
| Codex review | completed on exact head; no major findings |
| Open review threads | 0 |

## Candidate architecture

| Concern | Methods | Lines | Bytes |
|---|---:|---:|---:|
| loop | 5 | 166 | 4,975 |
| rendering | 28 | 850 | 31,856 |
| physics | 23 | 747 | 26,040 |
| qa | 2 | 442 | 13,198 |
| **Total adapters** | **58** | **2,205** | **76,069** |

- facade: **1,207 lines / 41,703 bytes**;
- support: **206 lines / 7,539 bytes**;
- complete facade + adapters + support: **3,622 lines / 126,462 bytes**;
- legacy reconstruction: **byte-for-byte exact**;
- RSH-018 files: **0**.

## Exact-head validation reconciliation

| Evidence | Exact value |
|---|---|
| Required-CI correction-parent run | `33318523617` |
| Required-CI correction-parent job | `99276258416` |
| Unit-test result on correction parent | `368 / 368` passed |
| Remaining correction-parent failure | TypeScript adapter-host boundary — `24` diagnostics |
| Typed-boundary correction commit | `b9797d1ebc0583453db487256c9861681e455637` |
| Typed-boundary correction tree | `fa05807291a1b6bd019f6573b6092e80b15ad5a2` |
| Typed support SHA-256 | `1304ae1070b2509eb42bcc9942f6ab141bca0d6c7be4b96068be8ac79409b51b` |
| Typed support Git blob | `2da01d857ca5b22958bcabb93e51bf9fcdbae947` |
| Temporary RSH-017 workflows in candidate tree | `0` |
| Product/runtime change in this reconciliation | `0` |

The typed-boundary correction was authored by `github-actions[bot]`, so its automatic pull-request run was marked `action_required` before a validation job was created. This owner-authored reconciliation commit changes documentation only and establishes a normal exact-head `required-ci / validate` trigger. Acceptance still requires the complete CI gate and Codex review on the resulting exact final head.
