type TrackId = string;
type CarId = "sabra" | "carmel" | "kfir" | "negev" | "yam";
type HandlingMode = "arcade" | "simcade";
type Quality = "low" | "mid" | "high";
type AssistFlags = { abs: boolean; tcs: boolean; esc: boolean };
type Tune = { engine: number; tires: number; nitro: number; paint: number; livery: number };
type Lang = "he" | "en" | "ar";

export const SAVE_SCHEMA_VERSION = 3 as const;
export const SAVE_KEY = "rush-v1";
export const LEGACY_SAVE_KEY = "tlv-rush-v1";
export const GHOST_KEY = "rush-ghosts-v1";

type SupportedSaveVersion = 0 | 1 | 2 | 3;
type SaveSource = "none" | "current" | "legacy";
export type SaveStorage = { getItem(key: string): string | null; setItem(key: string, value: string): void };
export type SaveMigrationCode =
  | "read-failed"
  | "invalid-json"
  | "invalid-root"
  | "invalid-version"
  | "future-version";

export type SaveData = {
  version: typeof SAVE_SCHEMA_VERSION;
  best: Partial<Record<TrackId, number>>;
  muted?: boolean;
  night?: boolean;
  quality?: Quality;
  fov?: number;
  career: { stars: Partial<Record<string, number>> };
  cash: number;
  tunes: Partial<Record<CarId, Tune>>;
  damage: Partial<Record<CarId, number>>;
  dailyDone?: string;
  weeklyDone?: string;
  handling?: HandlingMode;
  assists?: AssistFlags;
  lang?: Lang;
};

export type SaveMigrationResult = {
  data: SaveData;
  sourceVersion: SupportedSaveVersion;
  appliedMigrations: readonly string[];
  issues: readonly string[];
};

export type SaveLoadStatus = {
  state: "empty" | "loaded" | "migrated" | "repaired" | "write-failed" | "rejected" | "saved";
  source: SaveSource;
  sourceVersion: number | null;
  targetVersion: typeof SAVE_SCHEMA_VERSION;
  appliedMigrations: readonly string[];
  issues: readonly string[];
  persisted: boolean;
  verified: boolean;
  errorCode?: SaveMigrationCode | "write-failed";
  error?: string;
};

export class SaveMigrationError extends Error {
  readonly code: SaveMigrationCode;
  readonly sourceVersion: number | null;

  constructor(code: SaveMigrationCode, message: string, sourceVersion: number | null = null) {
    super(message);
    this.name = "SaveMigrationError";
    this.code = code;
    this.sourceVersion = sourceVersion;
  }
}

const CAR_IDS = ["sabra", "carmel", "kfir", "negev", "yam"] as const;
const SAFE_KEY = /^(?!__proto__$|prototype$|constructor$).+/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function cloneJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cloneJson);
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, cloneJson(value[key])]),
    );
  }
  return value;
}

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, stable(value[key])]),
    );
  }
  return value;
}

function issue(issues: string[], path: string, action: string) {
  issues.push(path + ":" + action);
}

function optionalBoolean(source: Record<string, unknown>, key: string, issues: string[]) {
  const value = source[key];
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  issue(issues, key, "dropped");
  return undefined;
}

function optionalString(source: Record<string, unknown>, key: string, issues: string[]) {
  const value = source[key];
  if (value === undefined) return undefined;
  if (typeof value === "string") return value;
  issue(issues, key, "dropped");
  return undefined;
}

function boundedNumber(
  value: unknown,
  fallback: number,
  minimum: number,
  maximum: number,
  path: string,
  issues: string[],
  integer = false,
) {
  if (value === undefined) return fallback;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    issue(issues, path, "defaulted");
    return fallback;
  }
  const rounded = integer ? Math.round(value) : value;
  const bounded = Math.max(minimum, Math.min(maximum, rounded));
  if (!Object.is(bounded, value)) issue(issues, path, "normalized");
  return bounded;
}

