import * as THREE from "three";
import type { BuiltTrack } from "../spline";
import { samp, segsOf } from "../road-geometry";

export function buildRamonCliff(built: BuiltTrack, valley: { x: number; z: number }) {
  const cPos = [];
  const cIdx = [];
  const sides: number[] = [];
  const nC = segsOf(built);
  for (let i = 0; i <= nC; i++) {
    const s = samp(built, i);
    const vs = s.rx * (valley.x - s.x) + s.rz * (valley.z - s.z) >= 0 ? 1 : -1;
    const ms = -vs;
    sides.push(ms);
    const d = built.width / 2 + 9.5;
    const y0 = s.y - 4;
    const y1 = s.y + 150 + Math.min(90, s.y * 0.55);
    cPos.push(s.x + s.rx * d * ms, y0, s.z + s.rz * d * ms);
    cPos.push(s.x + s.rx * d * ms, y1, s.z + s.rz * d * ms);
  }
  for (let i = 0; i < nC; i++) {
    // A switch from one roadside to the other is a break in the cliff,
    // not a wall connecting across the racing surface.
    if (sides[i] !== sides[i + 1]) continue;
    const a = i * 2;
    if (sides[i] > 0) cIdx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    else cIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const cGeo = new THREE.BufferGeometry();
  cGeo.setAttribute("position", new THREE.Float32BufferAttribute(cPos, 3));
  cGeo.setIndex(cIdx);
  cGeo.computeVertexNormals();
  return cGeo;
}
