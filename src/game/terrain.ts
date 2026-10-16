import * as THREE from "three";
import type { BuiltTrack } from "./spline";
import type { TrackDef } from "./types";
import { ram, her } from "./tracks";

const BASE_FLOOR = -0.4;
const FLOOR = BASE_FLOOR + 0.05;
const CELL = 12;

/** A single-valued surface derived from the existing fictional route heights.
 * A Cartesian grid cannot fold over itself when the road doubles back.
 * This is game terrain, not surveyed geographic elevation data.
 */
export function buildTerrain(def: TrackDef, built: BuiltTrack) {
  const outer = def.id === "ramon" ? 280 : def.id === "hermon" ? 250 : def.theme === "carmel" ? 160 : 78;
  const valley = def.id === "ramon" ? ram(30.585, 34.802)
    : def.id === "hermon" ? her(33.3112, 35.79)
      : def.water ?? built.samples[built.samples.length - 1];
  const samples = built.samples;
  const margin = outer + CELL * 2;
  const minX = Math.floor((Math.min(...samples.map(s => s.x)) - margin) / CELL) * CELL;
  const minZ = Math.floor((Math.min(...samples.map(s => s.z)) - margin) / CELL) * CELL;
  const nx = Math.ceil((Math.max(...samples.map(s => s.x)) + margin - minX) / CELL);
  const nz = Math.ceil((Math.max(...samples.map(s => s.z)) + margin - minZ) / CELL);
  const positions = new Float32Array((nx + 1) * (nz + 1) * 3);
  const indices: number[] = [];
  const inner = built.width / 2 + 1.2;
  // Every corner of a cell touching the road lies within this radius.
  // Lower all such corners beneath the lowest nearby road endpoint, so
  // interpolation cannot lift a slope triangle over the driving surface.
  const supportRadius = built.width / 2 + Math.SQRT2 * CELL + 2;
  const supportRadiusSq = supportRadius * supportRadius;
  const segmentCount = built.closed ? samples.length : samples.length - 1;
  for (let iz = 0; iz <= nz; iz++) {
    for (let ix = 0; ix <= nx; ix++) {
      const x = minX + ix * CELL, z = minZ + iz * CELL;
      let distanceSq = Infinity, roadY = 0, lateral = 0, rightX = 0, rightZ = 0, roadX = 0, roadZ = 0;
      let supportY = Infinity;
      for (let i = 0; i < segmentCount; i++) {
        const a = samples[i], b = samples[(i + 1) % samples.length];
        const dx = b.x - a.x, dz = b.z - a.z;
        const lengthSq = dx * dx + dz * dz;
        const t = lengthSq ? Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / lengthSq)) : 0;
        const px = a.x + dx * t, pz = a.z + dz * t;
        const dSq = (x - px) ** 2 + (z - pz) ** 2;
        if (dSq <= supportRadiusSq) supportY = Math.min(supportY, a.y - 0.15, b.y - 0.15);
        if (dSq >= distanceSq) continue;
        distanceSq = dSq;
        roadY = a.y + (b.y - a.y) * t;
        rightX = a.rx + (b.rx - a.rx) * t;
        rightZ = a.rz + (b.rz - a.rz) * t;
        roadX = px; roadZ = pz;
        lateral = (x - px) * rightX + (z - pz) * rightZ;
      }
      const distance = Math.sqrt(distanceSq);
      let valleySide = rightX * (valley.x - roadX) + rightZ * (valley.z - roadZ) >= 0 ? 1 : -1;
      if (def.id === "hermon") valleySide *= -1;
      const mountainY = def.id === "ramon" ? roadY + 180 + Math.min(110, roadY * 0.7)
        : def.id === "masada" ? roadY + 28 + roadY * 0.35
          : def.id === "hermon" ? roadY + 148 + roadY * 0.6
            : def.theme === "carmel" ? roadY + 78 : roadY + 8;
      const edgeY = Math.sign(lateral) === valleySide ? Math.max(-0.35, roadY * 0.05 - 2) : mountainY;
      const fraction = Math.max(0, Math.min(1, (distance - inner) / (outer - inner)));
      const blend = fraction * fraction * (3 - 2 * fraction);
      let y = roadY - 0.15 + (edgeY - roadY + 0.15) * blend;
      if (distance > outer) {
        const fade = Math.min(1, (distance - outer) / (CELL * 2));
        y += (FLOOR - y) * fade * fade * (3 - 2 * fade);
      }
      y = Math.min(y, supportY);
      const index = (iz * (nx + 1) + ix) * 3;
      positions[index] = x; positions[index + 1] = y; positions[index + 2] = z;
      if (ix < nx && iz < nz) {
        const a = iz * (nx + 1) + ix, b = a + 1, c = a + nx + 1, d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  // Match the actual triangulated Float32 mesh, not an analytic approximation.
  function heightAt(x: number, z: number): number {
    const gx = (x - minX) / CELL, gz = (z - minZ) / CELL;
    if (gx < 0 || gz < 0 || gx > nx || gz > nz) return BASE_FLOOR;
    const ix = Math.min(nx - 1, Math.floor(gx)), iz = Math.min(nz - 1, Math.floor(gz));
    const u = gx - ix, v = gz - iz, a = iz * (nx + 1) + ix;
    const ya = positions[a * 3 + 1], yb = positions[(a + 1) * 3 + 1];
    const yc = positions[(a + nx + 1) * 3 + 1], yd = positions[(a + nx + 2) * 3 + 1];
    return u + v <= 1 ? ya + (yb - ya) * u + (yc - ya) * v
      : yd + (yc - yd) * (1 - u) + (yb - yd) * (1 - v);
  }
  /** Extrema of the rendered surface under an axis-aligned building footprint.
   * A clipped linear triangle reaches its extrema at polygon vertices: box
   * corners, grid crossings, and triangle-diagonal/box-edge intersections.
   */
  function boundsForBox(x: number, z: number, hx: number, hz: number) {
    if (![x, z, hx, hz].every(Number.isFinite) || hx < 0 || hz < 0) {
      throw new RangeError("Invalid terrain footprint");
    }
    const left = x - hx, right = x + hx, back = z - hz, front = z + hz;
    const xs = new Set([left, right]), zs = new Set([back, front]);
    for (let i = Math.max(0, Math.ceil((left - minX) / CELL)); i <= Math.min(nx, Math.floor((right - minX) / CELL)); i++) xs.add(minX + i * CELL);
    for (let i = Math.max(0, Math.ceil((back - minZ) / CELL)); i <= Math.min(nz, Math.floor((front - minZ) / CELL)); i++) zs.add(minZ + i * CELL);
    let min = Infinity, max = -Infinity;
    const note = (px: number, pz: number) => {
      const y = Math.max(BASE_FLOOR, heightAt(px, pz));
      min = Math.min(min, y); max = Math.max(max, y);
    };
    for (const px of xs) for (const pz of zs) note(px, pz);
    const firstX = Math.max(0, Math.floor((left - minX) / CELL));
    const lastX = Math.min(nx - 1, Math.floor((right - minX) / CELL));
    const firstZ = Math.max(0, Math.floor((back - minZ) / CELL));
    const lastZ = Math.min(nz - 1, Math.floor((front - minZ) / CELL));
    for (let ix = firstX; ix <= lastX; ix++) for (let iz = firstZ; iz <= lastZ; iz++) {
      const cx = minX + ix * CELL, cz = minZ + iz * CELL;
      const diagonal = cx + cz + CELL;
      for (const px of [left, right]) {
        const pz = diagonal - px;
        if (px >= cx && px <= cx + CELL && pz >= cz && pz <= cz + CELL && pz >= back && pz <= front) note(px, pz);
      }
      for (const pz of [back, front]) {
        const px = diagonal - pz;
        if (pz >= cz && pz <= cz + CELL && px >= cx && px <= cx + CELL && px >= left && px <= right) note(px, pz);
      }
    }
    return { min, max };
  }
  return { geometry, heightAt, boundsForBox };
}