function sanitizeNumberMap(
  value: unknown,
  path: string,
  minimum: number,
  maximum: number,
  issues: string[],
  integer = false,
) {
  const result: Record<string, number> = {};
  if (value === undefined) return result;
  if (!isRecord(value)) {
    issue(issues, path, "reset");
    return result;
  }
  for (const key of Object.keys(value).sort()) {
    if (!SAFE_KEY.test(key)) {
      issue(issues, path + "." + key, "dropped");
      continue;
    }
    const current = value[key];
    if (typeof current !== "number" || !Number.isFinite(current)) {
      issue(issues, path + "." + key, "dropped");
      continue;
    }
    const rounded = integer ? Math.round(current) : current;
    const bounded = Math.max(minimum, Math.min(maximum, rounded));
    if (!Object.is(bounded, current)) issue(issues, path + "." + key, "normalized");
    result[key] = bounded;
  }
  return result;
}

function sanitizeTune(value: unknown, path: string, issues: string[]): Tune {
  const source = isRecord(value) ? value : {};
  if (value !== undefined && !isRecord(value)) issue(issues, path, "reset");
  return {
    engine: boundedNumber(source.engine, 0, 0, 3, path + ".engine", issues, true),
    tires: boundedNumber(source.tires, 0, 0, 3, path + ".tires", issues, true),
    nitro: boundedNumber(source.nitro, 0, 0, 3, path + ".nitro", issues, true),
    paint: boundedNumber(source.paint, 0, 0, 4, path + ".paint", issues, true),
    livery: boundedNumber(source.livery, 0, 0, 6, path + ".livery", issues, true),
  };
}

function normalizeV3(value: Record<string, unknown>, issues: string[]): SaveData {
  const career = isRecord(value.career) ? value.career : {};
  if (value.career !== undefined && !isRecord(value.career)) issue(issues, "career", "reset");
  const best = sanitizeNumberMap(value.best, "best", 8, 2700, issues) as Partial<Record<TrackId, number>>;
  const stars = sanitizeNumberMap(career.stars, "career.stars", 0, 3, issues, true);
  const tunes: Partial<Record<CarId, Tune>> = {};
  const rawTunes = isRecord(value.tunes) ? value.tunes : {};
  if (value.tunes !== undefined && !isRecord(value.tunes)) issue(issues, "tunes", "reset");
  for (const id of CAR_IDS) {
    if (rawTunes[id] !== undefined) tunes[id] = sanitizeTune(rawTunes[id], "tunes." + id, issues);
  }
  for (const id of Object.keys(rawTunes).sort()) {
    if (!(CAR_IDS as readonly string[]).includes(id)) issue(issues, "tunes." + id, "dropped");
  }
  const rawDamage = isRecord(value.damage) ? value.damage : {};
  if (value.damage !== undefined && !isRecord(value.damage)) issue(issues, "damage", "reset");
  const damage: Partial<Record<CarId, number>> = {};
  for (const id of CAR_IDS) {
    const current = rawDamage[id];
    if (current === undefined) continue;
    if (typeof current !== "number" || !Number.isFinite(current)) {
      issue(issues, "damage." + id, "dropped");
      continue;
    }
    const bounded = Math.max(0, Math.min(1, current));
    if (!Object.is(bounded, current)) issue(issues, "damage." + id, "normalized");
    damage[id] = bounded;
  }
  for (const id of Object.keys(rawDamage).sort()) {
    if (!(CAR_IDS as readonly string[]).includes(id)) issue(issues, "damage." + id, "dropped");
  }

  let quality: Quality | undefined;
  if (value.quality === "low" || value.quality === "mid" || value.quality === "high") quality = value.quality;
  else if (value.quality !== undefined) issue(issues, "quality", "dropped");

  let lang: Lang | undefined;
  if (value.lang === "ar" || value.lang === "en" || value.lang === "he") lang = value.lang;
  else if (value.lang !== undefined) issue(issues, "lang", "dropped");

  let handling: HandlingMode = "arcade";
  if (value.handling === "simcade" || value.handling === "arcade") handling = value.handling;
  else if (value.handling !== undefined) issue(issues, "handling", "defaulted");

  const rawAssists = isRecord(value.assists) ? value.assists : {};
  if (value.assists !== undefined && !isRecord(value.assists)) issue(issues, "assists", "reset");
  const assists: AssistFlags = {
    abs: rawAssists.abs === undefined ? true : typeof rawAssists.abs === "boolean" ? rawAssists.abs : true,
    tcs: rawAssists.tcs === undefined ? true : typeof rawAssists.tcs === "boolean" ? rawAssists.tcs : true,
    esc: rawAssists.esc === undefined ? true : typeof rawAssists.esc === "boolean" ? rawAssists.esc : true,
  };
  for (const key of ["abs", "tcs", "esc"] as const) {
    if (rawAssists[key] !== undefined && typeof rawAssists[key] !== "boolean") issue(issues, "assists." + key, "defaulted");
  }

  return {
    version: SAVE_SCHEMA_VERSION,
    best,
    muted: optionalBoolean(value, "muted", issues),
    night: optionalBoolean(value, "night", issues),
    quality,
    fov: value.fov === undefined ? undefined : boundedNumber(value.fov, 0, 0, 12, "fov", issues),
    career: { stars },
    cash: boundedNumber(value.cash, 500, 0, Number.MAX_SAFE_INTEGER, "cash", issues, true),
    tunes,
    damage,
    dailyDone: optionalString(value, "dailyDone", issues),
    weeklyDone: optionalString(value, "weeklyDone", issues),
    handling,
    assists,
    lang,
  };
}

