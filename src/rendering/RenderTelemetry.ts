/** G0-03: rolling frame times. No GPU timer query yet (WebGL2 optional). */
const CAP = 120;

function pct(sorted: number[], p: number) {
  if (!sorted.length) return 0;
  const i = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[i];
}

export type TelemetrySnap = {
  n: number;
  p50: number;
  p95: number;
  p99: number;
  last: number;
  backend: "webgl2" | "webgl1" | "unknown";
};

export class RenderTelemetry {
  private buf: number[] = [];
  private i = 0;
  private filled = 0;
  last = 0;
  backend: TelemetrySnap["backend"] = "unknown";

  constructor() {
    this.buf = new Array(CAP).fill(0);
  }

  push(ms: number) {
    this.last = ms;
    this.buf[this.i] = ms;
    this.i = (this.i + 1) % CAP;
    if (this.filled < CAP) this.filled++;
  }

  snapshot(): TelemetrySnap {
    const slice = this.buf.slice(0, this.filled).sort((a, b) => a - b);
    return {
      n: this.filled,
      p50: +pct(slice, 50).toFixed(2),
      p95: +pct(slice, 95).toFixed(2),
      p99: +pct(slice, 99).toFixed(2),
      last: +this.last.toFixed(2),
      backend: this.backend,
    };
  }
}
