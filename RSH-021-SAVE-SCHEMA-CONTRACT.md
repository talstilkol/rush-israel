# RSH-021 — Save schema and deterministic migration contract

**Implementation base:** `7cff508a4cfa95c03ac34c5503912e70bed47b90`
**Base tree:** `c9a90bf17214b51a8247b814ac38b15c616b2252`
**Branch:** `agent/rsh-021-save-schema-migrations`
**State:** effective only on validated merge

## Contract

- The canonical save schema remains version `3`; RSH-021 does not invent a historical byte-level v1/v2 implementation.
- Parsed unversioned data uses compatibility envelope `0`, then follows exactly `0→1→2→3`.
- Version `1` follows `1→2→3`; version `2` follows `2→3`; version `3` is idempotent.
- Every migration is deterministic, ordered, non-mutating and followed by one canonical normalization pass.
- Canonical JSON recursively sorts object keys; equivalent inputs produce byte-identical current-save output.
- The current key `rush-v1` has strict precedence over `tlv-rush-v1`.
- Successful legacy migration writes and verifies the current key but never removes or rewrites legacy bytes.
- Invalid JSON, invalid roots, invalid versions and future versions fail closed and never overwrite source bytes.
- Read/write failures and normalization repairs are represented by structured status; RSH-022 owns backups, recovery UX and visible failure handling.
- Timed records, ghosts, tracks, physics, rendering, assets, dependencies and public-distribution policy do not change.
- RSH-022 is deferred, unauthorized and not pre-created.
