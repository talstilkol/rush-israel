# RUSH Israel — Release Register

**Version:** 1.0.0  
**Established by:** RSH-003  
**Product:** Private, owner-controlled  
**Public distribution:** Not authorised

## Current release state

| Field | Value |
|---|---|
| Latest authorised release | None |
| Git tags | 0 |
| GitHub Releases | 0 |
| Verified release gates | 0/13 |
| Release candidate | None |
| Rollback proof | None |

No branch, commit, preview or golden image is a release unless this register names it
and the corresponding authorised Git tag and GitHub Release exist.

## Planned release train

| Release | Controlling unit | Eligibility | Current state |
|---|---|---|---|
| `v0.1.0-alpha.1` | RSH-065 | RSH-001–RSH-064 accepted; alpha dossier complete | BLOCKED |
| `v1.0.0-rc.1` | RSH-066 | Alpha evaluated; all RC blockers closed | BLOCKED |
| `v1.0.0` | RSH-067 | 13/13 gates green; signed tag, artifacts and rollback proof | BLOCKED |

## Release record schema

Every future release entry must contain:

1. exact tag and commit SHA;
2. GitHub Release URL and immutable artifact hashes;
3. accepted-unit count and release-gate result;
4. build environment and dependency-lock hash;
5. migration requirements;
6. known limitations and deferred risks;
7. rollback target, instructions and proof;
8. explicit owner authorisation and timestamp.

## Non-release baselines

| Baseline | SHA | Meaning |
|---|---|---|
| RSH-001 accepted | `0afa4e61086d0d37a05579b037baf6d18b2672a9` | Canonical control plane; not a release. |
| RSH-002 accepted | `ef86c69ade9bc54585104f90743fb32cb4489898` | Governance policy; not a release. |

## Prohibitions

- no public release or archive submission;
- no tag that implies a shipped version before its controlling unit;
- no replacement of an existing release tag;
- no artifact without a recorded cryptographic hash;
- no release claim based only on a branch, PR, preview or screenshot.
