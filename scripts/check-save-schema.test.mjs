import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  SAVE_KEY,
  LEGACY_SAVE_KEY,
  SAVE_MIGRATIONS,
  SAVE_SCHEMA_VERSION,
  SaveMigrationError,
  canonicalSaveString,
  emptySave,
  loadSaveFromStorage,
  migrateSave,
} from "../src/game/save-schema.ts";
import { fromRoot } from "./project-root.mjs";
import { validateSaveSchema } from "./check-save-schema.mjs";

function memoryStorage(initial = {}, options = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem(key) {
      if (options.failRead) throw new Error("read blocked");
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      if (options.failWrite) throw new Error("quota blocked");
      values.set(key, options.mismatch ? value + "!" : value);
    },
  };
}

function json(value) { return JSON.parse(JSON.stringify(value)); }

test("RSH-021 exposes one deterministic 0→1→2→3 migration graph", () => {
  assert.equal(SAVE_SCHEMA_VERSION, 3);
  assert.deepEqual(SAVE_MIGRATIONS.map(({ id, from, to }) => ({ id, from, to })), [
    { id: "v0-to-v1", from: 0, to: 1 },
    { id: "v1-to-v2", from: 1, to: 2 },
    { id: "v2-to-v3", from: 2, to: 3 },
  ]);
});

test("current v3 data is canonical and migration-idempotent", () => {
  const original = emptySave();
  const first = migrateSave(original);
  const second = migrateSave(json(first.data));
  assert.equal(first.sourceVersion, 3);
  assert.deepEqual(first.appliedMigrations, []);
  assert.deepEqual(first.issues, []);
  assert.deepEqual(second, first);
  assert.equal(canonicalSaveString(first.data), canonicalSaveString(second.data));
});

test("unversioned data migrates through all three ordered steps without mutating input", () => {
  const input = { best: { ayalon: 42.5 }, muted: true };
  const snapshot = json(input);
  const result = migrateSave(input);
  assert.deepEqual(input, snapshot);
  assert.equal(result.sourceVersion, 0);
  assert.deepEqual(result.appliedMigrations, ["v0-to-v1", "v1-to-v2", "v2-to-v3"]);
  assert.equal(result.data.version, 3);
  assert.equal(result.data.best.ayalon, 42.5);
  assert.equal(result.data.muted, true);
  assert.equal(result.data.cash, 500);
});

test("v1 and v2 start at their exact deterministic migration edges", () => {
  assert.deepEqual(migrateSave({ version: 1, best: {} }).appliedMigrations, ["v1-to-v2", "v2-to-v3"]);
  assert.deepEqual(migrateSave({ version: 2, best: {}, cash: 900 }).appliedMigrations, ["v2-to-v3"]);
});

test("canonical serialization sorts nested keys deterministically", () => {
  const a = migrateSave({ version: 3, best: { rothschild: 31, ayalon: 40 }, career: { stars: { z: 1, a: 2 } } }).data;
  const b = migrateSave({ career: { stars: { a: 2, z: 1 } }, best: { ayalon: 40, rothschild: 31 }, version: 3 }).data;
  assert.equal(canonicalSaveString(a), canonicalSaveString(b));
  assert.equal(canonicalSaveString(a), canonicalSaveString(JSON.parse(canonicalSaveString(a))));
});

test("invalid roots, versions and future saves fail closed with typed errors", () => {
  for (const [value, code] of [
    [[], "invalid-root"],
    [{ version: "3" }, "invalid-version"],
    [{ version: -1 }, "invalid-version"],
    [{ version: 4 }, "future-version"],
  ]) {
    assert.throws(() => migrateSave(value), (error) => error instanceof SaveMigrationError && error.code === code);
  }
});

test("malformed recognized fields are repaired in stable field order", () => {
  const result = migrateSave({
    version: 3,
    best: { ayalon: 2, bad: "x" },
    cash: -4.8,
    fov: 99,
    career: { stars: { b: 9, a: "x" } },
    tunes: { sabra: { engine: 8, tires: 1.2, nitro: -1, paint: 9, livery: 10 }, alien: {} },
    damage: { sabra: 2, alien: 0.5 },
    handling: "realistic",
    assists: { abs: "yes", tcs: false },
    lang: "fr",
  });
  assert.equal(result.data.best.ayalon, 8);
  assert.equal(result.data.best.bad, undefined);
  assert.equal(result.data.cash, 0);
  assert.equal(result.data.fov, 12);
  assert.equal(result.data.career.stars.b, 3);
  assert.equal(result.data.tunes.sabra?.engine, 3);
  assert.equal(result.data.damage.sabra, 1);
  assert.equal(result.data.handling, "arcade");
  assert.equal(result.data.assists?.tcs, false);
  assert.ok(result.issues.length >= 10);
  assert.deepEqual([...result.issues], [...result.issues].sort((a, b) => {
    const order = ["best", "career", "tunes", "damage", "quality", "lang", "handling", "assists", "fov", "cash"];
    const ai = order.findIndex((prefix) => a.startsWith(prefix));
    const bi = order.findIndex((prefix) => b.startsWith(prefix));
    return ai === bi ? 0 : ai - bi;
  }));
});

