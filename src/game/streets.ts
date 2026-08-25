import { clamp } from "./math";
import type { BuiltTrack } from "./spline";
import type { TrackDef, WaterBody } from "./types";

export type StreetRibbon = {
  ax: number;
  az: number;
  bx: number;
  bz: number;
  half: number;
  he: string;
  en: string;
};

const IL_NAMES: [string, string][] = [
  ["דיזנגוף", "Dizengoff"],
  ["אלנבי", "Allenby"],
  ["שינקין", "Sheinkin"],
  ["בן יהודה", "Ben Yehuda"],
  ["רוטשילד", "Rothschild"],
  ["בוגרשוב", "Bugrashov"],
  ["פרישמן", "Frischmann"],
  ["גורדון", "Gordon"],
  ["נחלת בנימין", "Nahalat Binyamin"],
  ["הרצל", "Herzl"],
  ["המלך ג'ורג'", "King George"],
  ["יפו", "Jaffa St"],
  ["אגרון", "Agron"],
  ["עמק רפאים", "Emek Refaim"],
];

const NYC_NAMES: [string, string][] = [
  ["ברודוויי", "Broadway"],
  ["השדרה השביעית", "7th Avenue"],
  ["השדרה החמישית", "Fifth Avenue"],
  ["רחוב 42", "42nd Street"],
  ["רחוב 34", "34th Street"],
  ["מדיסון", "Madison Ave"],
  ["לקסינגטון", "Lexington Ave"],
  ["אמסטרדם", "Amsterdam Ave"],
  ["קולומבוס", "Columbus Ave"],
  ["מרסר", "Mercer St"],
  ["ספרינג", "Spring St"],
  ["פרונט", "Front Street"],
  ["קדמן פלאזה", "Cadman Plaza"],
];

function inWater(bodies: WaterBody[], x: number, z: number) {
  for (const w of bodies) {
    if (Math.abs(x - w.x) < w.w * 0.42 && Math.abs(z - w.z) < w.d * 0.42) return true;
  }
  return false;
}

function inClear(def: TrackDef, x: number, z: number) {
  for (const z0 of def.clearZones ?? []) {
    if (Math.abs(x - z0.x) < z0.w * 0.5 && Math.abs(z - z0.z) < z0.d * 0.5) return true;
  }
  return false;
}

export function generateStreets(def: TrackDef, built: BuiltTrack, bodies: WaterBody[]): StreetRibbon[] {
  if (def.id === "ayalon") return [];
  const names = def.city === "nyc" ? NYC_NAMES : IL_NAMES;
  const out: StreetRibbon[] = [];
  const park = def.theme === "park";
  const roam = def.id === "gushdan";
  const step = roam ? 30 : park ? 78 : def.theme === "highway" ? 62 : 46;
  const reach = roam ? 54 : park ? 24 : 38;
  const half = roam ? 6.2 : park ? 4.4 : 5.7;
  let next = 10;
  let n = 0;
  for (const s of built.samples) {
    if (s.s < next) continue;
    next = s.s + step;
    if (s.y > 6.5) continue;
    const label = names[n % names.length];
    for (const side of [-1, 1] as const) {
      const start = built.width / 2 + 2.6;
      const ax = s.x + s.rx * start * side;
      const az = s.z + s.rz * start * side;
      const bx = s.x + s.rx * (start + reach) * side;
      const bz = s.z + s.rz * (start + reach) * side;
      const mx = (ax + bx) * 0.5;
      const mz = (az + bz) * 0.5;
      if (inWater(bodies, mx, mz) || inClear(def, mx, mz)) continue;
      if (inWater(bodies, bx, bz)) continue;
      out.push({ ax, az, bx, bz, half, he: label[0], en: label[1] });
      n += 1;
    }
    if (out.length >= 28) break;
  }
  return out;
}

export function distToStreet(x: number, z: number, r: StreetRibbon) {
  const dx = r.bx - r.ax;
  const dz = r.bz - r.az;
  const l2 = dx * dx + dz * dz || 1;
  const t = clamp(((x - r.ax) * dx + (z - r.az) * dz) / l2, 0, 1);
  const qx = r.ax + t * dx;
  const qz = r.az + t * dz;
  return { dist: Math.hypot(x - qx, z - qz), qx, qz, t };
}

export function nearestStreet(x: number, z: number, streets: StreetRibbon[]) {
  let best: StreetRibbon | null = null;
  let bestD = Infinity;
  let hit = { dist: Infinity, qx: x, qz: z, t: 0 };
  for (const r of streets) {
    const d = distToStreet(x, z, r);
    if (d.dist < bestD) {
      bestD = d.dist;
      best = r;
      hit = d;
    }
  }
  return best ? { street: best, ...hit } : null;
}
