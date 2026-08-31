import type { AssistFlags, CarId, HandlingMode, Quality, TrackId, Tune } from "./types";
import type { Lang } from "./i18n";
import { CAR_UNLOCK } from "./career";
import { emptyTune, type GhostFrame } from "./garage";
import { PHYSICS_VERSION } from "./physics";
import { isLiveRecord, recordPayload, sha256hex, writeRecords, REC_KEY, type TimedRecord } from "./records";
import {
  GHOST_KEY,
  SAVE_KEY,
  SAVE_SCHEMA_VERSION,
  canonicalSaveString,
  createSaveStatus,
  emptySave,
  loadSaveFromStorage,
  type SaveData,
  type SaveLoadStatus,
  type SaveStorage,
} from "./save-schema";

export {
  GHOST_KEY,
  LEGACY_SAVE_KEY,
  SAVE_KEY,
  SAVE_MIGRATIONS,
  SAVE_SCHEMA_VERSION,
  SaveMigrationError,
  canonicalSaveString,
  emptySave,
  loadSaveFromStorage,
  migrateSave,
  type SaveData,
  type SaveLoadStatus,
  type SaveMigrationCode,
  type SaveMigrationResult,
  type SaveStorage,
} from "./save-schema";

const KEY = SAVE_KEY;

let lastSaveStatus: SaveLoadStatus = createSaveStatus("empty", "none", null);

export function getSaveStatus() {
  return lastSaveStatus;
}

function browserStorage(): SaveStorage | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

function load(): SaveData {
  const storage = browserStorage();
  if (!storage) {
    lastSaveStatus = createSaveStatus("empty", "none", null);
    return emptySave();
  }
  const result = loadSaveFromStorage(storage);
  lastSaveStatus = result.status;
  return result.data;
}

function write(data: SaveData) {
  // A rejected read owns the source bytes until RSH-022 provides an explicit
  // recovery decision. Automatic flushes and setters must not destroy them.
  if (lastSaveStatus.state === "rejected") return false;
  const storage = browserStorage();
  if (!storage) return false;
  const raw = canonicalSaveString(data);
  try {
    storage.setItem(KEY, raw);
    const verified = storage.getItem(KEY) === raw;
    if (!verified) throw new Error("save verification mismatch");
    lastSaveStatus = createSaveStatus("saved", "current", SAVE_SCHEMA_VERSION, [], [], true, true);
    return true;
  } catch (error) {
    lastSaveStatus = createSaveStatus("write-failed", "current", SAVE_SCHEMA_VERSION, [], [], false, false, {
      errorCode: "write-failed",
      error: String(error instanceof Error ? error.message : error),
    });
    return false;
  }
}

export function getBest(id: TrackId) {
  return load().best[id] ?? null;
}

export function recordBest(id: TrackId, time: number, opts?: { eligible?: boolean; carId?: CarId }) {
  if (opts?.eligible === false) return false;
  if (!Number.isFinite(time) || time < 8 || time > 2700) return false;
  const data = load();
  const prev = data.best[id];
  const better = prev == null || time < prev;
  if (better) {
    data.best[id] = time;
    write(data);
  }
  const carId = opts?.carId ?? "sabra";
  void persistTimed({ t: time, trackId: id, carId, physicsVersion: PHYSICS_VERSION, hash: "" });
  return better;
}

async function persistTimed(rec: TimedRecord) {
  try {
    rec.hash = await sha256hex(recordPayload(rec.trackId, rec.carId, rec.t, rec.physicsVersion));
    const all = loadTimed().filter((r) => isLiveRecord(r, PHYSICS_VERSION));
    all.push(rec);
    writeRecords(all);
  } catch {
    /* quota / crypto */
  }
}