test("legacy storage migrates to the current key and leaves the legacy bytes untouched", () => {
  const legacy = JSON.stringify({ version: 1, best: { ayalon: 45 } });
  const storage = memoryStorage({ [LEGACY_SAVE_KEY]: legacy });
  const result = loadSaveFromStorage(storage);
  assert.equal(result.status.state, "migrated");
  assert.equal(result.status.source, "legacy");
  assert.equal(result.status.verified, true);
  assert.equal(storage.values.get(LEGACY_SAVE_KEY), legacy);
  assert.equal(storage.values.get(SAVE_KEY), canonicalSaveString(result.data));
});

test("the current key has strict precedence over legacy data", () => {
  const storage = memoryStorage({
    [SAVE_KEY]: JSON.stringify({ version: 3, cash: 100, best: {} }),
    [LEGACY_SAVE_KEY]: JSON.stringify({ version: 1, cash: 9999, best: {} }),
  });
  const result = loadSaveFromStorage(storage);
  assert.equal(result.status.source, "current");
  assert.equal(result.data.cash, 100);
});

test("corrupt or future source bytes are explicit and are never overwritten", () => {
  for (const raw of ["{bad", JSON.stringify({ version: 99, cash: 1 })]) {
    const storage = memoryStorage({ [SAVE_KEY]: raw });
    const result = loadSaveFromStorage(storage);
    assert.equal(result.status.state, "rejected");
    assert.equal(result.status.persisted, false);
    assert.equal(storage.values.get(SAVE_KEY), raw);
    assert.deepEqual(result.data, emptySave());
  }
});

test("read and write failures return explicit structured status", () => {
  const read = loadSaveFromStorage(memoryStorage({}, { failRead: true }));
  assert.equal(read.status.errorCode, "read-failed");
  const raw = JSON.stringify({ version: 1, best: { ayalon: 44 } });
  const write = loadSaveFromStorage(memoryStorage({ [SAVE_KEY]: raw }, { failWrite: true }));
  assert.equal(write.status.state, "write-failed");
  assert.equal(write.status.errorCode, "write-failed");
  assert.equal(write.data.best.ayalon, 44);
});

test("the RSH-021 schema remains exact beneath the accepted RSH-022 recovery overlay", () => {
  const result = validateSaveSchema();
  assert.deepEqual(result.errors, []);
  assert.equal(result.currentVersion, 3);
  assert.equal(result.migrationCount, 3);
  const manifest = JSON.parse(readFileSync(fromRoot("SAVE-SCHEMA-MANIFEST.json"), "utf8"));
  assert.equal(manifest.identities.schema_source_sha256, "59fad6a40fcfb372222e211394e02c1fe1d7993fc0695a58e8a3289e832a7358");
  assert.equal(manifest.identities.save_facade_source_sha256, "700d264ef071be635d76d8b02da5eda3b7c966bdf3a4756ac1bdeb7e83f56b24");
  assert.equal(manifest.recovery.backups_created, true);
  assert.equal(manifest.recovery.backup_restore, true);
  assert.equal(manifest.recovery.user_visible_failure_ui, true);
  assert.equal(manifest.deferred_boundary.rsh_022_started, true);
  assert.equal(manifest.deferred_boundary.rsh_022_authorized, true);
  assert.equal(manifest.deferred_boundary.rsh_022_state, "accepted_on_merge");
  assert.equal(manifest.deferred_boundary.rsh_023_started, false);
  assert.equal(manifest.deferred_boundary.rsh_023_authorized, false);
});

test("the save facade preserves rejected bytes and delegates explicit recovery", () => {
  const source = readFileSync(fromRoot("src", "game", "save.ts"), "utf8");
  assert.ok(source.includes(`function browserStorage(): SaveStorage | null {
  return typeof localStorage === "undefined" ? null : localStorage;
}`));
  assert.ok(source.includes("function rejectedStorageStatus(error: unknown)"));
  assert.ok(source.includes('errorCode: "read-failed"'));
  assert.ok(source.includes("const result = loadSaveWithRecovery(storage);"));
  assert.ok(source.includes('if (lastSaveStatus.state === "rejected" || lastSaveStatus.state === "recovery-available")'));
  assert.ok(source.includes("retryPendingSaveWithBackup(storage, data)"));
  assert.ok(source.includes("const retryFromPending = pendingRetry || pendingSaveData !== null"));
  assert.ok(source.includes('if (result.status.state === "write-failed" && result.status.recoveryAction === "retry")'));
  assert.ok(source.includes("write(cloneSaveData(pending), true)"));
  assert.ok(source.includes("export function restoreSaveBackup()"));
  assert.ok(source.includes("export function startFreshSaveAfterFailure()"));
  assert.ok(source.includes("export function retrySavePersistence()"));
  const manifest = JSON.parse(readFileSync(fromRoot("SAVE-SCHEMA-MANIFEST.json"), "utf8"));
  assert.equal(manifest.failure_policy.read_failure, "reject_without_overwrite_with_structured_status");
  assert.equal(manifest.rsh_022_overlay.automatic_restore, false);
  assert.equal(manifest.rsh_022_overlay.explicit_restore, true);
});
