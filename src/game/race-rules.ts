import { getCar } from "./cars";
import { PHYSICS_VERSION } from "./physics";
import { sha256hexSync } from "./records";
import { buildTrack } from "./spline";
import { getTrack } from "./tracks";
import type { TrackId, Tune } from "./types";

export type RaceRules = {
  mode: string;
  weather: string;
  carId: string;
  handling: string;
  assists: string;
  laps: number;
  tune?: Tune;
  night?: boolean;
  traffic?: string;
  grid?: number;
};

const trackDigests = new Map<string, string>();

/** Includes generated elevation and checkpoint geometry, not only a track label. */
export function trackRulesDigest(id: TrackId) {
  const cached = trackDigests.get(id);
  if (cached) return cached;
  const track = buildTrack(getTrack(id));
  const digest = sha256hexSync(JSON.stringify(track));
  trackDigests.set(id, digest);
  return digest;
}

export function rulesetKey(trackId: TrackId, rules: RaceRules) {
  return sha256hexSync(JSON.stringify([
    "race-rules-v2", trackId, trackRulesDigest(trackId), PHYSICS_VERSION,
    rules.mode, rules.weather, rules.carId, getCar(rules.carId), rules.handling, rules.assists, rules.laps,
    rules.tune?.engine ?? 0, rules.tune?.tires ?? 0, rules.tune?.nitro ?? 0,
    rules.night ?? false, rules.traffic ?? "normal", rules.grid ?? 6,
  ]));
}
