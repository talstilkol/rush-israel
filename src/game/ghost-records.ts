import type { GhostFrame } from "./garage";

export type GhostRun = { time: number; frames: GhostFrame[] };
export type GhostRuns = Record<string, GhostRun>;
export function ghostStorageKey(trackId: string, ruleset?: string) {
  return ruleset ? `${trackId}|${ruleset}` : trackId;
}

/** Reject corrupt localStorage without letting it abort race boot. */
export function validGhostRun(value: unknown, requireTimestamps = false): value is GhostRun {
  if (!value || typeof value !== "object") return false;
  const run = value as GhostRun;
  if (!Number.isFinite(run.time) || run.time < 8 || run.time > 2700 || !Array.isArray(run.frames) || run.frames.length < 8 || run.frames.length > 20000) return false;
  let previous = -1;
  const timed = typeof run.frames[0]?.t === "number";
  if (requireTimestamps && !timed) return false;
  for (const frame of run.frames) {
    if (!frame || ![frame.x, frame.y, frame.z, frame.yaw].every(n => Number.isFinite(n) && Math.abs(n) < 1e7)) return false;
    if (timed) {
      if (typeof frame.t !== "number" || !Number.isFinite(frame.t) || frame.t <= previous || frame.t > run.time + 0.01) return false;
      previous = frame.t;
    } else if (frame.t !== undefined) return false;
  }
  if (requireTimestamps && ((run.frames[0].t ?? Infinity) > 0.2 || previous < run.time - 0.33)) return false;
  return true;
}

export function decodeGhostRuns(raw: string | null): GhostRuns {
  if (!raw) return {};
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([key, run]) =>
      /^[a-z0-9-]+(?:\|[a-f0-9]{64})?$/.test(key) && validGhostRun(run, key.includes("|")),
    ));
  } catch { return {}; }
}
