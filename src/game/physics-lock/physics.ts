/** Canonical Version 1 physics-calibration lock (RSH-033). */

export const PHYSICS_CALIBRATION_GIS_CLAIM = false;
export const PHYSICS_CALIBRATION_OWNER_FREEZE = false;
export const PHYSICS_CALIBRATION_PUBLIC_DISTRIBUTION = false;
export const PHYSICS_CALIBRATION_VERSION = 7;
export const PHYSICS_CALIBRATION_HZ = 120;
export const V100_MPS = 27.778;
export const CLAIM_TOLERANCE = 0.15;
export const CLAIM_SABRA = 8.4;
export const CLAIM_CARMEL = 6.6;
export const CLAIM_KFIR = 4.9;
export const CLAIM_NEGEV = 5.8;
export const CLAIM_YAM = 3.5;
export const GEAR_DUMP_BELOW_V100 = false;
export const LAUNCH_DRAG_COMPENSATE = true;
export const CARS_SOURCE_REWRITTEN = false;

export function claimAccel(zeroTo100: number) {
  return V100_MPS / Math.max(3.2, zeroTo100);
}

export function claimBand(claim: number, tolerance = CLAIM_TOLERANCE) {
  return { low: claim * (1 - tolerance), high: claim * (1 + tolerance) };
}
