# RSH-022 — Save Backup, Corruption Recovery and Visible Failure Handling

**Unit:** RSH-022
**Implementation base:** `9bd606a0e6b054b0edafd4eeb6c7d614b3102b4b`
**Base tree:** `56da87772e707c7e4002264db25f447aa1074346`
**Branch:** `agent/rsh-022-save-recovery`
**State effective on:** validated merge of the RSH-022 pull request

## Acceptance boundary

RSH-022 adds a bounded, verified recovery layer around the accepted RSH-021
save-schema authority. It does not change schema version `3`, the deterministic
`0→1→2→3` migration graph, timed records, ghosts, tracks, physics, rendering,
assets, dependencies or distribution policy.

## Backup contract

1. The backup key is `rush-v1-backup`.
2. The first write verifies the backup before writing the current key.
3. A later write copies the exact previous current bytes to the backup and
   verifies them before replacing the current key.
4. Migration or normalization backs up the exact source bytes before the
   RSH-021 loader writes canonical v3 bytes.
5. A backup read, write or verification failure prevents an unsafe current-key
   overwrite and returns structured status.
6. An invalid backup is copied byte-for-byte to
   `rush-v1-backup-rejected` before the backup slot is reused.

## Recovery contract

- Recovery is explicit; corrupt or missing current data is never restored or
  reset automatically.
- A valid backup is migrated through the accepted RSH-021 graph, serialized
  canonically, written to the current key and verified.
- Rejected current bytes are preserved before replacement in one of two bounded
  slots: `rush-v1-rejected` and `rush-v1-rejected-previous`.
- If both rejected-save slots contain different bytes, recovery fails closed
  instead of discarding evidence.
- A fresh start is allowed only when no valid active save and no valid backup
  exist. It requires a two-step UI confirmation and preserves rejected bytes
  before writing a new canonical v3 save.
- Legacy bytes under `tlv-rush-v1` are never deleted or rewritten.
- No recovery path calls `removeItem()` or `localStorage.clear()`.

## User-visible failure handling

The persistence facade dispatches `rush-save-status` and renders an accessible,
bilingual recovery notice outside the React application tree. The notice uses
`role="alertdialog"` with assertive live-region behavior for failures, exposes
explicit restore/retry/fresh-start actions, and uses only `textContent` for
copy. Dismissing a notice does not change storage.

## Preservation

| Domain | Change |
|---|---:|
| Save schema version | `0` |
| Migration edges | `0` |
| Timed-record code | `0` |
| Ghost code/schema | `0` |
| Tracks | `0` |
| Physics | `0` |
| Rendering | `0` |
| Assets | `0` |
| Direct dependencies | `0` |
| Public-distribution authority | `0` |

## Deferred boundary

RSH-023 — timed-record integrity and write ordering — remains deferred,
unauthorized and uncreated. RSH-022 does not modify `src/game/records.ts`,
record hashes, asynchronous record persistence or ghost storage.
