# RUSH Israel — NEXT Contract

**Version:** 2.9.0  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**RSH-013 reconciled implementation base:** `e9b7683330bb288e9e5005e595f699b58d7ad20f`  
**State effective on:** merge of PR #16  
**Next eligible unit after merge:** `RSH-014`  
**RSH-015 authorised:** no

## 1. Authority

GitHub and the canonical control documents govern the program. Live GitHub evidence
supersedes chat summaries and recorded SHAs whenever they differ.

The owner instruction `next 2` authorises exactly the serial sequence RSH-013 then
RSH-014. It does not authorise RSH-015. RSH-014 starts only after RSH-013 is validated,
reviewed, merged and live `main` is re-read.

## 2. RSH-013 acceptance boundary

PR #16 may merge only when its exact final head proves:

- one machine-readable schema agrees with `TrackId`, `CityId` and `TrackDef`;
- all 56 definitions are present exactly once;
- the frozen classification remains 8 MVP and 48 deferred;
- canonical ID order and runtime definition order are treated as distinct authorities;
- the committed Ayalon point-builder IIFE is accepted only by the narrow reviewed form;
- the reconciled complete `src/game/tracks.ts` Git blob is exactly `e26454223f8a598cdf516af7c7c3f494162e2616`;
- the ordered runtime-definition digest is exactly `a1ccf6f71ca7c4bad7fbc1280aecb04cdc4390ca400cf183cd3fde916d14294d`;
- the aggregate runtime-definition digest is exactly `1f10ef1b656fb61b414aed82a1918ade65c5093fcedf486b2aa3b37527d5dfb7`;
- valid-looking runtime-data mutations fail the digest check;
- runtime data and runtime ordering changed relative to reconciled live `main` are both zero;
- release gates remain 0/13;
- exact-head `required-ci / validate` and Codex review pass with no unresolved blocking thread.

## 3. Transition to RSH-014

After PR #16 merges, RSH-014 is the sole eligible queue head and the second unit of
the current `next 2` instruction. It must use a new branch and PR from verified live
`main`. It may relocate definitions into one module per track only if the exact
ordered runtime digest remains unchanged.

## 4. Truth boundaries

- Repository visibility remains public against the private owner policy.
- `main` remains unprotected with zero required checks and zero rulesets.
- Exactly 66 public asset files remain unverified.
- Legal clearance and public distribution remain blocked.
- A candidate cannot encode its own future merge SHA; PR #16 evidence is reconciled in RSH-014 preflight.
- Release gates remain 0/13.

## 5. Prohibited actions

- starting RSH-014 before PR #16 merges;
- starting or pre-creating RSH-015;
- changing track runtime data, runtime order, IDs or MVP membership in RSH-014;
- claiming repository privacy, branch protection or legal clearance without live evidence;
- direct `main` writes, force-push or history rewrite.

## 6. Post-merge metrics

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted units | 13 |
| In review | 0 |
| Eligible | 1 |
| Deferred | 53 |
| Remaining units | 54 |
| Queue head | RSH-014 |
| Active PR | none |
| Batch units completed | 4/5 |
| Batch authority remaining | 1 |
| Unverified asset files | 66 |
| Legal clearance complete | No |
| Release gates | 0/13 |
