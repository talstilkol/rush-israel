# RUSH Israel — NEXT Contract

**Version:** 2.7.0  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**Verified base:** `d8259877740a2feab6533f1723fd21be8fb2f6c2`  
**Active unit:** `RSH-011`  
**Active branch:** `agent/rsh-011-asset-provenance`  
**Active PR:** `#14`

## 1. Authority

GitHub and the canonical control documents govern the program. Live GitHub evidence
supersedes chat summaries and recorded SHAs whenever they differ.

The owner instruction `next 5` authorises exactly:

1. RSH-010 — accepted;
2. RSH-011 — active;
3. RSH-012 — blocked by RSH-011;
4. RSH-013 — deferred inside the authorised batch;
5. RSH-014 — final authorised unit.

The batch closes after RSH-014. RSH-015 is not authorised.

## 2. Sequential execution

Each authorised unit requires:

- the exact live `main` created by the preceding merge;
- a distinct branch and PR;
- exact-head `required-ci / validate` success;
- deterministic unit-specific tests and changed-set evidence;
- review findings resolved before merge;
- no later-unit pre-creation;
- merge only after the acceptance boundary passes.

## 3. Current queue head

`RSH-011 — Create the complete asset provenance and licence inventory`

The exact final PR head must prove that:

- every tracked file recursively under `public/` is classified exactly once;
- the inventory contains exactly 134 shipping files and 131 asset files;
- the 56 `public/tracks/<TrackId>.jpg` files map one-to-one to the canonical catalogue;
- the generated-game-asset and Basis Universal evidence remains present;
- exactly 67 shipping files and 66 asset files remain unverified;
- unverified groups cannot claim legal or public-distribution clearance;
- complete inventory coverage is not represented as complete provenance evidence;
- all canonical program-control records agree;
- release gates remain 0/13.

## 4. Truth boundaries

- RSH-010 is accepted at merge SHA `d8259877740a2feab6533f1723fd21be8fb2f6c2`.
- Repository visibility remains public against the private owner policy.
- `main` remains unprotected with zero required checks and zero rulesets.
- The 56 track-card images, seven Grok visual assets and three root-branding assets lack sufficient source/licence evidence.
- RSH-012 may establish the root proprietary licence but may not silently clear unverified assets.
- The canonical track schema remains RSH-013.
- Physical module splitting remains RSH-014.
- Five zero-to-100 claims remain failed and belong to RSH-033.
- Release gates remain 0/13.

## 5. Transition to RSH-012

RSH-012 starts only after:

1. PR #14 exact final head passes `required-ci / validate`;
2. all 134 public files classify exactly once;
3. legal and distribution claims fail closed while blockers remain;
4. blocking review findings are resolved;
5. PR #14 merges under the owner batch;
6. its live merge SHA is recorded in the RSH-012 branch.

## 6. Prohibited actions

- treating complete inventory coverage as legal clearance;
- clearing an unverified asset without source or permission evidence;
- enabling public distribution;
- direct `main` writes, force-push or history rewrite;
- creating RSH-012 before PR #14 merges;
- starting or pre-creating RSH-015.

## 7. Current metrics

| Metric | Value |
|---|---:|
| Accepted units | 10/67 |
| In review | 1 |
| Remaining units | 57 |
| Queue head | RSH-011 |
| Active PR | #14 |
| Batch units completed | 1/5 |
| Batch authority remaining | 4 |
| Public files inventoried | 134/134 |
| Asset files | 131 |
| Unverified asset files | 66 |
| Legal clearance complete | No |
| Release gates | 0/13 |
