/** LookDev + fog table (Codex 53 / 56). No HDRI, no calibrated luminance. */
export type LookId = "summer14" | "golden" | "night" | "nightrain" | "rain";

export type EnvironmentState = {
  look: LookId;
  exposure: number;
  wetness: number;
  night: number;
  vis: number;
};

export const LOOKS: Record<LookId, EnvironmentState> = {
  summer14: { look: "summer14", exposure: 0.56, wetness: 0.18, night: 0, vis: 1 },
  golden: { look: "golden", exposure: 0.7, wetness: 0.16, night: 0.12, vis: 1 },
  night: { look: "night", exposure: 1.22, wetness: 0.22, night: 1, vis: 0.9 },
  nightrain: { look: "nightrain", exposure: 1.18, wetness: 0.7, night: 1, vis: 0.76 },
  rain: { look: "rain", exposure: 0.58, wetness: 1, night: 0.08, vis: 0.55 },
};

export function lookFromFlags(night: boolean, weather: string, morning = false): LookId {
  if ((weather === "rain" || weather === "storm") && night) return "nightrain";
  if (weather === "rain" || weather === "storm") return "rain";
  if (night) return "night";
  if (morning) return "golden";
  return "summer14";
}

export type FogKey = "city" | "desert" | "snow" | "carmel" | "stone";

export const FOG: Record<FogKey, { day: number; night: number; far: number; dayCol: number; nightCol: number }> = {
  city: { day: 0.00001, night: 0.000045, far: 10000, dayCol: 0x6eb4dc, nightCol: 0x2a4058 },
  desert: { day: 0.00006, night: 0.00012, far: 12000, dayCol: 0xb8a888, nightCol: 0x1a2838 },
  snow: { day: 0.00004, night: 0.0001, far: 12000, dayCol: 0xc8dcec, nightCol: 0x1a2838 },
  carmel: { day: 0.00002, night: 0.0001, far: 12000, dayCol: 0x6eb4dc, nightCol: 0x1a2838 },
  stone: { day: 0.00003, night: 0.00012, far: 8000, dayCol: 0xc4b49a, nightCol: 0x1a2838 },
};

export function fogKey(theme: string, id: string): FogKey {
  if (id === "ramon" || theme === "desert") return "desert";
  if (id === "hermon" || theme === "snow") return "snow";
  if (theme === "carmel") return "carmel";
  if (theme === "stone" || id === "jerusalem" || id === "scopus") return "stone";
  return "city";
}
