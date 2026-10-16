import type { BuiltTrack } from "./spline";
import { sampleAtT } from "./spline";

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
