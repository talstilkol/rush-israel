export const TAU = Math.PI * 2;

export function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function lerpColor(a: number, b: number, t: number) {
  const u = clamp(t, 0, 1);
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(ar + (br - ar) * u);
  const g = Math.round(ag + (bg - ag) * u);
  const bl = Math.round(ab + (bb - ab) * u);
  return (r << 16) | (g << 8) | bl;
}

export function expSmooth(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export function wrapPi(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

export function wrap01(t: number) {
  t %= 1;
  return t < 0 ? t + 1 : t;
}

export function forwardDelta(from: number, to: number, closed = true) {
  let d = to - from;
  if (closed) {
    if (d < -0.5) d += 1;
    if (d > 0.5) d -= 1;
  }
  return d;
}

export function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash01(...parts: number[]) {
  let h = 2166136261;
  for (const p of parts) {
    h ^= p | 0;
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

export function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967296;
}

export function errorId(msg: string) {
  let h = 2166136261;
  for (let i = 0; i < msg.length; i++) h = Math.imul(h ^ msg.charCodeAt(i), 16777619);
  return `E-${(h >>> 0).toString(16).padStart(8, "0")}`;
}

export function formatDelta(sec: number) {
  const sign = sec > 0.04 ? "+" : sec < -0.04 ? "−" : "";
  return `${sign}${formatTime(Math.abs(sec))}`;
}

export function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "—";
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;
  const whole = Math.floor(s);
  const ms = Math.floor((s - whole) * 100);
  return `${m}:${whole.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}
