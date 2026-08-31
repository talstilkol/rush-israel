import {
  LEGACY_SAVE_KEY,
  SAVE_KEY,
  SAVE_SCHEMA_VERSION,
  SaveMigrationError,
  canonicalSaveString,
  createSaveStatus,
  emptySave,
  loadSaveFromStorage,
  migrateSave,
  type SaveData,
  type SaveLoadStatus,
  type SaveMigrationResult,
  type SaveStorage,
} from "./save-schema";

export const SAVE_BACKUP_KEY = "rush-v1-backup";
export const SAVE_QUARANTINE_KEY = "rush-v1-rejected";
export const SAVE_QUARANTINE_PREVIOUS_KEY = "rush-v1-rejected-previous";
export const SAVE_BACKUP_QUARANTINE_KEY = "rush-v1-backup-rejected";

export type SaveRecoveryState =
  | SaveLoadStatus["state"]
  | "recovery-available"
  | "recovered"
  | "fresh-started";

export type SaveRecoveryAction = "none" | "restore-backup" | "start-fresh" | "retry";
export type SaveRecoveryNotice = "none" | "warning" | "error" | "success";
export type SaveRecoveryErrorCode =
  | "backup-read-failed"
  | "backup-write-failed"
  | "backup-invalid"
  | "backup-quarantine-failed"
  | "quarantine-write-failed"
  | "quarantine-full"
  | "recovery-write-failed"
  | "current-still-valid"
  | "backup-available";

export type SavePersistenceStatus = Omit<SaveLoadStatus, "state"> & {
  state: SaveRecoveryState;
  backupAvailable: boolean;
  quarantined: boolean;
  recovered: boolean;
  recoveryAction: SaveRecoveryAction;
  notice: SaveRecoveryNotice;
  recoveryErrorCode?: SaveRecoveryErrorCode;
};

export type SavePersistenceResult = {
  data: SaveData;
  status: SavePersistenceStatus;
};

export type SaveBackupInspection = {
  state: "missing" | "valid" | "invalid" | "read-failed";
  raw: string | null;
  data: SaveData | null;
  canonical: string | null;
  sourceVersion: number | null;
  error?: string;
};

type ParsedSave = {
  data: SaveData;
  canonical: string;
  migration: SaveMigrationResult;
};

type ReadResult = { ok: true; raw: string | null } | { ok: false; error: string };
type WriteResult = { ok: true } | { ok: false; error: string };
type QuarantineResult = { ok: true; slot: string | null } | { ok: false; error: string; code: SaveRecoveryErrorCode };

function errorText(error: unknown) {
  return String(error instanceof Error ? error.message : error);
}

export function createSavePersistenceStatus(
  base: SaveLoadStatus,
  extras: Partial<
    Pick<
      SavePersistenceStatus,
      "state" | "backupAvailable" | "quarantined" | "recovered" | "recoveryAction" | "notice" | "recoveryErrorCode"
    >
  > = {},
): SavePersistenceStatus {
  return Object.freeze({
    ...base,
    backupAvailable: false,
    quarantined: false,
    recovered: false,
    recoveryAction: "none",
    notice: base.state === "rejected" || base.state === "write-failed" ? "error" : "none",
    ...extras,
  });
}

function readKey(storage: SaveStorage, key: string): ReadResult {
  try {
    return { ok: true, raw: storage.getItem(key) };
  } catch (error) {
    return { ok: false, error: errorText(error) };
  }
}

function writeVerified(storage: SaveStorage, key: string, raw: string): WriteResult {
  try {
    storage.setItem(key, raw);
    if (storage.getItem(key) !== raw) throw new Error(`${key} verification mismatch`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: errorText(error) };
  }
}

function parseRaw(raw: string): ParsedSave | { error: SaveMigrationError } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    return { error: new SaveMigrationError("invalid-json", errorText(error)) };
  }
  try {
    const migration = migrateSave(parsed);
    return {
      data: migration.data,
      canonical: canonicalSaveString(migration.data),
      migration,
    };
  } catch (error) {
    return {
      error: error instanceof SaveMigrationError
        ? error
        : new SaveMigrationError("invalid-root", errorText(error)),
    };
  }
}

