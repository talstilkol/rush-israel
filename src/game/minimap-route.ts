export type MinimapPoint = { x: number; z: number };
type PathContext = Pick<CanvasRenderingContext2D, "beginPath" | "moveTo" | "lineTo" | "closePath">;

/** Downsample without omitting the finish point on an open route. */
export function sampleMinimapPolyline(samples: readonly MinimapPoint[], open: boolean): MinimapPoint[] {
  const points: MinimapPoint[] = [];
  for (let i = 0; i < samples.length; i += 4) points.push({ x: samples[i].x, z: samples[i].z });
  if (open && samples.length > 0 && (samples.length - 1) % 4 !== 0) {
    const last = samples[samples.length - 1];
    points.push({ x: last.x, z: last.z });
  }
  return points;
}

export function drawMinimapRoute(
  context: PathContext, points: readonly MinimapPoint[],
  mx: (x: number) => number, mz: (z: number) => number, open: boolean,
) {
  context.beginPath();
  points.forEach((point, index) => {
    if (index === 0) context.moveTo(mx(point.x), mz(point.z));
    else context.lineTo(mx(point.x), mz(point.z));
  });
  if (!open && points.length > 1) context.closePath();
}

/** Open routes clamp at their finish; only closed circuits wrap back to the start. */
export function minimapPreviewIndices(pointCount: number, progress: number, open: boolean): number[] {
  if (!Number.isSafeInteger(pointCount) || pointCount < 1) return [];
  const safeProgress = Number.isFinite(progress) ? progress : 0;
  const start = open
    ? Math.floor(Math.max(0, Math.min(1, safeProgress)) * (pointCount - 1))
    : Math.floor(((safeProgress % 1 + 1) % 1) * pointCount);
  const requested = Math.min(pointCount, Math.max(8, Math.floor(pointCount * 0.32)));
  const count = open ? Math.min(requested, pointCount - start) : requested;
  return Array.from({ length: count }, (_, offset) => open ? start + offset : (start + offset) % pointCount);
}
