/** G4-01 stub / LookDev ids. No HDRI, no calibrated luminance. */
export type LookId = "summer14" | "golden" | "nightrain" | "rain";

export type EnvironmentState = {
  look: LookId;
  exposure: number;
  wetness: number;
  night: number;
  vis: number;
};

export const LOOKS: Record<LookId, EnvironmentState> = {
  summer14: { look: "summer14", exposure: 0.68, wetness: 0, night: 0, vis: 1 },
  golden: { look: "golden", exposure: 0.78, wetness: 0, night: 0.12, vis: 1 },
  nightrain: { look: "nightrain", exposure: 1.05, wetness: 0.65, night: 1, vis: 0.72 },
  rain: { look: "rain", exposure: 0.62, wetness: 1, night: 0.08, vis: 0.55 },
};

export function lookFromFlags(night: boolean, weather: string): LookId {
  if (weather === "rain" && night) return "nightrain";
  if (weather === "rain") return "rain";
  if (night) return "nightrain";
  return "summer14";
}