export function inspectSaveBackup(storage: SaveStorage): SaveBackupInspection {
  const read = readKey(storage, SAVE_BACKUP_KEY);
  if (!read.ok) {
    return Object.freeze({
      state: "read-failed",
      raw: null,
      data: null,
      canonical: null,
      sourceVersion: null,
      error: read.error,
    });
  }
  if (read.raw === null) {
    return Object.freeze({
      state: "missing",
      raw: null,
      data: null,
      canonical: null,
      sourceVersion: null,
    });
  }
  const parsed = parseRaw(read.raw);
  if ("error" in parsed) {
    return Object.freeze({
      state: "invalid",
      raw: read.raw,
      data: null,
      canonical: null,
      sourceVersion: parsed.error.sourceVersion,
      error: parsed.error.message,
    });
  }
  return Object.freeze({
    state: "valid",
    raw: read.raw,
    data: parsed.data,
    canonical: parsed.canonical,
    sourceVersion: parsed.migration.sourceVersion,
  });
}

function quarantineBackup(storage: SaveStorage, raw: string): QuarantineResult {
  const existing = readKey(storage, SAVE_BACKUP_QUARANTINE_KEY);
  if (!existing.ok) return { ok: false, error: existing.error, code: "backup-quarantine-failed" };
  if (existing.raw !== null && existing.raw !== raw) {
    return { ok: false, error: "backup quarantine slot already contains different bytes", code: "quarantine-full" };
  }
  const write = writeVerified(storage, SAVE_BACKUP_QUARANTINE_KEY, raw);
  if (!write.ok) return { ok: false, error: write.error, code: "backup-quarantine-failed" };
  return { ok: true, slot: SAVE_BACKUP_QUARANTINE_KEY };
}

function quarantineCurrent(storage: SaveStorage, raw: string): QuarantineResult {
  for (const key of [SAVE_QUARANTINE_KEY, SAVE_QUARANTINE_PREVIOUS_KEY]) {
    const existing = readKey(storage, key);
    if (!existing.ok) return { ok: false, error: existing.error, code: "quarantine-write-failed" };
    if (existing.raw !== null && existing.raw !== raw) continue;
    const write = writeVerified(storage, key, raw);
    if (!write.ok) return { ok: false, error: write.error, code: "quarantine-write-failed" };
    return { ok: true, slot: key };
  }
  return { ok: false, error: "both rejected-save quarantine slots are occupied", code: "quarantine-full" };
}

function rotateBackup(storage: SaveStorage, raw: string, inspection: SaveBackupInspection): QuarantineResult {
  let quarantined = false;
  if (inspection.state === "read-failed") {
    return { ok: false, error: inspection.error ?? "backup read failed", code: "backup-read-failed" };
  }
  if (inspection.state === "invalid" && inspection.raw !== null) {
    const quarantine = quarantineBackup(storage, inspection.raw);
    if (!quarantine.ok) return quarantine;
    quarantined = true;
  }
  const write = writeVerified(storage, SAVE_BACKUP_KEY, raw);
  if (!write.ok) return { ok: false, error: write.error, code: "backup-write-failed" };
  return { ok: true, slot: quarantined ? SAVE_BACKUP_QUARANTINE_KEY : null };
}

function writeFailure(
  source: SaveLoadStatus["source"],
  data: SaveData,
  parsed: ParsedSave | null,
  error: string,
  recoveryErrorCode: SaveRecoveryErrorCode,
  backupAvailable: boolean,
  recoveryAction: SaveRecoveryAction = "retry",
): SavePersistenceResult {
  const migration = parsed?.migration;
  const base = createSaveStatus(
    "write-failed",
    source,
    migration?.sourceVersion ?? SAVE_SCHEMA_VERSION,
    migration?.appliedMigrations ?? [],
    migration?.issues ?? [],
    false,
    false,
    { errorCode: "write-failed", error },
  );
  return {
    data,
    status: createSavePersistenceStatus(base, {
      backupAvailable,
      recoveryAction,
      notice: "error",
      recoveryErrorCode,
    }),
  };
}

function recoveryAvailableResult(
  source: SaveLoadStatus["source"],
  backup: SaveBackupInspection,
): SavePersistenceResult {
  const base = createSaveStatus("empty", source, backup.sourceVersion);
  return {
    data: emptySave(),
    status: createSavePersistenceStatus(base, {
      state: "recovery-available",
      backupAvailable: true,
      recoveryAction: "restore-backup",
      notice: "warning",
    }),
  };
}

function rejectedResult(
  source: SaveLoadStatus["source"],
  error: SaveMigrationError,
  backup: SaveBackupInspection,
): SavePersistenceResult {
  const backupAvailable = backup.state === "valid";
  const backupUnknown = backup.state === "read-failed";
  const base = createSaveStatus("rejected", source, error.sourceVersion, [], [], false, false, {
    errorCode: error.code,
    error: error.message,
  });
  return {
    data: emptySave(),
    status: createSavePersistenceStatus(base, {
      backupAvailable,
      recoveryAction: backupUnknown ? "retry" : backupAvailable ? "restore-backup" : "start-fresh",
      notice: "error",
      recoveryErrorCode: backupUnknown ? "backup-read-failed" : backup.state === "invalid" ? "backup-invalid" : undefined,
    }),
  };
}

