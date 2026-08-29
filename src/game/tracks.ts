import { clamp, lerp, lerpColor } from "./math";
import type { SkyPreset, TrackDef, TrackId, Weather } from "./types";
import { TRACKS } from "./tracks/index";

export { TRACKS };
export { CITY_FILTERS, acr, afl, ard, asd, ask, bsn, bsv, bym, cae, dsea, eil, gol, hai, hdr, her, hol, hwy1, hwy2, hwy40, hwy6, hwy90, hzl, jer, ksb, ksm, lodp, mas, mod, nah, naz, net, nik, pth, raa, ram, rhv, rml, rsh, tib, tlv, tzf } from "./tracks/shared";

// RSH-014: RECONSTRUCTED LEGACY POSTLUDE START


export function getTrack(id: TrackId) {
  const t = TRACKS.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown track ${id}`);
  return t;
}

export function isDriveable(track: TrackDef) {
  return track.width >= 19.5 && track.city !== "nyc";
}

export function streetName(track: TrackDef, t: number, he: boolean) {
  const u = t < 0 ? t + 1 : t % 1;
  const seg = track.streets.find((s) => u >= s.from && u < s.to) ?? track.streets[track.streets.length - 1];
  return he ? seg.he : seg.en;
}

export function nearestPoi(track: TrackDef, x: number, z: number, he: boolean) {
  let best = "";
  let bestD = Infinity;
  for (const p of track.pois) {
    const d = Math.hypot(x - p.x, z - p.z);
    if (d < p.r && d < bestD) {
      bestD = d;
      best = he ? p.he : p.en;
    }
  }
  return best;
}

export function nightAmt(clock: number) {
  const t = ((clock % 1) + 1) % 1;
  return clamp(0.5 + 0.5 * Math.cos(t * Math.PI * 2), 0, 1);
}

export function todLabel(clock: number, he: boolean) {
  const t = ((clock % 1) + 1) % 1;
  if (t < 0.16 || t >= 0.9) return he ? "לילה" : "Night";
  if (t < 0.3) return he ? "זריחה" : "Dawn";
  if (t < 0.44) return he ? "בוקר" : "Morning";
  if (t < 0.62) return he ? "צהריים" : "Noon";
  if (t < 0.78) return he ? "אחר הצהריים" : "Afternoon";
  return he ? "שקיעה" : "Sunset";
}

type SkyKey = { t: number } & SkyPreset;

export function skyAt(def: TrackDef, clock: number, weather: Weather = "clear"): SkyPreset {
  const az = def.sky.azimuth;
  const nightFog =
    def.theme === "stone" || def.theme === "jaffa"
      ? 0x14110e
      : def.theme === "desert"
        ? 0x16110c
        : def.theme === "park"
          ? 0x0c1410
          : def.theme === "manhattan"
            ? 0x0a1018
            : 0x0c1018;
  const dayFog = def.water ? 0xb8d4e4 : 0xc4d2dc;
  const keys: SkyKey[] = [
    { t: 0, elevation: -7, azimuth: az, turbidity: 12, rayleigh: 0.22, mieCoefficient: 0.01, mieDirectionalG: 0.96, exposure: 0.68, fog: nightFog, fogDensity: 0.0042 },
    { t: 0.2, elevation: 3.5, azimuth: az, turbidity: 8.2, rayleigh: 1.85, mieCoefficient: 0.006, mieDirectionalG: 0.88, exposure: 0.78, fog: 0xc8a888, fogDensity: 0.0038 },
    { t: 0.34, elevation: 22, azimuth: az, turbidity: 3.4, rayleigh: 1.15, mieCoefficient: 0.0032, mieDirectionalG: 0.72, exposure: 0.92, fog: 0xb4cce0, fogDensity: 0.0022 },
    { t: 0.5, elevation: 64, azimuth: az, turbidity: 1.85, rayleigh: 0.72, mieCoefficient: 0.0018, mieDirectionalG: 0.55, exposure: 0.94, fog: dayFog, fogDensity: 0.0018 },
    { t: 0.7, elevation: 16, azimuth: az, turbidity: 6.2, rayleigh: 1.8, mieCoefficient: 0.0052, mieDirectionalG: 0.84, exposure: 0.88, fog: 0xc4a888, fogDensity: 0.0032 },
    { t: 0.84, elevation: 2.2, azimuth: az, turbidity: 9.4, rayleigh: 1.15, mieCoefficient: 0.008, mieDirectionalG: 0.92, exposure: 0.7, fog: 0x3a4458, fogDensity: 0.0038 },
    { t: 1, elevation: -7, azimuth: az, turbidity: 12, rayleigh: 0.22, mieCoefficient: 0.01, mieDirectionalG: 0.96, exposure: 0.68, fog: nightFog, fogDensity: 0.0042 },
  ];
  const t = ((clock % 1) + 1) % 1;
  let i = 0;
  while (i < keys.length - 2 && keys[i + 1].t < t) i += 1;
  const a = keys[i];
  const b = keys[i + 1];
  const u = (t - a.t) / Math.max(0.0001, b.t - a.t);
  const preset: SkyPreset = {
    elevation: lerp(a.elevation, b.elevation, u),
    azimuth: az,
    turbidity: lerp(a.turbidity, b.turbidity, u),
    rayleigh: lerp(a.rayleigh, b.rayleigh, u),
    mieCoefficient: lerp(a.mieCoefficient, b.mieCoefficient, u),
    mieDirectionalG: lerp(a.mieDirectionalG, b.mieDirectionalG, u),
    exposure: lerp(a.exposure, b.exposure, u),
    fog: lerpColor(a.fog, b.fog, u),
    fogDensity: lerp(a.fogDensity, b.fogDensity, u),
  };
  const night = t < 0.22 || t > 0.86;
  if (weather === "rain") {
    preset.turbidity += 5;
    preset.exposure *= 0.86;
    preset.fogDensity += 0.0032;
    preset.rayleigh *= 0.55;
    preset.fog = night ? 0x12161c : 0x7a848c;
  } else if (weather === "storm") {
    preset.turbidity += 9;
    preset.exposure *= 0.7;
    preset.fogDensity += 0.0058;
    preset.rayleigh *= 0.35;
    preset.elevation = night ? -8 : Math.min(preset.elevation, 28);
    preset.fog = night ? 0x0c1014 : 0x4a545c;
  } else if (weather === "hamsin") {
    preset.turbidity += 7;
    preset.exposure *= 1.08;
    preset.fogDensity += 0.0044;
    preset.rayleigh *= 0.72;
    preset.fog = night ? 0x2a1c12 : 0xd4b080;
    preset.elevation = Math.min(preset.elevation, 42);
  }
  return preset;
}

export function skyFor(def: TrackDef, night: boolean, weather: Weather = "clear"): SkyPreset {
  return skyAt(def, night ? 0.92 : 0.5, weather);
}
