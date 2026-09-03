# RSH-024 — Production Security and Build/Migration Separation

**Unit:** RSH-024
**Implementation base:** `10d0624fce7813b7ad7082adc3c4e92e56c1b851`
**Base tree:** `4a035b9f738d66e4dc825023024d3cd714a4eb96`
**Branch:** `agent/rsh-024-production-security`
**State effective on:** validated merge of the RSH-024 pull request

## Acceptance boundary

RSH-024 hardens production security around the accepted RSH-020 dependency
boundary, RSH-021 save schema, RSH-022 recovery and RSH-023 timed-record
authorities. It does not change save schema version `3`, the deterministic
`0→1→2→3` migration graph, timed records, ghosts, tracks, physics, rendering,
assets, direct dependencies or public-distribution policy.

GitHub branch-protection application remains an owner setting. This unit does
not mutate repository visibility, rulesets or required-check settings.

## Secret-scanning contract

1. Secret scanning covers tracked text under `src/`, `scripts/`, `server/` and
   `.github/`, plus root text such as `.env.example`.
2. The live scan is no longer limited to `src/game`.
3. The pattern set detects OpenAI-style `sk-` values, xAI keys, GitHub tokens,
   AWS access keys, PEM/OpenSSH private keys, Slack tokens, Google API keys and
   quoted `apiKey`/`secret_key` assignments of 12+ characters.
4. Scanner source and the dedicated fixture test are excluded from the live
   scan so pattern definitions cannot fail closed on themselves.
5. Any live hit fails the required QA gate.

## Production QA-hook contract

1. `npm run check:qa` remains in `qa:ci:raw` and fails if a production client
   bundle contains `finishNow` or `__controlsTest`.
2. `src/game/engine/qa-adapter.ts` keeps the accepted production guard
   `if (import.meta.env.PROD && import.meta.env.VITE_QA !== "1") return;`.
3. This unit does not rewrite engine adapters. Runtime QA-hook behaviour stays
   on the accepted RSH-017 identity.
4. GitHub still does not require the check through branch settings. Finding
   P1-01 remains mitigated; release gate 5 remains red.

## Build/migration separation contract

1. `package.json` `"build"` remains exactly `vite build`.
2. `"db:migrate"`, `"check:auth"` and `with-app-env` / `migrate.mjs` stay absent.
3. Auth, database, migration and multiplayer surfaces removed by RSH-020 stay
   absent.
4. Direct package counts remain 10 runtime + 20 development.

## Preservation

| Domain | Change |
|---|---:|
| Save schema version | `0` |
| Migration edges | `0` |
| Timed-record code | `0` |
| Recovery/backup code | `0` |
| Ghost code/schema | `0` |
| Tracks | `0` |
| Physics | `0` |
| Rendering | `0` |
| Engine adapters | `0` |
| Assets | `0` |
| Direct dependencies | `0` |
| Public-distribution authority | `0` |
| Release gates green | `0` |

## Deferred boundary

RSH-025 through RSH-029 are accepted on validated merge. RSH-030 — Deliver
the Version 1 hero car, LODs and silhouette gate — remains deferred, unauthorized and uncreated.
