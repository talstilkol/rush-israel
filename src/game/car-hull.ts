import type { Collider } from "./types";
import {
  CAR_CONTACT_HEIGHT,
  CAR_CONTACT_RADIUS,
  CAR_HALF_LENGTH,
  CAR_HALF_WIDTH,
  PIER_MESH_RADIUS,
  overlapsColliderHeight,
  type HeightCollider,
  type VehicleEnvelope,
} from "./collider-height";

export type CarBodyKind = "gt" | "hatch" | "rally" | "super" | "muscle" | "ev";

export type VisualHull = {
  halfLength: number;
  halfWidth: number;
  yMin: number;
  yMax: number;
};

/** Length/width/roof copied from car-mesh layout() and carShape(). Tests fail closed on drift. */
export const CAR_MESH_LAYOUT = {
  hatch: { L: 4.08, W: 1.76, wheelY: 0.32, cabinH: 0.62, bodyH: 0.58, roof: 1.34 },
  muscle: { L: 4.82, W: 1.9, wheelY: 0.34, cabinH: 0.46, bodyH: 0.52, roof: 1.12 },
  rally: { L: 4.32, W: 1.84, wheelY: 0.38, cabinH: 0.64, bodyH: 0.62, roof: 1.4 },
  super: { L: 4.52, W: 1.96, wheelY: 0.3, cabinH: 0.36, bodyH: 0.42, roof: 0.98 },
  gt: { L: 4.5, W: 1.82, wheelY: 0.33, cabinH: 0.54, bodyH: 0.56, roof: 1.3 },
  ev: { L: 4.5, W: 1.82, wheelY: 0.33, cabinH: 0.54, bodyH: 0.56, roof: 1.3 },
} as const;

const FAIL_CLOSED: VisualHull = { halfLength: 8, halfWidth: 4, yMin: -1, yMax: 4 };
const LENGTH_EXTRA = 0.13;
const MIRROR_LATERAL = 0.54;
const MIRROR_HALF = 0.035;
const MAX_PITCH = 0.75;
const MAX_ROLL = 0.34;

export function visualHull(kind: CarBodyKind | string): VisualHull {
  const layout = CAR_MESH_LAYOUT[(kind as CarBodyKind) in CAR_MESH_LAYOUT ? (kind as CarBodyKind) : "gt"];
  if (![layout.L, layout.W, layout.roof].every(Number.isFinite) || layout.L <= 0 || layout.W <= 0 || layout.roof <= 0) {
    return { ...FAIL_CLOSED };
  }
  let halfWidth = layout.W / 2;
  halfWidth = Math.max(halfWidth, layout.W * MIRROR_LATERAL + MIRROR_HALF);
  if (kind === "rally") halfWidth = Math.max(halfWidth, layout.W * 0.52 + 0.08);
  if (kind === "super") halfWidth = Math.max(halfWidth, (layout.W * 1.02) / 2);
  return {
    halfLength: layout.L / 2 + LENGTH_EXTRA,
    halfWidth,
    yMin: 0,
    yMax: layout.roof,
  };
}

export function arcadeProxyIsNotMesh(hull: VisualHull): boolean {
  return !hull
    || !Number.isFinite(hull.halfLength)
    || hull.halfLength > CAR_HALF_LENGTH
    || hull.halfLength > CAR_CONTACT_RADIUS;
}

export function visualEnvelope(kind: CarBodyKind | string, pitch = 0, roll = 0): VehicleEnvelope {
  const hull = visualHull(kind);
  if (![pitch, roll].every(Number.isFinite)) return visualEnvelope(kind, MAX_PITCH, MAX_ROLL);
  if (pitch === 0 && roll === 0) return { yMin: hull.yMin, yMax: hull.yMax };
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  let yMin = Infinity;
  let yMax = -Infinity;
  for (const long of [-hull.halfLength, hull.halfLength]) {
    for (const lat of [-hull.halfWidth, hull.halfWidth]) {
      for (const y of [hull.yMin, hull.yMax]) {
        const yPitched = y * cp - long * sp;
        const yRolled = yPitched * cr - lat * sr;
        if (yRolled < yMin) yMin = yRolled;
        if (yRolled > yMax) yMax = yRolled;
      }
    }
  }
  if (!Number.isFinite(yMin) || !Number.isFinite(yMax) || yMax < yMin) {
    return visualEnvelope(kind, MAX_PITCH, MAX_ROLL);
  }
  return { yMin, yMax };
}