export function loadSaveWithRecovery(storage: SaveStorage): SavePersistenceResult {
  const currentRead = readKey(storage, SAVE_KEY);
  if (!currentRead.ok) {
    const base = createSaveStatus("rejected", "none", null, [], [], false, false, {
      errorCode: "read-failed",
      error: currentRead.error,
    });
    return {
      data: emptySave(),
      status: createSavePersistenceStatus(base, { recoveryAction: "retry", notice: "error" }),
    };
  }

  const legacyRead = currentRead.raw === null ? readKey(storage, LEGACY_SAVE_KEY) : { ok: true as const, raw: null };
  if (!legacyRead.ok) {
    const base = createSaveStatus("rejected", "none", null, [], [], false, false, {
      errorCode: "read-failed",
      error: legacyRead.error,
    });
    return {
      data: emptySave(),
      status: createSavePersistenceStatus(base, { recoveryAction: "retry", notice: "error" }),
    };
  }

  const backup = inspectSaveBackup(storage);
  const source: SaveLoadStatus["source"] = currentRead.raw !== null ? "current" : legacyRead.raw !== null ? "legacy" : "none";
  const activeRaw = currentRead.raw ?? legacyRead.raw;

  if (activeRaw === null) {
    if (backup.state === "valid") return recoveryAvailableResult("none", backup);
    if (backup.state === "read-failed") {
      return writeFailure("none", emptySave(), null, backup.error ?? "backup read failed", "backup-read-failed", false);
    }
    if (backup.state === "invalid") {
      const error = new SaveMigrationError("invalid-json", backup.error ?? "backup is invalid", backup.sourceVersion);
      return rejectedResult("none", error, backup);
    }
    const base = createSaveStatus("empty", "none", null);
    return { data: emptySave(), status: createSavePersistenceStatus(base) };
  }

  const parsed = parseRaw(activeRaw);
  if ("error" in parsed) return rejectedResult(source, parsed.error, backup);

  // A retained legacy key can be older than the verified backup. When the
  // current key is missing, preserve the backup and require an explicit restore
  // decision instead of silently replacing newer progress with legacy bytes.
  if (source === "legacy" && backup.state === "valid") {
    return recoveryAvailableResult("legacy", backup);
  }

  if (source === "current") {
    const needsCanonicalWrite = activeRaw !== parsed.canonical
      || parsed.migration.appliedMigrations.length > 0
      || parsed.migration.issues.length > 0;
    const needsBackupSeed = backup.state !== "valid";
    if (needsCanonicalWrite || needsBackupSeed) {
      const rotated = rotateBackup(storage, activeRaw, backup);
      if (!rotated.ok) {
        return writeFailure(source, parsed.data, parsed, rotated.error, rotated.code, backup.state === "valid");
      }
    }
    const loaded = loadSaveFromStorage(storage);
    const backupAvailable = true;
    if (loaded.status.state === "write-failed") {
      return {
        data: loaded.data,
        status: createSavePersistenceStatus(loaded.status, {
          backupAvailable,
          recoveryAction: "restore-backup",
          notice: "error",
          recoveryErrorCode: "recovery-write-failed",
        }),
      };
    }
    return {
      data: loaded.data,
      status: createSavePersistenceStatus(loaded.status, { backupAvailable }),
    };
  }

  // The legacy key is the active source until the RSH-021 loader creates the
  // current key. Preserve those exact source bytes in the verified backup
  // before allowing that canonical migration write.
  const rotated = rotateBackup(storage, activeRaw, backup);
  if (!rotated.ok) {
    return writeFailure("legacy", parsed.data, parsed, rotated.error, rotated.code, backup.state === "valid");
  }

  const loaded = loadSaveFromStorage(storage);
  if (loaded.status.state === "rejected") {
    return rejectedResult(
      "legacy",
      new SaveMigrationError(loaded.status.errorCode === "future-version" ? "future-version" : "invalid-root", loaded.status.error ?? "legacy save rejected", loaded.status.sourceVersion),
      backup,
    );
  }
  if (loaded.status.state === "write-failed") {
    return {
      data: loaded.data,
      status: createSavePersistenceStatus(loaded.status, {
        backupAvailable: true,
        recoveryAction: "retry",
        notice: "error",
        recoveryErrorCode: "recovery-write-failed",
      }),
    };
  }
  const currentAfterMigration = readKey(storage, SAVE_KEY);
  if (!currentAfterMigration.ok || currentAfterMigration.raw === null) {
    return writeFailure(
      "legacy",
      loaded.data,
      parsed,
      currentAfterMigration.ok ? "migrated current save is missing" : currentAfterMigration.error,
      "recovery-write-failed",
      true,
    );
  }
  return {
    data: loaded.data,
    status: createSavePersistenceStatus(loaded.status, { backupAvailable: true }),
  };
}

