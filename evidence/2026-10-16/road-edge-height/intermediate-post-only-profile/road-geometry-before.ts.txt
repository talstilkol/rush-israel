import * as THREE from "three";
import type { BuiltTrack } from "./spline";
import type { TrackDef } from "./types";
import { ROAD_UV_METRES, roadLaneCount } from "./road-layout";

/** Keep surface faces upward even where a wide inner offset folds at a bend.
 * This changes winding only; overlapping route topology needs separate review.
 */
function upwardTriangles(positions: number[], indices: number[]) {
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i] * 3, b = indices[i + 1] * 3, c = indices[i + 2] * 3;
    const abx = positions[b] - positions[a], abz = positions[b + 2] - positions[a + 2];
    const acx = positions[c] - positions[a], acz = positions[c + 2] - positions[a + 2];
    if (abz * acx - abx * acz < 0) {
      const previous = indices[i + 1];
      indices[i + 1] = indices[i + 2];
      indices[i + 2] = previous;
    }
  }
  return indices;
}

export function segsOf(built: BuiltTrack) {
  return built.closed ? built.samples.length : Math.max(1, built.samples.length - 1);
}
export function samp(built: BuiltTrack, i: number) {
  const n = built.samples.length;
  return built.samples[built.closed ? i % n : Math.min(i, n - 1)];
}
export function buildRoad(built: BuiltTrack) {
  const hw = built.width / 2;
  const pos = [];
  const uv = [];
  const nrm = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const v = (i === n ? built.length : s.s) / ROAD_UV_METRES;
    pos.push(s.x - s.rx * hw, s.y + 0.04, s.z - s.rz * hw);
    pos.push(s.x + s.rx * hw, s.y + 0.04, s.z + s.rz * hw);
    uv.push(0, v, 1, v);
    nrm.push(0, 1, 0, 0, 1, 0);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
  geo.setIndex(upwardTriangles(pos, idx));
  geo.computeVertexNormals();
  return geo;
}
export function buildOffsetRoad(built: BuiltTrack, offset: number) {
  const hw = built.width / 2;
  const pos = [];
  const uv = [];
  const nrm = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const v = (i === n ? built.length : s.s) / ROAD_UV_METRES;
    const cx = s.x + s.rx * offset;
    const cz = s.z + s.rz * offset;
    pos.push(cx - s.rx * hw, s.y + 0.04, cz - s.rz * hw);
    pos.push(cx + s.rx * hw, s.y + 0.04, cz + s.rz * hw);
    uv.push(0, v, 1, v);
    nrm.push(0, 1, 0, 0, 1, 0);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
  geo.setIndex(upwardTriangles(pos, idx));
  geo.computeVertexNormals();
  return geo;
}
export function buildStrip(built: BuiltTrack, centerOff: number, half: number, y = 0.02) {
  const pos = [];
  const uv = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const v = (i === n ? built.length : s.s) / 8;
    const cx = s.x + s.rx * centerOff;
    const cz = s.z + s.rz * centerOff;
    pos.push(cx - s.rx * half, s.y + y, cz - s.rz * half);
    pos.push(cx + s.rx * half, s.y + y, cz + s.rz * half);
    uv.push(0, v, 1, v);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(upwardTriangles(pos, idx));
  geo.computeVertexNormals();
  return geo;
}
export function buildCenterLine(built: BuiltTrack) {
  const hw = 0.22;
  const pos = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const w = Math.floor(s.s / 5) % 2 === 0 ? hw : 0.02;
    pos.push(s.x - s.rx * w, s.y + 0.07, s.z - s.rz * w);
    pos.push(s.x + s.rx * w, s.y + 0.07, s.z + s.rz * w);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(upwardTriangles(pos, idx));
  geo.computeVertexNormals();
  return geo;
}
export function buildSidewalk(built: BuiltTrack, side: number) {
  const d0 = built.width / 2 + 0.42;
  const d1 = d0 + 3.2;
  const pos = [];
  const uv = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const v = (i === n ? built.length : s.s) / 8;
    const rx = s.rx * side;
    const rz = s.rz * side;
    pos.push(s.x + rx * d0, s.y + 0.18, s.z + rz * d0);
    pos.push(s.x + rx * d1, s.y + 0.18, s.z + rz * d1);
    uv.push(0, v, 1, v);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    if (side > 0) idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    else idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(upwardTriangles(pos, idx));
  geo.computeVertexNormals();
  return geo;
}
export function buildEdgeLine(built: BuiltTrack, side: number, inset = 0.28, hw = 0.28, yOff = 0.08, centerOff = 0) {
  const d = built.width / 2 - inset;
  const pos = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const cx = s.x + s.rx * (d * side + centerOff);
    const cz = s.z + s.rz * (d * side + centerOff);
    pos.push(cx - s.rx * hw, s.y + yOff, cz - s.rz * hw);
    pos.push(cx + s.rx * hw, s.y + yOff, cz + s.rz * hw);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(upwardTriangles(pos, idx));
  geo.computeVertexNormals();
  return geo;
}
export function laneCountFor(def: TrackDef) {
  return roadLaneCount(def);
}
export function buildCurb(built: BuiltTrack, side: number, centerOff = 0) {
  const d0 = built.width / 2;
  const d1 = d0 + 0.55;
  const pos = [];
  const uv = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const v = (i === n ? built.length : s.s) / 2.4;
    const rx = s.rx * side;
    const rz = s.rz * side;
    pos.push(s.x + rx * d0 + s.rx * centerOff, s.y + 0.06, s.z + rz * d0 + s.rz * centerOff);
    pos.push(s.x + rx * d1 + s.rx * centerOff, s.y + 0.58, s.z + rz * d1 + s.rz * centerOff);
    uv.push(0, v, 1, v);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    if (side > 0) idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    else idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(upwardTriangles(pos, idx));
  geo.computeVertexNormals();
  return geo;
}
export function buildJersey(built: BuiltTrack, side: number, centerOff = 0) {
  const d0 = built.width / 2 + 0.62;
  const d1 = d0 + 0.42;
  const pos = [];
  const idx = [];
  const uvs: number[] = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const rx = s.rx * side;
    const rz = s.rz * side;
    pos.push(s.x + rx * d0 + s.rx * centerOff, s.y + 0.08, s.z + rz * d0 + s.rz * centerOff);
    pos.push(s.x + rx * d1 + s.rx * centerOff, s.y + 1.35, s.z + rz * d1 + s.rz * centerOff);
    const v = i / n * (built.length / 2.4);
    uvs.push(0, v, 1, v);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    if (side > 0) idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    else idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(upwardTriangles(pos, idx));
  geo.computeVertexNormals();
  return geo;
}
export function buildRail(built: BuiltTrack, side: number) {
  const d = built.width / 2 + 0.48;
  const pos = [];
  const idx = [];
  const uvs: number[] = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const rx = s.rx * side;
    const rz = s.rz * side;
    pos.push(s.x + rx * d, s.y + 0.22, s.z + rz * d);
    pos.push(s.x + rx * d, s.y + 0.72, s.z + rz * d);
    const v = i / n * (built.length / 3);
    uvs.push(0, v, 1, v);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    if (side > 0) idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    else idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(upwardTriangles(pos, idx));
  geo.computeVertexNormals();
  return geo;
}
export function buildShoulder(built: BuiltTrack, side: number) {
  const d0 = built.width / 2 + 3.95;
  const d1 = d0 + 8.5;
  const pos = [];
  const uv = [];
  const idx = [];
  const n = segsOf(built);
  for (let i = 0; i <= n; i++) {
    const s = samp(built, i);
    const v = (i === n ? built.length : s.s) / 10;
    const rx = s.rx * side;
    const rz = s.rz * side;
    pos.push(s.x + rx * d0, s.y + 0.03, s.z + rz * d0);
    pos.push(s.x + rx * d1, s.y + 0.01, s.z + rz * d1);
    uv.push(0, v, 1, v);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    if (side > 0) idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    else idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(upwardTriangles(pos, idx));
  geo.computeVertexNormals();
  return geo;
}
