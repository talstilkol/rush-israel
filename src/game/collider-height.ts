import type { Collider } from "./types";

export type HeightCollider = Collider & {
  vertical?: { min: number; max: number };
  role?: "support-pier";
};

// Explicit arcade proxy, not a full pitched/rolled render-mesh envelope. Existing
// rectangular contacts already use the same 1.05-unit horizontal car padding.
export const CAR_CONTACT_RADIUS = 1.05;
export const CAR_CONTACT_HEIGHT = 1.6;

/** Unbounded legacy colliders retain their original all-height semantics. */
export function overlapsColliderHeight(collider: HeightCollider, carY: number): boolean {
  const span = collider.vertical;
  if (!span) return true;
  // Malformed bounds must not turn an obstacle into a pass-through object.
  if (![span.min, span.max, carY].every(Number.isFinite) || span.max <= span.min) return true;
  // Contact exactly at an endpoint has no positive-volume intersection.
  return carY < span.max && carY + CAR_CONTACT_HEIGHT > span.min;
}

/** Conservative cylinder footprint: widest pier radius + existing car padding. */
export function supportPierCollider(x: number, z: number, top: number): HeightCollider {
  if (![x, z, top].every(Number.isFinite) || top <= 0) {
    throw new Error("Invalid support-pier dimensions");
  }
  return { x, z, r: 0.72 + CAR_CONTACT_RADIUS, kind: "barrier",
    vertical: { min: 0, max: top }, role: "support-pier" };
}

/** Structural supports must not disappear when nearby spawn scenery is cleared. */
export function preserveColliderAtSpawn(collider: HeightCollider): boolean {
  return collider.role === "support-pier";
}
