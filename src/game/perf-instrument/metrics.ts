/** Canonical performance instrumentation lock (RSH-037). */

export const PERF_INSTRUMENT_GIS_CLAIM = false;
export const PERF_INSTRUMENT_OWNER_FREEZE = false;
export const PERF_INSTRUMENT_PUBLIC_DISTRIBUTION = false;
export const PERF_SAMPLE_CAP = 120;
export const FRAME_PERCENTILES = [50, 95, 99] as const;
export const PERF_METRICS = ["p50", "p95", "p99", "drawCalls", "triangles", "memory"] as const;
export const DRAW_CALL_SOURCE = "renderer.info.render.calls" as const;
export const TRIANGLE_SOURCE = "renderer.info.render.triangles" as const;
export const MEMORY_TEXTURES_SOURCE = "renderer.info.memory.textures" as const;
export const MEMORY_GEOMETRIES_SOURCE = "renderer.info.memory.geometries" as const;
export const JS_HEAP_SOURCE = "performance.memory?.usedJSHeapSize" as const;
export const TELEMETRY_MODULE = "src/rendering/RenderTelemetry.ts" as const;
export const BUDGETS_ENFORCED = false;
export const QUALITY_PROFILES_DEFINED = false;
export const REAL_DEVICE_BASELINE_ACCEPTED = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";

export type PerfMemorySnap = {
  textures: number;
  geometries: number;
  usedJSHeapSize: number | null;
};

export type PerfSnap = {
  n: number;
  p50: number;
  p95: number;
  p99: number;
  last: number;
  drawCalls: number;
  triangles: number;
  memory: PerfMemorySnap;
};

export function percentile(sorted: number[], p: number): number {
  if (!sorted.length) return 0;
  const i = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[i];
}

export function sampleGpuMemory(info: { memory?: { textures?: number; geometries?: number } }): Pick<PerfMemorySnap, "textures" | "geometries"> {
  return {
    textures: info.memory?.textures ?? 0,
    geometries: info.memory?.geometries ?? 0,
  };
}

export function sampleJsHeap(perf: { memory?: { usedJSHeapSize?: number } } | undefined): number | null {
  const value = perf?.memory?.usedJSHeapSize;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function canonicalPerfDigest(): string {
  return [
    "sample_cap=120",
    "percentiles=50,95,99",
    "draw_calls=renderer.info.render.calls",
    "triangles=renderer.info.render.triangles",
    "memory_textures=renderer.info.memory.textures",
    "memory_geometries=renderer.info.memory.geometries",
    "js_heap=optional_performance_memory",
    "budgets_enforced=false",
    "quality_profiles=false",
    "real_device_baseline=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}
