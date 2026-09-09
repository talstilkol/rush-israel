import type { Collider } from "./types";

export type HeightCollider = Collider & {
  vertical?: { min: number; max: number };
  role?: "support-pier" | "overhead-slab";
};

export type VehicleEnvelope = { yMin: number; yMax: number };

// Explicit arcade proxy. Existing rectangular contacts already use the same
// 1.05-unit horizontal car padding. Rest-pose height stays 1.6; pitch/roll
// rotate a conservative wheelbase box, they do not replace the render mesh.
export const CAR_CONTACT_RADIUS = 1.05;
export const CAR_CONTACT_HEIGHT = 1.6;
export const CAR_HALF_LENGTH = 1.25;
export const CAR_HALF_WIDTH = 1.05;
export const UPRIGHT_ENVELOPE: VehicleEnvelope = { yMin: 0, yMax: CAR_CONTACT_HEIGHT };
const MAX_PITCH = 0.75;
const MAX_ROLL = 0.34;

/** Unbounded legacy colliders retain their original all-height semantics. */
export function overlapsColliderHeight(
  collider: HeightCollider,
  carY: number,
  envelope: VehicleEnvelope = UPRIGHT_ENVELOPE,
): boolean {
  const span = collider.vertical;
  if (!span) return true;
  const yMin = envelope?.yMin;
  const yMax = envelope?.yMax;
  // Malformed bounds or envelopes must not turn an obstacle into a pass-through object.
  if (![span.min, span.max, carY, yMin, yMax].every(Number.isFinite) || span.max <= span.min || yMax < yMin) return true;
  // Contact exactly at an endpoint has no positive-volume intersection.
  return carY + yMin < span.max && carY + yMax > span.min;
}

/** Rest pose matches the historical 1.6 upright proxy. Non-finite tilt fails closed. */
export function vehicleEnvelope(pitch = 0, roll = 0): VehicleEnvelope {
  if (![pitch, roll].every(Number.isFinite)) return vehicleEnvelope(MAX_PITCH, MAX_ROLL);
  if (pitch === 0 && roll === 0) return { yMin: 0, yMax: CAR_CONTACT_HEIGHT };
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  let yMin = Infinity;
  let yMax = -Infinity;
  for (const long of [-CAR_HALF_LENGTH, CAR_HALF_LENGTH]) {
    for (const lat of [-CAR_HALF_WIDTH, CAR_HALF_WIDTH]) {
      for (const y of [0, CAR_CONTACT_HEIGHT]) {
        const yPitched = y * cp - long * sp;
        const yRolled = yPitched * cr - lat * sr;
        if (yRolled < yMin) yMin = yRolled;
        if (yRolled > yMax) yMax = yRolled;
      }
    }
  }
  if (!Number.isFinite(yMin) || !Number.isFinite(yMax) || yMax < yMin) {
    return vehicleEnvelope(MAX_PITCH, MAX_ROLL);
  }
  return { yMin, yMax };
}

/** Ceiling = roof clips the underside while the origin stays below the span. */
export function colliderContactKind(
  collider: HeightCollider,
  carY: number,
  envelope: VehicleEnvelope = UPRIGHT_ENVELOPE,
): "none" | "solid" | "ceiling" {
  if (!overlapsColliderHeight(collider, carY, envelope)) return "none";
  const span = collider.vertical;
  if (!span) return "solid";
  if (![span.min, span.max, carY, envelope.yMin, envelope.yMax].every(Number.isFinite) || span.max <= span.min) {
    return "solid";
  }
  const bodyMin = carY + envelope.yMin;
  const bodyMax = carY + envelope.yMax;
  if (bodyMax > span.min && bodyMin < span.min && carY < span.min) return "ceiling";
  return "solid";
}

/** Smallest t≥0 along unit (nx,nz) that places a point outside a circle. */
export function circleExitDistance(
  px: number,
  pz: number,
  nx: number,
  nz: number,
  cx: number,
  cz: number,
  radius: number,
): number {
  if (![px, pz, nx, nz, cx, cz, radius].every(Number.isFinite) || radius <= 0) return 0;
  const dx = px - cx;
  const dz = pz - cz;
  const b = dx * nx + dz * nz;
  const c = dx * dx + dz * dz - radius * radius;
  if (c >= 0) return 0;
  const disc = b * b - c;
  if (disc < 0) return radius;
  const t = -b + Math.sqrt(disc);
  return t > 0 && Number.isFinite(t) ? t : 0;
}