export function writeSaveWithBackup(storage: SaveStorage, data: SaveData): SavePersistenceResult {
  const nextRaw = canonicalSaveString(data);
  const currentRead = readKey(storage, SAVE_KEY);
  if (!currentRead.ok) {
    return writeFailure("current", data, null, currentRead.error, "recovery-write-failed", false);
  }
  const legacyRead = currentRead.raw === null ? readKey(storage, LEGACY_SAVE_KEY) : { ok: true as const, raw: null };
  if (!legacyRead.ok) {
    return writeFailure("legacy", data, null, legacyRead.error, "recovery-write-failed", false);
  }

  const source: SaveLoadStatus["source"] = currentRead.raw !== null ? "current" : legacyRead.raw !== null ? "legacy" : "none";
  const priorRaw = currentRead.raw ?? legacyRead.raw;
  let priorParsed: ParsedSave | null = null;
  if (priorRaw !== null) {
    const parsed = parseRaw(priorRaw);
    if ("error" in parsed) {
      const backup = inspectSaveBackup(storage);
      return rejectedResult(source, parsed.error, backup);
    }
    priorParsed = parsed;
  }

  const backup = inspectSaveBackup(storage);
  if (currentRead.raw === null && backup.state === "valid") {
    return recoveryAvailableResult(source, backup);
  }
  const backupRaw = priorRaw ?? nextRaw;
  if (priorRaw === null || priorRaw !== nextRaw || backup.state !== "valid") {
    const rotated = rotateBackup(storage, backupRaw, backup);
    if (!rotated.ok) {
      return writeFailure(source, data, priorParsed, rotated.error, rotated.code, backup.state === "valid");
    }
  }

  const write = writeVerified(storage, SAVE_KEY, nextRaw);
  if (!write.ok) {
    return writeFailure(source, data, priorParsed, write.error, "recovery-write-failed", true, "restore-backup");
  }
  const base = createSaveStatus("saved", "current", SAVE_SCHEMA_VERSION, [], [], true, true);
  return {
    data,
    status: createSavePersistenceStatus(base, { backupAvailable: true }),
  };
}

export function restoreSaveFromBackup(storage: SaveStorage): SavePersistenceResult {
  const backup = inspectSaveBackup(storage);
  if (backup.state !== "valid" || backup.data === null || backup.canonical === null) {
    const base = createSaveStatus("rejected", "none", backup.sourceVersion, [], [], false, false, {
      errorCode: backup.state === "read-failed" ? "read-failed" : "invalid-json",
      error: backup.error ?? "no valid save backup is available",
    });
    return {
      data: emptySave(),
      status: createSavePersistenceStatus(base, {
        backupAvailable: false,
        recoveryAction: backup.state === "read-failed" ? "retry" : "start-fresh",
        notice: "error",
        recoveryErrorCode: backup.state === "read-failed" ? "backup-read-failed" : "backup-invalid",
      }),
    };
  }

  const currentRead = readKey(storage, SAVE_KEY);
  if (!currentRead.ok) {
    return writeFailure("current", backup.data, null, currentRead.error, "recovery-write-failed", true, "restore-backup");
  }
  const legacyRead = currentRead.raw === null ? readKey(storage, LEGACY_SAVE_KEY) : { ok: true as const, raw: null };
  if (!legacyRead.ok) {
    return writeFailure("legacy", backup.data, null, legacyRead.error, "recovery-write-failed", true, "restore-backup");
  }

  const activeRaw = currentRead.raw ?? legacyRead.raw;
  const source: SaveLoadStatus["source"] = currentRead.raw !== null ? "current" : legacyRead.raw !== null ? "legacy" : "none";
  let quarantined = false;
  if (activeRaw !== null) {
    const parsed = parseRaw(activeRaw);
    if (!("error" in parsed) && source === "current") {
      const base = createSaveStatus("loaded", source, parsed.migration.sourceVersion, parsed.migration.appliedMigrations, parsed.migration.issues, true, true);
      return {
        data: parsed.data,
        status: createSavePersistenceStatus(base, {
          backupAvailable: true,
          recoveryAction: "none",
          notice: "warning",
          recoveryErrorCode: "current-still-valid",
        }),
      };
    }
    if (source === "current") {
      const quarantine = quarantineCurrent(storage, activeRaw);
      if (!quarantine.ok) {
        return writeFailure(source, backup.data, null, quarantine.error, quarantine.code, true, "restore-backup");
      }
      quarantined = true;
    }
  }

  const write = writeVerified(storage, SAVE_KEY, backup.canonical);
  if (!write.ok) {
    return writeFailure(source, backup.data, null, write.error, "recovery-write-failed", true, "restore-backup");
  }
  const base = createSaveStatus("loaded", "current", SAVE_SCHEMA_VERSION, [], [], true, true);
  return {
    data: backup.data,
    status: createSavePersistenceStatus(base, {
      state: "recovered",
      backupAvailable: true,
      quarantined,
      recovered: true,
      notice: "success",
    }),
  };
}

