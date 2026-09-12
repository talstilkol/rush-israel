/** A material owns its daytime colour; procedural water has no catalogue-body index. */
export type WaterClockMaterial = {
  color: { setHex(value: number): unknown; multiplyScalar(value: number): unknown };
  envMapIntensity: number;
  roughness: number;
  opacity: number;
};
export type WaterClockEntry = {
  readonly material: WaterClockMaterial;
  readonly baseColor: number;
};

/** Reapply the existing water clock recipe from the base colour on every update. */
export function applyWaterClock(entries: readonly WaterClockEntry[], nightAmount: number): void {
  if (!Number.isFinite(nightAmount)) throw new RangeError('Water night amount must be finite');
  const n = Math.max(0, Math.min(1, nightAmount));
  for (const { material, baseColor } of entries) {
    material.color.setHex(baseColor);
    if (n > 0.35) material.color.multiplyScalar(1 + (0.5 - 1) * n);
    material.envMapIntensity = 1.7 + (2.6 - 1.7) * n;
  }
}
