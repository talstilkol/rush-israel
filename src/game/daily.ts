import type { RaceMode, TrackId, Weather } from "./types";
import { TRACKS, getTrack, isDriveable } from "./tracks";

export type DailyChallenge = {
  key: string;
  trackId: TrackId;
  mode: RaceMode;
  weather: Weather;
  night: boolean;
};

const MODES: RaceMode[] = ["circuit", "time", "drift", "knockout", "heat"];
const WX: Weather[] = ["clear", "clear", "rain", "storm"];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function dailyKey(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const LAP_S: Record<string, number> = {
  ayalon: 89.4,
  rothschild: 61.2,
  namal: 62.1,
  oldjaffa: 35,
  scopus: 55.3,
  haifa: 31.9,
  ramon: 91.8,
  hermon: 128.6,
};

export function medalTargets(trackId: string, mode: RaceMode, weather: Weather) {
  const open = getTrack(trackId as TrackId).open;
  const laps = open ? 1 : mode === "circuit" || mode === "knockout" ? 3 : 2;
  if (mode === "circuit" || mode === "knockout" || mode === "roam") {
    return { gold: 1, silver: 2, bronze: 3 };
  }
  const lap = LAP_S[trackId] ?? 90;
  if (mode === "drift") {
    const gold = Math.round(lap * laps * 90);
    return { gold, silver: Math.round(gold * 0.62), bronze: Math.round(gold * 0.38) };
  }
  const wx = weather === "storm" ? 1.38 : weather === "rain" ? 1.12 : weather === "hamsin" ? 1.1 : 1.06;
  const gold = Math.round(lap * laps * wx);
  return { gold, silver: Math.round(gold * 1.16), bronze: Math.round(gold * 1.34) };
}

export function todayChallenge(d = new Date()): DailyChallenge {
  const key = dailyKey(d);
  const h = hash(key);
  const pool = TRACKS.filter(isDriveable);
  const track = pool[h % pool.length] ?? TRACKS[0]!;
  return {
    key,
    trackId: track.id,
    mode: MODES[h % MODES.length],
    weather: WX[(h >>> 5) % WX.length],
    night: ((h >>> 9) & 1) === 1,
  };
}
