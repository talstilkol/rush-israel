import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { bsv } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildBeersheva(context: TrackWorldBuilderContext): void {
  const {
    built,
    add,
    glowAt,
    hit,
    stone,
    copper,
    cream,
    terracotta,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const ch = bsv(31.252, 34.791);
    {
      const n = nearestIndex(built.samples, ch.x, ch.z, 0);
      if (n.dist < built.width / 2 + 12) {
        const s = built.samples[n.index];
        ch.x = s.x + s.rx * (built.width / 2 + 26);
        ch.z = s.z + s.rz * (built.width / 2 + 26);
      }
    }
    const hall = new THREE.Mesh(new THREE.BoxGeometry(9.2, 32, 9.2), cream);
    hall.position.set(ch.x, 16, ch.z);
    add(hall);
    const hall2 = new THREE.Mesh(new THREE.BoxGeometry(14, 8, 14), cream);
    hall2.position.set(ch.x, 4, ch.z);
    add(hall2);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(7.6, 8, 4), copper);
    cap.position.set(ch.x, 36, ch.z);
    add(cap);
    const aw = bsv(31.2435, 34.79);
    const well = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 1.4, 16), stone);
    well.position.set(aw.x, 0.8, aw.z);
    add(well);
    const wellWall = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 2.4, 16, 1, true), stone);
    wellWall.position.set(aw.x, 1.6, aw.z);
    add(wellWall);
    const wellRoof = new THREE.Mesh(new THREE.ConeGeometry(7.2, 3.6, 4), terracotta);
    wellRoof.position.set(aw.x, 4.4, aw.z);
    add(wellRoof);
    const uni = bsv(31.262, 34.801);
    for (let i = 0; i < 4; i++) {
      const campus = new THREE.Mesh(new THREE.BoxGeometry(14, 8 + i, 10), cream);
      campus.position.set(uni.x + i * 8, 4 + i * 0.4, uni.z);
      add(campus);
    }
    glowAt(ch.x, 36, ch.z, 16765056, 36, 28);
    hit(ch.x, ch.z, 8);
    hit(aw.x, aw.z, 8);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
