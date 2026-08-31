# RUSH Israel — Self-Starting QA Harness

**Unit:** RSH-006  
**Canonical server:** `http://127.0.0.1:8080/`  
**Server owner:** `scripts/run-with-server.mjs`

## Standard commands

```bash
npm run qa
npm run qa:ci
```

Both commands now:

1. refuse to test an unknown process already listening on port 8080;
2. start the repository-local Vite binary directly;
3. enable the QA build flag;
4. wait until the server responds;
5. execute the requested QA command;
6. preserve the child exit code;
7. terminate the QA command and server process trees on completion, timeout or signal.

No separate terminal or manually started development server is required.

## Public and raw scripts

Commands without `:raw` own their server lifecycle. Commands ending in `:raw` are
internal building blocks and assume the harness has already started the server.

Examples:

| Public command | Internal command |
|---|---|
| `npm run qa:drive` | `npm run qa:drive:raw` |
| `npm run qa:golden` | `npm run qa:golden:raw` |
| `npm run qa:soak-smoke` | `npm run qa:soak-smoke:raw` |
| `npm run qa:ci` | `npm run qa:ci:raw` |

Static checks such as `qa:ktx2`, `qa:ayalon-lock`, typecheck and unit tests do not
start a browser server when invoked independently.

## Existing-server reuse

The default is fail-closed. If a server already responds at the configured URL,
the harness exits instead of testing an unknown or stale process.

Reuse is allowed only when explicitly requested:

```bash
QA_REUSE_SERVER=1 npm run qa:drive
```

A noncanonical `QA_SERVER_URL` is accepted only for an explicitly prestarted,
responding server with `QA_REUSE_SERVER=1`. Automatic startup is restricted to the
exact IPv4 endpoint `http://127.0.0.1:8080/`; `localhost`, IPv6, another port,
path, query or HTTPS endpoint is never auto-started. A server created by the
harness is always stopped by the harness, regardless of the reuse flag.

## Timeouts

| Variable | Default |
|---|---:|
| `QA_START_TIMEOUT_MS` | `60000` |
| `QA_COMMAND_TIMEOUT_MS` | `900000` |
| `QA_STOP_TIMEOUT_MS` | `5000` |

All timeout values must be positive integers. A command timeout is a hard failure
and triggers process-tree cleanup.

## URL propagation

The harness exports the canonical URL to child scripts as:

- `QA_SERVER_URL`
- `SMOKE_URL`, unless already explicitly set
- `SOAK_URL`, unless already explicitly set

The QA hook is enabled by `VITE_QA=1`; browser smoke commands therefore do not rely
on a `?qa=1` query parameter to expose their deterministic control surface.

## Cross-platform behaviour

- Linux and macOS: server and QA commands run in detached process groups and are
  terminated with `SIGTERM`, then `SIGKILL` after the cleanup deadline.
- Windows: process trees are terminated with `taskkill /t /f`.
- npm/npx commands resolve to their `.cmd` launchers on Windows.
- interruption exits use conventional values: `SIGHUP=129`, `SIGINT=130`,
  `SIGTERM=143`.

## Source-level validation

`npm run test:harness` covers:

- argument and URL parsing;
- exact canonical self-start restrictions;
- Vite startup specification;
- readiness probing and early server exit;
- conventional signal exit codes;
- canonical queue/control invariants;
- exact Node/npm pin agreement;
- package/lockfile root metadata agreement.

The lockfile metadata check also prevents recurrence of the RSH-004 review finding
where a root `engines` field could make a clean npm operation rewrite
`package-lock.json`.

## Validation boundary

RSH-006 provides deterministic source tests for parsing, server specification,
readiness probing, fail-closed behaviour, signal semantics and toolchain metadata.
The first clean-clone runtime execution and GitHub-hosted evidence are controlled by
RSH-007. Until that unit runs, the harness is implemented but its full environment
execution remains unverified.