function sourceVersionOf(source: Record<string, unknown>): SupportedSaveVersion {
  if (source.version === undefined || source.version === 0) return 0;
  if (typeof source.version !== "number" || !Number.isInteger(source.version) || source.version < 0) {
    throw new SaveMigrationError("invalid-version", "Save version must be a non-negative integer.");
  }
  if (source.version > SAVE_SCHEMA_VERSION) {
    throw new SaveMigrationError("future-version", "Save version is newer than this build.", source.version);
  }
  if (source.version !== 1 && source.version !== 2 && source.version !== 3) {
    throw new SaveMigrationError("invalid-version", "Unsupported save version.", source.version);
  }
  return source.version;
}

function migrate0To1(source: Record<string, unknown>) {
  return { ...source, version: 1 };
}

function migrate1To2(source: Record<string, unknown>) {
  return {
    ...source,
    version: 2,
    career: source.career ?? { stars: {} },
    cash: source.cash ?? 500,
    tunes: source.tunes ?? {},
    damage: source.damage ?? {},
  };
}

function migrate2To3(source: Record<string, unknown>) {
  return {
    ...source,
    version: 3,
    handling: source.handling ?? "arcade",
    assists: source.assists ?? { abs: true, tcs: true, esc: true },
  };
}

export const SAVE_MIGRATIONS = Object.freeze([
  Object.freeze({ id: "v0-to-v1", from: 0, to: 1, migrate: migrate0To1 }),
  Object.freeze({ id: "v1-to-v2", from: 1, to: 2, migrate: migrate1To2 }),
  Object.freeze({ id: "v2-to-v3", from: 2, to: 3, migrate: migrate2To3 }),
] as const);

export function emptySave(): SaveData {
  return {
    version: SAVE_SCHEMA_VERSION,
    best: {},
    career: { stars: {} },
    cash: 500,
    tunes: {},
    damage: {},
    handling: "arcade",
    assists: { abs: true, tcs: true, esc: true },
  };
}

