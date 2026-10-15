import type { BuiltTrack } from "../spline";
import type { Ramp } from "../types";

/** Preserve a 4.5m driving envelope under decorative interchange ramps. */
export function rampIntrudesOnRaceRoad(built: BuiltTrack, ramp: Ramp): boolean {
  const rx = ramp.sz;
  const rz = -ramp.sx;
  const grade = (ramp.y1 - ramp.y0) / ramp.len;
  for (const sample of built.samples) {
    const dx = sample.x - ramp.x;
    const dz = sample.z - ramp.z;
    const along = dx * ramp.sx + dz * ramp.sz;
    const across = dx * rx + dz * rz;
    const alongRadius = Math.abs(sample.rx * ramp.sx + sample.rz * ramp.sz) * built.width / 2;
    const acrossRadius = Math.abs(sample.rx * rx + sample.rz * rz) * built.width / 2;
    if (Math.abs(along) > ramp.len / 2 + alongRadius || Math.abs(across) > ramp.half + acrossRadius) continue;
    const low = Math.max(-ramp.len / 2, Math.min(ramp.len / 2, along - Math.sign(grade) * alongRadius));
    const underside = (ramp.y0 + ramp.y1) / 2 + low * grade - 0.475;
    if (underside < sample.y + 4.5) return true;
  }
  return false;
}
