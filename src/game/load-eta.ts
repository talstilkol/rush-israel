import type { Quality, TrackId } from "./types";

const KEY = "rush-load-eta-v1";

type Store = Record<string, number>;

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as Store;
    return p && typeof p === "object" ? p : {};
  } catch {
    return {};
  }
}

function write(data: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* quota */
  }
}

function slot(trackId: TrackId, quality: Quality, night: boolean) {
  return `${trackId}|${quality}|${night ? "n" : "d"}`;
}

const HEAVY = new Set<TrackId>([
  "ayalon",
  "manhattan",
  "timessquare",
  "gushdan",
  "jerusalem",
  "scopus",
  "ramon",
  "hermon",
  "oldjaffa",
  "rothschild",
  "telaviv",
  "namal",
]);

export function estimateLoadMs(trackId: TrackId, quality: Quality, night: boolean): number {
  const prev = read()[slot(trackId, quality, night)];
  if (typeof prev === "number" && prev > 250 && prev < 60000) return Math.round(prev * 1.04);
  let ms = 1100;
  if (quality === "high") ms += 400;
  else if (quality === "mid") ms += 180;
  if (night) ms += 200;
  if (HEAVY.has(trackId)) ms += 400;
  return ms;
}

export function recordLoadMs(trackId: TrackId, quality: Quality, night: boolean, ms: number) {
  if (!Number.isFinite(ms) || ms < 200 || ms > 90000) return;
  const data = read();
  const k = slot(trackId, quality, night);
  const prev = data[k];
  data[k] = prev ? prev * 0.45 + ms * 0.55 : ms;
  write(data);
}
