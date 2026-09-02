# RSH-023 — Timed-Record Integrity, Write Ordering, Deduplication and Storage Limits

**Unit:** RSH-023
**Implementation base:** `33b280767913ef93b1dd8b73ab0e41a73636db38`
**Base tree:** `913b40f399144c18ceb20c61a35353bc38a99d35`
**Branch:** `agent/rsh-023-timed-records`
**State effective on:** validated merge of the RSH-023 pull request

## Acceptance boundary

RSH-023 hardens timed-record persistence around the accepted RSH-021 schema and
RSH-022 recovery authorities. It does not change save schema version `3`, the
deterministic `0→1→2→3` migration graph, ghost storage, tracks, physics,
rendering, assets, dependencies or public-distribution policy.

## Integrity contract

1. The records key remains `rush.records.v3`.
2. Every accepted record carries a 64-character lowercase SHA-256 hex digest of
   `trackId|carId|t|physicsVersion`.
3. The digest is computed by a portable synchronous SHA-256 so the read path
   can verify hashes without `crypto.subtle`.
4. Load sanitizes stored bytes: malformed JSON, non-arrays, structurally
   invalid rows, stale `physicsVersion` values and hash mismatches are dropped.
5. Duplicate identities (`trackId|carId|physicsVersion|t|hash`) collapse to one
   retained row.
6. Storage is bounded: 24 live records per track/car/physics-version group and
   200 records overall. Overflow drops the slowest remaining times after sort.

## Write-ordering contract

1. `persistTimedRecord` serialises every write through one in-module promise
   chain. Concurrent callers cannot interleave read-modify-write.
2. A write verifies the candidate, reloads and sanitizes current storage, then
   replaces the whole key with canonical JSON.
3. Canonical JSON sorts object keys and orders rows by time, track, car and
   hash so equivalent sets are byte-identical.
4. After `setItem` the stored bytes must match the canonical payload; mismatch
   is a write failure and leaves the previous live set in memory.
5. Duplicate candidates return `duplicate` without rewriting storage.
6. Invalid candidates return `rejected` without rewriting storage.
7. Quota and verification failures return `write-failed` and preserve the last
   successfully loaded live set.
8. `recordBest` hashes the candidate synchronously before enqueueing persist.

## Preservation

| Domain | Change |
|---|---:|
| Save schema version | `0` |
| Migration edges | `0` |
| Recovery/backup code | `0` |
| Ghost code/schema | `0` |
| Tracks | `0` |
| Physics | `0` |
| Rendering | `0` |
| Assets | `0` |
| Direct dependencies | `0` |
| Public-distribution authority | `0` |

## Deferred boundary

RSH-024 — production security and build/migration separation — remains
deferred, unauthorized and uncreated. RSH-023 does not add secret-scan
expansion, production QA-hook GitHub enforcement, or a `src/game/security/`
tree.
