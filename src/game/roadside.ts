import type { BuiltTrack } from "./spline";
import { closestSample, sampleAtT } from "./spline";

/** A real roadside point must also clear other nearby folds of the route. */
export function clearRoadsidePoint(built: BuiltTrack, t: number, preferredSide: number, radius: number, allowOpposite = true) {
  const s = sampleAtT(built.samples, t);
  const required = built.width / 2 + radius + 2;
  const count = built.closed ? built.samples.length : built.samples.length - 1;
  for (let extra = 8; extra <= 80; extra += 6) for (const side of allowOpposite ? [preferredSide, -preferredSide] : [preferredSide]) {
    const distance = built.width / 2 + extra;
    const x = s.x + s.rx * distance * side, z = s.z + s.rz * distance * side;
    let clear = true;
    for (let i = 0; i < count; i++) {
      const a = built.samples[i], b = built.samples[(i + 1) % built.samples.length];
      const dx = b.x - a.x, dz = b.z - a.z;
      const u = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz || 1)));
      if (Math.hypot(x - a.x - dx * u, z - a.z - dz * u) < required) { clear = false; break; }
    }
    if (clear) return { x, z };
  }
  throw new Error(`No clear roadside point on route at ${t}`);
}

/** Bound the full curved road and its elevation range inside a straight tunnel. */
export function fitRoadTunnel(built: BuiltTrack, x: number, z: number, length: number, minimumHalf: number, clearance: number) {
  const sample = built.samples[closestSample(built.samples, x, z).index];
  const yaw = Math.atan2(sample.tx, sample.tz);
  const fx = Math.sin(yaw), fz = Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
  let half = minimumHalf, floor = sample.y, top = sample.y;
  for (const road of built.samples) {
    if (Math.abs(road.s - sample.s) > length / 2 + built.width) continue;
    for (const side of [-1, 1]) {
      const dx = road.x + road.rx * built.width / 2 * side - sample.x;
      const dz = road.z + road.rz * built.width / 2 * side - sample.z;
      if (Math.abs(dx * fx + dz * fz) > length / 2 + 2) continue;
      half = Math.max(half, Math.abs(dx * rx + dz * rz) + 2);
      floor = Math.min(floor, road.y);
      top = Math.max(top, road.y);
    }
  }
  return { sample, yaw, length, half, height: top - floor + clearance, floor };
}
