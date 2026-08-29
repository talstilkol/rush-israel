import * as THREE from "three";
import { hol } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHolon(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    white,
    cream,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const dmH = hol(32.0076, 34.7792);
    const spiral = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 9.4, 12, 10), white);
    spiral.position.set(dmH.x, 7, dmH.z);
    add(spiral);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(8.2, 0.5, 6, 16), white);
    lip.rotation.x = Math.PI / 2;
    lip.position.set(dmH.x, 13, dmH.z);
    add(lip);
    for (const b of [
      {
        lat: 32.0086,
        lon: 34.7798,
        w: 14,
        h: 12,
        d: 10
      },
      {
        lat: 32.0094,
        lon: 34.7786,
        w: 16,
        h: 9,
        d: 12
      },
      {
        lat: 32.0072,
        lon: 34.7778,
        w: 18,
        h: 8,
        d: 11
      }
    ]) {
      const p = hol(b.lat, b.lon);
      const blk = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), cream);
      blk.position.set(p.x, b.h * 0.5, p.z);
      add(blk);
      hit(p.x, p.z, 7);
    }
    glowAt(dmH.x, 14, dmH.z, 15791352, 26, 22);
    hit(dmH.x, dmH.z, 10);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
