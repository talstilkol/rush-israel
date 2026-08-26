/** 21.18 / Codex 65: analog stick, no FFB. */
export function padCurve(x: number, dead = 0.12, exp = 1.6) {
  if (Math.abs(x) <= dead) return 0;
  const s = x < 0 ? -1 : 1;
  return s * Math.pow(Math.abs(x), exp);
}