export function migrateSave(input: unknown): SaveMigrationResult {
  if (!isRecord(input)) throw new SaveMigrationError("invalid-root", "Save root must be an object.");
  const sourceVersion = sourceVersionOf(input);
  let current = cloneJson(input) as Record<string, unknown>;
  let version: SupportedSaveVersion = sourceVersion;
  const appliedMigrations: string[] = [];
  while (version < SAVE_SCHEMA_VERSION) {
    const migration = SAVE_MIGRATIONS.find((item) => item.from === version);
    if (!migration) throw new SaveMigrationError("invalid-version", "No deterministic migration path.", version);
    current = migration.migrate(current);
    appliedMigrations.push(migration.id);
    version = migration.to;
  }
  const issues: string[] = [];
  const data = normalizeV3(current, issues);
  return {
    data,
    sourceVersion,
    appliedMigrations: Object.freeze([...appliedMigrations]),
    issues: Object.freeze([...issues]),
  };
}

export function canonicalSaveString(data: SaveData) {
  return JSON.stringify(stable(data));
}

export function createSaveStatus(
  state: SaveLoadStatus["state"],
  source: SaveSource,
  sourceVersion: number | null,
  appliedMigrations: readonly string[] = [],
  issues: readonly string[] = [],
  persisted = false,
  verified = false,
  extra: Pick<SaveLoadStatus, "errorCode" | "error"> = {},
): SaveLoadStatus {
  return Object.freeze({
    state,
    source,
    sourceVersion,
    targetVersion: SAVE_SCHEMA_VERSION,
    appliedMigrations: Object.freeze([...appliedMigrations]),
    issues: Object.freeze([...issues]),
    persisted,
    verified,
    ...extra,
  });
}

export function loadSaveFromStorage(storage: SaveStorage): { data: SaveData; status: SaveLoadStatus } {
  let currentRaw: string | null;
  let legacyRaw: string | null = null;
  try {
    currentRaw = storage.getItem(SAVE_KEY);
    if (currentRaw === null) legacyRaw = storage.getItem(LEGACY_SAVE_KEY);
  } catch (error) {
    return {
      data: emptySave(),
      status: createSaveStatus("rejected", "none", null, [], [], false, false, {
        errorCode: "read-failed",
        error: String(error instanceof Error ? error.message : error),
      }),
    };
  }
  const source: SaveSource = currentRaw !== null ? "current" : legacyRaw !== null ? "legacy" : "none";
  const raw = currentRaw ?? legacyRaw;
  if (raw === null) return { data: emptySave(), status: createSaveStatus("empty", "none", null) };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    return {
      data: emptySave(),
      status: createSaveStatus("rejected", source, null, [], [], false, false, {
        errorCode: "invalid-json",
        error: String(error instanceof Error ? error.message : error),
      }),
    };
  }

  let migrated: SaveMigrationResult;
  try {
    migrated = migrateSave(parsed);
  } catch (error) {
    const migrationError = error instanceof SaveMigrationError ? error : new SaveMigrationError("invalid-root", String(error));
    return {
      data: emptySave(),
      status: createSaveStatus("rejected", source, migrationError.sourceVersion, [], [], false, false, {
        errorCode: migrationError.code,
        error: migrationError.message,
      }),
    };
  }

  const canonical = canonicalSaveString(migrated.data);
  const shouldPersist = source === "legacy" || raw !== canonical || migrated.appliedMigrations.length > 0 || migrated.issues.length > 0;
  let persisted = !shouldPersist;
  let verified = !shouldPersist;
  if (shouldPersist) {
    try {
      storage.setItem(SAVE_KEY, canonical);
      persisted = true;
      verified = storage.getItem(SAVE_KEY) === canonical;
      if (!verified) throw new Error("save verification mismatch");
    } catch (error) {
      return {
        data: migrated.data,
        status: createSaveStatus("write-failed", source, migrated.sourceVersion, migrated.appliedMigrations, migrated.issues, persisted, false, {
          errorCode: "write-failed",
          error: String(error instanceof Error ? error.message : error),
        }),
      };
    }
  }

  const state = migrated.issues.length > 0
    ? "repaired"
    : migrated.appliedMigrations.length > 0 || source === "legacy"
      ? "migrated"
      : "loaded";
  return {
    data: migrated.data,
    status: createSaveStatus(state, source, migrated.sourceVersion, migrated.appliedMigrations, migrated.issues, persisted, verified),
  };
}
