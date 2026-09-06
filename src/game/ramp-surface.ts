/** Fit a fresh, centred box to the horizontal footprint used by vehicle.probeRamp. */
type RampSlabGeometry = {
  getAttribute(name: string): {
    count: number;
    getY(index: number): number;
    getZ(index: number): number;
    setY(index: number, value: number): unknown;
    needsUpdate: boolean;
  };
  computeVertexNormals(): void;
  computeBoundingBox(): void;
  computeBoundingSphere(): void;
};

export function fitRampSlab<T extends RampSlabGeometry>(
  geometry: T,
  length: number,
  rise: number,
  thickness: number,
  topOffset = 0,
): T {
  if (!Number.isFinite(length) || length <= 0 || !Number.isFinite(rise) ||
      !Number.isFinite(thickness) || thickness <= 0 || !Number.isFinite(topOffset)) {
    throw new RangeError("Ramp slab requires finite values and positive length/thickness");
  }
  const position = geometry.getAttribute("position");
  if (!position) throw new TypeError("Ramp slab requires position vertices");
  // Shear, do not pitch: len is the horizontal run, not the tilted hypotenuse.
  // The upper surface lies at rise * z / length + topOffset, including the ends.
  const slope = rise / length;
  for (let i = 0; i < position.count; i++) {
    position.setY(i, position.getY(i) + slope * position.getZ(i) - thickness / 2 + topOffset);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}
