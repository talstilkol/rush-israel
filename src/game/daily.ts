import type { RaceMode, TrackId, Weather } from "./types";
import { TRACKS } from "./tracks";

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

export function todayChallenge(d = new Date()): DailyChallenge {
  const key = dailyKey(d);
  const h = hash(key);
  const track = TRACKS[h % TRACKS.length];
  return {
    key,
    trackId: track.id,
    mode: MODES[h % MODES.length],
    weather: WX[(h >>> 5) % WX.length],
    night: ((h >>> 9) & 1) === 1,
  };
}
