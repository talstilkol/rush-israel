# RUSH Israel — NEXT Contract

**Version:** 2.8.0  
**Repository:** `talstilkol/rush-israel`  
**Canonical branch:** `main`  
**RSH-012 implementation base:** `aab3b725f256ff5a0a145c5cd3ac749860bdaeb9`  
**State effective on:** merge of PR #15  
**Next eligible unit after merge:** `RSH-013`  
**Active branch after merge:** none  
**Active PR after merge:** none

## 1. Authority

GitHub and the canonical control documents govern the program. Live GitHub evidence
supersedes chat summaries and recorded SHAs whenever they differ.

The owner instruction `next 5` authorises exactly:

1. RSH-010 — accepted;
2. RSH-011 — accepted;
3. RSH-012 — accepted when PR #15 merges;
4. RSH-013 — next eligible unit, not pre-created;
5. RSH-014 — final authorised unit, blocked by RSH-013.

The batch closes after RSH-014. RSH-015 is not authorised.

## 2. RSH-012 acceptance boundary

PR #15 may merge only when its exact final head proves all of the following:

- product identity is exactly `RUSH Israel`;
- package version is `0.0.0-private`, package privacy is `true`, and package licence is `UNLICENSED`;
- the proprietary root `LICENSE` grants no public licence;
- `THIRD-PARTY-NOTICES.md` and `ASSET-PROVENANCE.json` preserve all third-party and unverified-asset boundaries;
- README documents Node `22.16.0`, npm `10.9.2`, `npm ci`, `npm test`, `npm run qa:ci` and `npm run build:dev`;
- root title and description contain no obsolete “Israel and New York” claim;
- Open Graph, Vite dev/preview and deployed Nitro PWA surfaces use the exact RUSH Israel identity;
- 66 public asset files remain unverified;
- public distribution remains unauthorised;
- release gates remain 0/13;
- `required-ci / validate` and Codex review pass on the same exact head.

## 3. Post-merge queue head

`RSH-013 — Define and validate the canonical track schema`

RSH-013 remains unstarted until a new `next` instruction. Its branch and PR must both
be absent after the RSH-012 merge.

## 4. Truth boundaries

- Repository visibility remains public against the private owner policy.
- `main` remains unprotected with zero required checks and zero rulesets.
- The root proprietary licence covers owner-created material only.
- The 56 track-card images, seven Grok visual assets and three root-branding assets remain unverified.
- Legal clearance remains incomplete.
- Public distribution remains unauthorised.
- A candidate cannot encode its own future merge SHA. The PR #15 exact head and merge
  SHA are read from live GitHub and reconciled in the RSH-013 preflight.
- Release gates remain 0/13.

## 5. Transition to RSH-013

RSH-013 starts only after:

1. PR #15 exact final head passes `required-ci / validate`;
2. Codex reports no unresolved blocking finding on that same head;
3. PR #15 merges;
4. live `main` is re-read;
5. a new explicit `next` instruction is received.

## 6. Prohibited actions

- starting or pre-creating RSH-013 during the RSH-012 session;
- starting or pre-creating RSH-015;
- claiming the repository is private or `main` is protected;
- claiming legal clearance while 66 assets remain unverified;
- enabling public distribution;
- direct `main` writes, force-push or history rewrite.

## 7. Post-merge metrics

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted units | 12 |
| In review | 0 |
| Eligible | 1 |
| Deferred | 54 |
| Remaining units | 55 |
| Queue head | RSH-013 |
| Active PR | none |
| Batch units completed | 3/5 |
| Batch authority remaining | 2 |
| Unverified asset files | 66 |
| Legal clearance complete | No |
| Release gates | 0/13 |
