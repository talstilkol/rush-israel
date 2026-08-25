import { catmullRom } from "./math";
import type { Sample, TrackDef, Vec2 } from "./types";

export type BuiltTrack = {
  samples: Sample[];
  length: number;
  width: number;
  checkpoints: number[];
  closed: boolean;
};

export function sampleSpline(points: Vec2[], stepsPerSeg = 28, open = false): { x: number; z: number; t: number }[] {
  const n = points.length;
  const segs = open ? Math.max(1, n - 1) : n;
  const out: { x: number; z: number; t: number }[] = [];
  for (let i = 0; i < segs; i++) {
    const p0 = points[open ? Math.max(0, i - 1) : (i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[open ? Math.min(n - 1, i + 1) : (i + 1) % n];
    const p3 = points[open ? Math.min(n - 1, i + 2) : (i + 2) % n];
    for (let s = 0; s < stepsPerSeg; s++) {
      const u = s / stepsPerSeg;
      const t = (i + u) / segs;
      out.push({
        x: catmullRom(p0.x, p1.x, p2.x, p3.x, u),
        z: catmullRom(p0.z, p1.z, p2.z, p3.z, u),
        t,
      });
    }
  }
  if (open) {
    const last = points[n - 1];
    out.push({ x: last.x, z: last.z, t: 1 });
  }
  return out;
}

export function buildTrack(def: TrackDef): BuiltTrack {
  const closed = !def.open;
  const raw = sampleSpline(def.points, 30, !!def.open);
  const samples: Sample[] = [];
  let length = 0;
  const tmp: { x: number; z: number; y: number; t: number; ds: number }[] = [];

  for (let i = 0; i < raw.length; i++) {
    const a = raw[i];
    const b = raw[closed ? (i + 1) % raw.length : Math.min(i + 1, raw.length - 1)];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const ds = Math.hypot(dx, dz) || 0.01;
    tmp.push({ x: a.x, z: a.z, y: def.elevation(a.t), t: a.t, ds });
    length += ds;
  }

  let s = 0;
  for (let i = 0; i < tmp.length; i++) {
    const prev = tmp[closed ? (i - 1 + tmp.length) % tmp.length : Math.max(0, i - 1)];
    const next = tmp[closed ? (i + 1) % tmp.length : Math.min(tmp.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dz = next.z - prev.z;
    const hyp = Math.hypot(dx, dz) || 1;
    let tx = dx / hyp;
    let tz = dz / hyp;
    let rx = tz;
    let rz = -tx;
    if (i > 0) {
      const p = samples[i - 1];
      if (rx * p.rx + rz * p.rz < 0) {
        rx = -rx;
        rz = -rz;
      }
    }
    const a = tmp[i];
    samples.push({ x: a.x, y: a.y, z: a.z, tx, tz, rx, rz, t: a.t, s });
    s += a.ds;
  }
  if (closed && samples.length > 1) {
    const first = samples[0];
    const last = samples[samples.length - 1];
    if (first.rx * last.rx + first.rz * last.rz < 0) {
      last.rx = -last.rx;
      last.rz = -last.rz;
    }
  }

  const checkpoints: number[] = [];
  for (let i = 0; i < def.checkpointCount; i++) {
    checkpoints.push(closed ? i / def.checkpointCount : (i + 1) / (def.checkpointCount + 0.15));
  }

  return { samples, length, width: Math.max(18.5, def.width), checkpoints, closed };
}

export function nearestIndex(samples: Sample[], x: number, z: number, hint: number, closed = true) {
  const n = samples.length;
  const origin = Math.max(0, Math.min(n - 1, ((hint % n) + n) % n));
  let bestI = origin;
  let bestCost = Infinity;
  const window = 88;
  for (let k = -window; k <= window; k++) {
    const i = closed ? ((origin + k) % n + n) % n : Math.max(0, Math.min(n - 1, origin + k));
    const s = samples[i];
    const d = (s.x - x) * (s.x - x) + (s.z - z) * (s.z - z);
    const cost = d + k * k * 0.55;
    if (cost < bestCost) {
      bestCost = cost;
      bestI = i;
    }
  }
  const bestD = (samples[bestI].x - x) * (samples[bestI].x - x) + (samples[bestI].z - z) * (samples[bestI].z - z);
  if (bestD > 140 * 140) {
    for (let i = 0; i < n; i += 2) {
      const s = samples[i];
      const d = (s.x - x) * (s.x - x) + (s.z - z) * (s.z - z);
      const jump = Math.min(Math.abs(i - origin), n - Math.abs(i - origin));
      const cost = d + jump * jump * 0.25;
      if (cost < bestCost) {
        bestCost = cost;
        bestI = i;
      }
    }
  }
  const s = samples[bestI];
  return { index: bestI, dist: Math.hypot(s.x - x, s.z - z) };
}

export function sampleAtT(samples: Sample[], t: number): Sample {
  const n = samples.length;
  const u = ((t % 1) + 1) % 1;
  const idx = Math.min(n - 1, Math.floor(u * n));
  return samples[idx];
}