function loadTimed(): TimedRecord[] {
  try {
    const raw = localStorage.getItem(REC_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw) as TimedRecord[];
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

export function liveRecords() {
  return loadTimed().filter((r) => isLiveRecord(r, PHYSICS_VERSION));
}

export function getMuted() {
  return !!load().muted;
}

export function setMutedSave(muted: boolean) {
  const data = load();
  data.muted = muted;
  write(data);
}

export function allBests() {
  return load().best;
}

export function getNight() {
  const n = load().night;
  return n === undefined ? false : n;
}

export function setNightSave(night: boolean) {
  const data = load();
  data.night = night;
  write(data);
}

export function getQuality(): Quality {
  const q = load().quality;
  if (q === "low" || q === "mid") return q;
  return "high";
}

export function setQualitySave(quality: Quality) {
  const data = load();
  data.quality = quality;
  write(data);
}

export function getFov() {
  return Math.max(0, Math.min(12, load().fov ?? 0));
}

export function setFovSave(fov: number) {
  const data = load();
  data.fov = Math.max(0, Math.min(12, fov));
  write(data);
}

export function eventStars(id: string) {
  return load().career.stars[id] ?? 0;
}

export function allEventStars() {
  return load().career.stars;
}

export function totalStars() {
  const s = load().career.stars;
  let n = 0;
  for (const v of Object.values(s)) n += v ?? 0;
  return n;
}

export function recordEventStars(id: string, stars: number) {
  const data = load();
  const prev = data.career.stars[id] ?? 0;
  if (stars > prev) {
    data.career.stars[id] = stars;
    write(data);
    return true;
  }
  return false;
}

export function isCarUnlocked(id: CarId) {
  return totalStars() >= (CAR_UNLOCK[id] ?? 0);
}

export function getCash() {
  return load().cash;
}

export function addCash(amount: number) {
  const data = load();
  data.cash = Math.max(0, Math.round(data.cash + amount));
  write(data);
  return data.cash;
}

export function spendCash(amount: number) {
  const data = load();
  if (data.cash < amount) return false;
  data.cash -= amount;
  write(data);
  return true;
}

export function getTune(id: CarId): Tune {
  return { ...emptyTune(), ...(load().tunes[id] ?? {}) };
}

export function setTune(id: CarId, tune: Tune) {
  const data = load();
  data.tunes[id] = tune;
  write(data);
}

export function getDamage(id: CarId) {
  return load().damage[id] ?? 0;
}

export function setDamage(id: CarId, n: number) {
  const data = load();
  data.damage[id] = Math.max(0, Math.min(1, n));
  write(data);
}

export function repairCar(id: CarId) {
  const dmg = getDamage(id);
  if (dmg < 0.04) return false;
  const cost = Math.max(80, Math.round(dmg * 850));
  if (!spendCash(cost)) return false;
  setDamage(id, 0);
  return true;
}

export function repairCost(id: CarId) {
  const dmg = getDamage(id);
  if (dmg < 0.04) return 0;
  return Math.max(80, Math.round(dmg * 850));
}

type GhostBlob = Partial<Record<TrackId, { time: number; frames: GhostFrame[] }>>;

function loadGhosts(): GhostBlob {
  try {
    const raw = localStorage.getItem(GHOST_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as GhostBlob;
  } catch {
    return {};
  }
}

export function getGhost(id: TrackId) {
  return loadGhosts()[id] ?? null;
}

export function recordGhost(id: TrackId, time: number, frames: GhostFrame[]) {
  if (!Number.isFinite(time) || time < 8) return false;
  if (frames.length < 8) return false;
  const all = loadGhosts();
  const prev = all[id];
  if (prev && prev.time <= time) return false;
  all[id] = { time, frames };
  try {
    localStorage.setItem(GHOST_KEY, JSON.stringify(all));
  } catch {
    return false;
  }
  return true;
}

export function isDailyDone(key: string) {
  return load().dailyDone === key;
}

export function markDailyDone(key: string) {
  const data = load();
  data.dailyDone = key;
  write(data);
}

export function isWeeklyDone(key: string) {
  return load().weeklyDone === key;
}

export function markWeeklyDone(key: string) {
  const data = load();
  data.weeklyDone = key;
  write(data);
}

export function getHandling(): HandlingMode {
  return load().handling === "simcade" ? "simcade" : "arcade";
}

export function setHandlingSave(handling: HandlingMode) {
  const data = load();
  data.handling = handling;
  write(data);
}

export function getAssists(): AssistFlags {
  const a = load().assists;
  return {
    abs: a?.abs !== false,
    tcs: a?.tcs !== false,
    esc: a?.esc !== false,
  };
}

export function setAssistsSave(assists: AssistFlags) {
  const data = load();
  data.assists = { ...assists };
  write(data);
}

export function flushSave() {
  write(load());
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushSave();
  });
  window.addEventListener("pagehide", () => flushSave());
}

export function getLang(): Lang | null {
  return load().lang ?? null;
}

export function setLangSave(lang: Lang) {
  const data = load();
  data.lang = lang;
  write(data);
}