export type ObstacleFootprint =
  | { kind: "invalid" }
  | { kind: "circle"; r: number }
  | { kind: "obb"; hx: number; hz: number; yaw: number };

export function obstacleFootprint(collider: HeightCollider | Collider | null | undefined): ObstacleFootprint {
  const c = collider as HeightCollider | undefined;
  if (!c || ![c.x, c.z].every(Number.isFinite)) return { kind: "invalid" };
  if (c.hx != null && c.hz != null) {
    if (![c.hx, c.hz].every(Number.isFinite) || c.hx <= 0 || c.hz <= 0) return { kind: "invalid" };
    const yaw = Number.isFinite(c.yaw) ? (c.yaw as number) : 0;
    return { kind: "obb", hx: c.hx, hz: c.hz, yaw };
  }
  const r = c.role === "support-pier"
    ? PIER_MESH_RADIUS
    : Number.isFinite(c.r) && c.r > CAR_CONTACT_RADIUS
      ? c.r - CAR_CONTACT_RADIUS
      : c.r;
  if (!Number.isFinite(r) || r <= 0) return { kind: "invalid" };
  return { kind: "circle", r };
}

function visualOverlapsCircle(
  along: number,
  across: number,
  hull: VisualHull,
  radius: number,
): boolean {
  const dx = Math.max(0, Math.abs(along) - hull.halfLength);
  const dz = Math.max(0, Math.abs(across) - hull.halfWidth);
  return dx * dx + dz * dz < radius * radius;
}

function visualOverlapsObb(
  carX: number,
  carZ: number,
  yaw: number,
  hull: VisualHull,
  ox: number,
  oz: number,
  oYaw: number,
  hx: number,
  hz: number,
): boolean {
  const axes = [
    { x: -Math.sin(yaw), z: -Math.cos(yaw), h: hull.halfLength },
    { x: -Math.cos(yaw), z: Math.sin(yaw), h: hull.halfWidth },
    { x: Math.cos(oYaw), z: -Math.sin(oYaw), h: hx },
    { x: Math.sin(oYaw), z: Math.cos(oYaw), h: hz },
  ];
  const dx = carX - ox;
  const dz = carZ - oz;
  for (const axis of axes) {
    const mag = Math.hypot(axis.x, axis.z);
    if (mag < 1e-12) return true;
    const nx = axis.x / mag;
    const nz = axis.z / mag;
    let carProj = 0;
    let obsProj = 0;
    for (const other of axes.slice(0, 2)) carProj += Math.abs(nx * other.x + nz * other.z) * other.h;
    for (const other of axes.slice(2)) obsProj += Math.abs(nx * other.x + nz * other.z) * other.h;
    if (Math.abs(nx * dx + nz * dz) >= carProj + obsProj) return false;
  }
  return true;
}

export function visualOverlapsCollider(
  car: { x: number; y: number; z: number; yaw: number; pitch?: number; roll?: number; body?: string },
  collider: HeightCollider | Collider,
  kind: CarBodyKind | string = car.body ?? "gt",
): boolean {
  if (![car?.x, car?.y, car?.z, car?.yaw].every(Number.isFinite)) return true;
  const hull = visualHull(kind);
  const env = visualEnvelope(kind, car.pitch ?? 0, car.roll ?? 0);
  if (overlapsColliderHeight(collider as HeightCollider, car.y, env) === false) return false;
  const foot = obstacleFootprint(collider);
  if (foot.kind === "invalid") return true;
  const fx = -Math.sin(car.yaw);
  const fz = -Math.cos(car.yaw);
  const rx = fz;
  const rz = -fx;
  const dx = (collider as Collider).x - car.x;
  const dz = (collider as Collider).z - car.z;
  if (foot.kind === "circle") {
    return visualOverlapsCircle(dx * fx + dz * fz, dx * rx + dz * rz, hull, foot.r);
  }
  return visualOverlapsObb(car.x, car.z, car.yaw, hull, (collider as Collider).x, (collider as Collider).z, foot.yaw, foot.hx, foot.hz);
}

export function arcadeCircleMissesFrontPole(distance = 1.6, radius = 0.4): boolean {
  return ![distance, radius].every(Number.isFinite)
    || distance <= 0
    || radius <= 0
    || Math.hypot(distance, 0) >= CAR_CONTACT_RADIUS + radius;
}

export const ARCADE_BOX = {
  halfLength: CAR_HALF_LENGTH,
  halfWidth: CAR_HALF_WIDTH,
  yMin: 0,
  yMax: CAR_CONTACT_HEIGHT,
  radius: CAR_CONTACT_RADIUS,
} as const;
