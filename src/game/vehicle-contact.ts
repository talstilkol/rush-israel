/** Upright solid visual bounds, in the car's physics frame (metres). */
export type VehicleContactBounds = {
  minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number;
};
type Body = { x: number; y: number; z: number; yaw: number; contactBounds?: VehicleContactBounds };
const LEGACY_RADIUS = 2.45;

export function contactProjection(car: Body, nx: number, nz: number) {
  const b = car.contactBounds;
  if (!b) return { center: car.x * nx + car.z * nz, radius: LEGACY_RADIUS / 2 };
  const c = Math.cos(car.yaw), s = Math.sin(car.yaw);
  const right = c * nx - s * nz, back = s * nx + c * nz;
  return {
    center: car.x * nx + car.z * nz + right * (b.minX + b.maxX) / 2 + back * (b.minZ + b.maxZ) / 2,
    radius: Math.abs(right) * (b.maxX - b.minX) / 2 + Math.abs(back) * (b.maxZ - b.minZ) / 2,
  };
}

export function contactHeightOverlaps(a: Body, b: Body) {
  if (!a.contactBounds || !b.contactBounds) return Math.abs(a.y - b.y) <= 4;
  return a.y + a.contactBounds.minY < b.y + b.contactBounds.maxY && b.y + b.contactBounds.minY < a.y + a.contactBounds.maxY;
}

/** SAT minimum translation for the two upright, yaw-oriented solid boxes. */
export function vehicleContact(a: Body, b: Body): { nx: number; nz: number; depth: number } | undefined {
  if (!contactHeightOverlaps(a, b)) return;
  // Standalone CPU callers without visuals retain their old circle envelope.
  // Every engine-owned racer, traffic vehicle and cop binds its actual visual.
  if (!a.contactBounds || !b.contactBounds) {
    const dx = a.x - b.x, dz = a.z - b.z, distance = Math.hypot(dx, dz);
    if (distance >= LEGACY_RADIUS) return;
    return { nx: distance > 1e-8 ? dx / distance : 1, nz: distance > 1e-8 ? dz / distance : 0, depth: LEGACY_RADIUS - distance };
  }
  let depth = Infinity, nx = 0, nz = 0;
  for (const yaw of [a.yaw, b.yaw]) for (const axis of [[Math.cos(yaw), -Math.sin(yaw)], [Math.sin(yaw), Math.cos(yaw)]]) {
    const pa = contactProjection(a, axis[0], axis[1]), pb = contactProjection(b, axis[0], axis[1]);
    const delta = pa.center - pb.center, overlap = pa.radius + pb.radius - Math.abs(delta);
    if (overlap <= 1e-7) return;
    if (overlap < depth) {
      depth = overlap;
      const direction = delta < 0 ? -1 : 1;
      nx = axis[0] * direction; nz = axis[1] * direction;
    }
  }
  return { nx, nz, depth };
}
