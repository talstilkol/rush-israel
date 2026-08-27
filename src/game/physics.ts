import type { Weather } from "./types";

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

export const PHYSICS_HZ = 120;
export const PHYSICS_DT = 1 / PHYSICS_HZ;
export const MAX_CATCHUP_STEPS = 24;
export const MAX_ACCUMULATOR = 0.2;
export const PHYSICS_VERSION = 4;

export type HandlingMode = "arcade" | "simcade";

export type AssistFlags = {
  abs: boolean;
  tcs: boolean;
  esc: boolean;
};

export const DEFAULT_ASSISTS: AssistFlags = { abs: true, tcs: true, esc: true };

export type HandlingProfile = {
  gripMul: number;
  nitroMul: number;
  rubberBand: boolean;
  driftBoost: number;
  lockSlip: number;
  yawDamp: number;
};

export const HANDLING: Record<HandlingMode, HandlingProfile> = {
  arcade: {
    gripMul: 1.08,
    nitroMul: 1,
    rubberBand: true,
    driftBoost: 1,
    lockSlip: 0.22,
    yawDamp: 0.72,
  },
  simcade: {
    gripMul: 0.94,
    nitroMul: 0.52,
    rubberBand: false,
    driftBoost: 0.58,
    lockSlip: 0.16,
    yawDamp: 1,
  },
};

export type WeatherSpec = {
  long: number;
  lat: number;
  roll: number;
  hydro: number;
  vis: number;
};

export const WEATHER_SPEC: Record<Weather, WeatherSpec> = {
  clear: { long: 1, lat: 1, roll: 1, hydro: 0, vis: 1 },
  rain: { long: 0.78, lat: 0.72, roll: 1.42, hydro: 0.22, vis: 0.82 },
  storm: { long: 0.62, lat: 0.55, roll: 1.7, hydro: 0.4, vis: 0.62 },
  hamsin: { long: 0.9, lat: 0.84, roll: 1.12, hydro: 0, vis: 0.7 },
};

export type SurfaceKind = "asphalt" | "curb" | "sand" | "water";

export const SURFACE_SPEC: Record<SurfaceKind, { long: number; lat: number; roll: number }> = {
  asphalt: { long: 1, lat: 1, roll: 1 },
  curb: { long: 0.82, lat: 0.74, roll: 1.22 },
  sand: { long: 0.54, lat: 0.48, roll: 2.35 },
  water: { long: 0.42, lat: 0.36, roll: 1.85 },
};

/** Pacejka magic-formula lateral/longitudinal tire force. Odd in slip, peak near 0.12. */
export function pacejka(slip: number, D: number, B = 10.4, C = 1.9, E = 0.97) {
  const x = slip;
  return D * Math.sin(C * Math.atan(B * x - E * (B * x - Math.atan(B * x))));
}

/** Monotone brake force. No step around 82–83% or lock threshold. */
export function brakeForce(brake: number, statsBrake: number, pitch = 0) {
  const b = clamp(brake, 0, 1);
  const dive = 1 + clamp(pitch, 0, 1) * 0.22;
  return b * statsBrake * dive;
}

export function absModulate(brake: number, slipRatio: number, enabled: boolean) {
  if (!enabled) return { brake: clamp(brake, 0, 1), active: false };
  if (slipRatio < -0.18) {
    const cut = clamp((-slipRatio - 0.12) / 0.22, 0, 0.68);
    return { brake: clamp(brake, 0, 1) * (1 - cut), active: true };
  }
  return { brake: clamp(brake, 0, 1), active: false };
}

export function tcsModulate(throttle: number, slipRatio: number, enabled: boolean) {
  if (!enabled) return { throttle: clamp(throttle, 0, 1), active: false };
  if (slipRatio > 0.14) {
    const cut = clamp((slipRatio - 0.1) / 0.28, 0, 0.62);
    return { throttle: clamp(throttle, 0, 1) * (1 - cut), active: true };
  }
  return { throttle: clamp(throttle, 0, 1), active: false };
}

export function escYaw(slipAngle: number, yawRate: number, enabled: boolean, drifting: boolean) {
  if (!enabled || drifting) return { yaw: 0, active: false };
  const a = Math.abs(slipAngle);
  if (a < 0.18) return { yaw: 0, active: false };
  const sign = -Math.sign(slipAngle);
  const mag = clamp((a - 0.18) * 0.55, 0, 0.85);
  const rateCut = clamp(Math.abs(yawRate) * 0.12, 0, 0.4);
  return { yaw: sign * mag * (1 - rateCut), active: true };
}

export function hydroplane(speedAbs: number, hydro: number) {
  if (hydro <= 0) return 1;
  const onset = 26;
  if (speedAbs <= onset) return 1;
  return 1 - clamp((speedAbs - onset) / 48, 0, 1) * hydro;
}

export function clampInput(v: number) {
  return clamp(v, -1, 1);
}