export function startFreshSaveAfterRejection(storage: SaveStorage): SavePersistenceResult {
  const backup = inspectSaveBackup(storage);
  if (backup.state === "valid") {
    const base = createSaveStatus("rejected", "none", backup.sourceVersion, [], [], false, false, {
      errorCode: "invalid-json",
      error: "a valid backup is available and must be restored instead of discarded",
    });
    return {
      data: emptySave(),
      status: createSavePersistenceStatus(base, {
        backupAvailable: true,
        recoveryAction: "restore-backup",
        notice: "warning",
        recoveryErrorCode: "backup-available",
      }),
    };
  }
  if (backup.state === "read-failed") {
    return writeFailure("none", emptySave(), null, backup.error ?? "backup read failed", "backup-read-failed", false);
  }
  let backupQuarantined = false;
  if (backup.state === "invalid" && backup.raw !== null) {
    const quarantine = quarantineBackup(storage, backup.raw);
    if (!quarantine.ok) {
      return writeFailure("none", emptySave(), null, quarantine.error, quarantine.code, false);
    }
    backupQuarantined = true;
  }

  const currentRead = readKey(storage, SAVE_KEY);
  if (!currentRead.ok) return writeFailure("current", emptySave(), null, currentRead.error, "recovery-write-failed", false);
  const legacyRead = currentRead.raw === null ? readKey(storage, LEGACY_SAVE_KEY) : { ok: true as const, raw: null };
  if (!legacyRead.ok) return writeFailure("legacy", emptySave(), null, legacyRead.error, "recovery-write-failed", false);

  const activeRaw = currentRead.raw ?? legacyRead.raw;
  const source: SaveLoadStatus["source"] = currentRead.raw !== null ? "current" : legacyRead.raw !== null ? "legacy" : "none";
  let currentQuarantined = false;
  if (activeRaw !== null) {
    const parsed = parseRaw(activeRaw);
    if (!("error" in parsed)) {
      const base = createSaveStatus("loaded", source, parsed.migration.sourceVersion, parsed.migration.appliedMigrations, parsed.migration.issues, true, true);
      return {
        data: parsed.data,
        status: createSavePersistenceStatus(base, {
          backupAvailable: false,
          notice: "warning",
          recoveryErrorCode: "current-still-valid",
        }),
      };
    }
    if (source === "current") {
      const quarantine = quarantineCurrent(storage, activeRaw);
      if (!quarantine.ok) return writeFailure(source, emptySave(), null, quarantine.error, quarantine.code, false);
      currentQuarantined = true;
    }
  }

  const data = emptySave();
  const raw = canonicalSaveString(data);
  const backupWrite = writeVerified(storage, SAVE_BACKUP_KEY, raw);
  if (!backupWrite.ok) return writeFailure(source, data, null, backupWrite.error, "backup-write-failed", false);
  const currentWrite = writeVerified(storage, SAVE_KEY, raw);
  if (!currentWrite.ok) return writeFailure(source, data, null, currentWrite.error, "recovery-write-failed", true, "restore-backup");

  const base = createSaveStatus("saved", "current", SAVE_SCHEMA_VERSION, [], [], true, true);
  return {
    data,
    status: createSavePersistenceStatus(base, {
      state: "fresh-started",
      backupAvailable: true,
      quarantined: currentQuarantined || backupQuarantined,
      recovered: true,
      notice: "success",
    }),
  };
}
