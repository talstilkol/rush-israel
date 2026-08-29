# RUSH Israel — NEXT Contract

**Version:** 2.6.2  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**Verified base:** `69765febef85d732d9ba79fe260fec78ee76b2df`  
**Active unit:** `RSH-010`  
**Active branch:** `agent/rsh-010-track-catalogue-classification`  
**Active PR:** `#13`  
**Replaced Draft PR:** `#12`, closed unmerged after connector Ready-for-review failure

## 1. Authority

GitHub and the canonical control documents govern the program. Live GitHub evidence
supersedes chat summaries and recorded SHAs whenever they differ.

The owner instruction `next 5` authorises exactly:

1. RSH-010 — active;
2. RSH-011 — blocked by RSH-010;
3. RSH-012 — deferred inside the authorised batch;
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

`RSH-010 — Classify the track catalogue into 8 MVP and 48 deferred tracks`

The exact final PR head must prove that:

- `src/game/types.ts` and `src/game/tracks.ts` expose the same 56 unique IDs;
- `TrackId` order alone is the canonical classification order; the historical `TRACKS`
  declaration order is not required to match it;
- every live ID is classified exactly once;
- exactly 8 IDs are MVP and exactly 48 are deferred;
- the frozen names map exactly to `ayalon`, `rothschild`, `namal`, `oldjaffa`,
  `scopus`, `haifa`, `ramon` and `hermon`;
- no deferred track is deleted or implicitly promoted;
- `TRACK-CATALOGUE-CLASSIFICATION.json` and its validator fail closed on source drift;
- all canonical program-control records agree;
- release gates remain 0/13.

## 4. Truth boundaries

- RSH-009 is accepted at merge SHA `69765febef85d732d9ba79fe260fec78ee76b2df`.
- Repository visibility remains public against the private owner policy.
- `main` remains unprotected with zero required checks and zero rulesets.
- Asset provenance remains incomplete until RSH-011.
- README, metadata, branding, root licence and PWA alignment remain RSH-012.
- The canonical track schema remains RSH-013.
- Physical module splitting remains RSH-014.
- Five zero-to-100 claims remain failed and belong to RSH-033.
- Release gates remain 0/13.

## 5. Transition to RSH-011

RSH-011 starts only after:

1. replacement PR #13 exact final head passes `required-ci / validate`;
2. all 56 IDs validate as 8 MVP and 48 deferred;
3. blocking review findings are resolved;
4. PR #13 merges under the owner batch;
5. its live merge SHA is recorded in the RSH-011 branch.

## 6. Prohibited actions

- implicit Version 1 scope expansion;
- deleting deferred catalogue entries;
- treating catalogue classification as release readiness;
- direct `main` writes, force-push or history rewrite;
- creating RSH-011 before PR #13 merges;
- starting or pre-creating RSH-015.

## 7. Current metrics

| Metric | Value |
|---|---:|
| Accepted units | 9/67 |
| In review | 1 |
| Remaining units | 58 |
| Queue head | RSH-010 |
| Active PR | #13 |
| Replaced unmerged PR | #12 |
| Batch units completed | 0/5 |
| Batch authority remaining | 5 |
| Catalogue | 56 = 8 MVP + 48 deferred |
| Release gates | 0/13 |