/** Conservative cylinder footprint: widest pier radius + existing car padding. */
export const PIER_MESH_RADIUS = 0.72;
export const RAMP_SLAB_THICKNESS = 0.95;
export function supportPierCollider(x: number, z: number, top: number): HeightCollider {
  if (![x, z, top].every(Number.isFinite) || top <= 0) {
    throw new Error("Invalid support-pier dimensions");
  }
  return { x, z, r: PIER_MESH_RADIUS + CAR_CONTACT_RADIUS, kind: "barrier",
    vertical: { min: 0, max: top }, role: "support-pier" };
}

export type RampPlane = {
  x: number;
  z: number;
  sx: number;
  sz: number;
  len: number;
  y0: number;
  y1: number;
};

/** Driving-surface height of an Ayalon ramp slab at a world XZ. */
export function rampPlaneY(x: number, z: number, ramp: RampPlane): number {
  const { x: cx, z: cz, sx, sz, len, y0, y1 } = ramp;
  if (![x, z, cx, cz, sx, sz, len, y0, y1].every(Number.isFinite) || len === 0) {
    throw new Error("Invalid ramp plane");
  }
  return (y0 + y1) * 0.5 + ((x - cx) * sx + (z - cz) * sz) * (y1 - y0) / len;
}

/** Push a support off the driven carriageway. Count, radius and mesh pairing stay intact. */
export function offsetSupportPierFromRoute(
  x: number,
  z: number,
  samples: { x: number; z: number; rx: number; rz: number }[],
  width: number,
): { x: number; z: number } {
  if (!samples.length || ![x, z, width].every(Number.isFinite) || width <= 0) return { x, z };
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    const d = Math.hypot(x - sample.x, z - sample.z);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  const s = samples[best];
  if (![s.x, s.z, s.rx, s.rz].every(Number.isFinite)) return { x, z };
  const lateral = (x - s.x) * s.rx + (z - s.z) * s.rz;
  const clearance = width / 2 + PIER_MESH_RADIUS + CAR_CONTACT_RADIUS;
  if (Math.abs(lateral) >= clearance) return { x, z };
  const sign = lateral < 0 ? -1 : 1;
  const extra = clearance - Math.abs(lateral);
  return { x: x + s.rx * sign * extra, z: z + s.rz * sign * extra };
}

/**
 * Carriageway offset plus a top that meets the slab underside at the new XZ.
 * A full offset that would bury the cylinder is scaled back so the pier remains.
 */
export function placeSupportPierOnRamp(
  x: number,
  z: number,
  ramp: RampPlane,
  samples: { x: number; z: number; rx: number; rz: number }[],
  width: number,
): { x: number; z: number; h: number } {
  const originH = rampPlaneY(x, z, ramp) - RAMP_SLAB_THICKNESS;
  const full = offsetSupportPierFromRoute(x, z, samples, width);
  const fullH = rampPlaneY(full.x, full.z, ramp) - RAMP_SLAB_THICKNESS;
  if (fullH > 0) return { x: full.x, z: full.z, h: fullH };
  if (originH <= 0) return { x, z, h: originH };
  const span = fullH - originH;
  const t = span === 0 ? 0 : (1e-6 - originH) / span;
  const clampedT = Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : 0;
  const placed = { x: x + clampedT * (full.x - x), z: z + clampedT * (full.z - z) };
  return { ...placed, h: rampPlaneY(placed.x, placed.z, ramp) - RAMP_SLAB_THICKNESS };
}

export function overheadSlabCollider(
  x: number,
  z: number,
  radius: number,
  min: number,
  max: number,
): HeightCollider {
  if (![x, z, radius, min, max].every(Number.isFinite) || radius <= 0 || max <= min) {
    throw new Error("Invalid overhead-slab dimensions");
  }
  return { x, z, r: radius, kind: "barrier", vertical: { min, max }, role: "overhead-slab" };
}

/** Structural supports must not disappear when nearby spawn scenery is cleared. */
export function preserveColliderAtSpawn(collider: HeightCollider): boolean {
  return collider.role === "support-pier";
}
