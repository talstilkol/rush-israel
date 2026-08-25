import type { CarDef, RaceResult, Tune, Weather } from "./types";

export const PAINTS: { id: number; he: string; en: string; color: number }[] = [
  { id: 0, he: "מקורי", en: "Stock", color: 0 },
  { id: 1, he: "שנהב", en: "Ivory", color: 0xf2eee8 },
  { id: 2, he: "לילה", en: "Night", color: 0x1a1c22 },
  { id: 3, he: "טורקיז", en: "Teal", color: 0x2a8f8a },
  { id: 4, he: "ארד", en: "Bronze", color: 0xb8894a },
];

export const UPGRADE_MAX = 3;
export const UPGRADE_COST = {
  engine: [900, 1800, 3200],
  tires: [800, 1600, 2800],
  nitro: [1000, 2000, 3600],
} as const;
export const PAINT_COST = 450;
export const LIVERY_COST = 700;

export const LIVERIES: { id: number; he: string; en: string }[] = [
  { id: 0, he: "נקי", en: "Clean" },
  { id: 1, he: "פסים", en: "Stripes" },
  { id: 2, he: "שקיעה", en: "Sunset" },
  { id: 3, he: "משבצות", en: "Checkers" },
  { id: 4, he: "להבות", en: "Flames" },
  { id: 5, he: "זהב", en: "Gold line" },
  { id: 6, he: "ספליט", en: "Split" },
];

export function emptyTune(): Tune {
  return { engine: 0, tires: 0, nitro: 0, paint: 0, livery: 0 };
}

export function applyTune(base: CarDef, tune: Tune): CarDef {
  const paint = PAINTS[tune.paint];
  const color = !paint || paint.id === 0 || paint.color === 0 ? base.color : paint.color;
  return {
    ...base,
    color,
    maxSpeed: base.maxSpeed + tune.engine * 1.4,
    accel: base.accel + tune.engine * 0.38,
    turnRate: base.turnRate + tune.tires * 0.1,
    grip: Math.min(0.99, base.grip + tune.tires * 0.034),
    nitroDrain: 0.42 - tune.nitro * 0.07,
    nitroStart: 0.34 + tune.nitro * 0.18,
  };
}

export function nextCost(kind: keyof typeof UPGRADE_COST, level: number) {
  if (level >= UPGRADE_MAX) return null;
  return UPGRADE_COST[kind][level] ?? null;
}

export function racePayout(r: RaceResult) {
  if (r.busted) return 80;
  if (r.mode === "heat") return r.place === 1 ? 1600 : 80;
  if (r.mode === "drift") {
    if (r.driftScore >= 9000) return 1400;
    if (r.driftScore >= 5000) return 850;
    return 400;
  }
  if (r.mode === "time" || r.mode === "roam") {
    if (r.place === 1) return 1100;
    return 500;
  }
  if (r.place === 1) return 1400;
  if (r.place === 2) return 800;
  if (r.place === 3) return 450;
  return 220;
}

export const WEATHER_GRIP: Record<string, number> = {
  clear: 1,
  rain: 0.76,
  storm: 0.6,
  hamsin: 0.86,
};

export function weatherLabel(w: Weather, he: boolean, ar = false) {
  if (w === "rain") return he ? "גשם" : ar ? "مطر" : "Rain";
  if (w === "storm") return he ? "סערה" : ar ? "عاصفة" : "Storm";
  if (w === "hamsin") return he ? "חמסין" : ar ? "خمسين" : "Hamsin";
  return he ? "בהיר" : ar ? "صافي" : "Clear";
}

export type GhostFrame = { x: number; z: number; y: number; yaw: number };

export function sampleGhost(frames: GhostFrame[], time: number, dt = 0.16) {
  if (!frames.length) return null;
  const i = Math.min(frames.length - 1, Math.max(0, Math.floor(time / dt)));
  const a = frames[i];
  const b = frames[Math.min(frames.length - 1, i + 1)];
  const f = Math.min(1, (time - i * dt) / dt);
  let dy = b.yaw - a.yaw;
  while (dy > Math.PI) dy -= Math.PI * 2;
  while (dy < -Math.PI) dy += Math.PI * 2;
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    z: a.z + (b.z - a.z) * f,
    yaw: a.yaw + dy * f,
  };
}

export function sampleGhostLoop(frames: GhostFrame[], time: number, dt = 0.16) {
  if (!frames.length) return null;
  const period = frames.length * dt;
  const t = ((time % period) + period) % period;
  return sampleGhost(frames, t, dt);
}

export function paceGhost(samples: { x: number; y: number; z: number; tx: number; tz: number; s: number }[], length: number, duration: number, dt = 0.16): GhostFrame[] {
  const frames: GhostFrame[] = [];
  const n = samples.length;
  if (n < 2 || duration < 4) return frames;
  const len = Math.max(1, length);
  for (let t = 0; t < duration - dt * 0.5; t += dt) {
    const s = ((t / duration) % 1) * len;
    let i = 0;
    let lo = 0;
    let hi = n - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (samples[mid].s < s) lo = mid + 1;
      else hi = mid;
    }
    i = Math.max(0, lo - 1);
    const a = samples[i];
    const b = samples[(i + 1) % n];
    const span = b.s > a.s ? b.s - a.s : 1;
    const f = Math.min(1, Math.max(0, (s - a.s) / span));
    frames.push({
      x: a.x + (b.x - a.x) * f,
      y: a.y + (b.y - a.y) * f,
      z: a.z + (b.z - a.z) * f,
      yaw: Math.atan2(-a.tx, -a.tz),
    });
  }
  return frames;
}
