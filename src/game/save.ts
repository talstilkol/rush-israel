import type { AssistFlags, CarId, HandlingMode, Quality, TrackId, Tune } from "./types";
import type { Lang } from "./i18n";
import { CAR_UNLOCK } from "./career";
import { emptyTune, type GhostFrame } from "./garage";

const KEY = "rush-v1";
const LEGACY = "tlv-rush-v1";
const GHOST_KEY = "rush-ghosts-v1";

type SaveData = {
  version: 3;
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

function empty(): SaveData {
  return { version: 3, best: {}, career: { stars: {} }, cash: 500, tunes: {}, damage: {} };
}

function load(): SaveData {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY);
    if (!raw) return empty();
    const p = JSON.parse(raw) as Partial<SaveData> & { version?: number };
    return {
      version: 3,
      best: p.best ?? {},
      muted: p.muted,
      night: p.night,
      quality: p.quality,
      fov: p.fov,
      career: { stars: p.career?.stars ?? {} },
      cash: typeof p.cash === "number" ? p.cash : 500,
      tunes: p.tunes ?? {},
      damage: p.damage ?? {},
      dailyDone: p.dailyDone,
      weeklyDone: p.weeklyDone,
      handling: p.handling === "arcade" ? "arcade" : "simcade",
      assists: {
        abs: p.assists?.abs !== false,
        tcs: p.assists?.tcs !== false,
        esc: p.assists?.esc !== false,
      },
      lang: p.lang === "ar" || p.lang === "en" || p.lang === "he" ? p.lang : undefined,
    };
  } catch {
    return empty();
  }
}

function write(data: SaveData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* quota */
  }
}

export function getBest(id: TrackId) {
  return load().best[id] ?? null;
}

export function recordBest(id: TrackId, time: number) {
  const data = load();
  const prev = data.best[id];
  if (prev == null || time < prev) {
    data.best[id] = time;
    write(data);
    return true;
  }
  return false;
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
  return load().handling === "arcade" ? "arcade" : "simcade";
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

export function getLang(): Lang | null {
  return load().lang ?? null;
}

export function setLangSave(lang: Lang) {
  const data = load();
  data.lang = lang;
  write(data);
}
