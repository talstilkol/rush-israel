import * as THREE from "three";
import { tib } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildTiberias(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    stone,
    white,
    cream,
    wood,
    cyan,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const pr = tib(32.788, 35.543);
    const wall = new THREE.Mesh(new THREE.BoxGeometry(80, 1.15, 3.4), stone);
    wall.position.set(pr.x, 0.7, pr.z);
    add(wall);
    for (let i = 0; i < 8; i++) {
      const palm = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 7, 6), wood);
      palm.position.set(pr.x - 28 + i * 8, 3.6, pr.z + 4);
      add(palm);
      const frond = new THREE.Mesh(new THREE.SphereGeometry(1.8, 6, 4), new THREE.MeshStandardMaterial({
        color: 3832392,
        roughness: 0.9
      }));
      frond.position.set(pr.x - 28 + i * 8, 7.6, pr.z + 4);
      add(frond);
    }
    const hm = tib(32.7685, 35.549);
    const bath = new THREE.Mesh(new THREE.CylinderGeometry(8, 8.6, 5, 12), stone);
    bath.position.set(hm.x, 2.6, hm.z);
    add(bath);
    const bathPool = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 5.4, 0.4, 12), cyan);
    bathPool.position.set(hm.x, 0.3, hm.z);
    add(bathPool);
    const sp = tib(32.7865, 35.5425);
    const peter = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 10), cream);
    peter.position.set(sp.x, 4.2, sp.z);
    add(peter);
    const peterD = new THREE.Mesh(new THREE.SphereGeometry(3.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), white);
    peterD.position.set(sp.x, 8.4, sp.z);
    add(peterD);
    const cas = tib(32.786, 35.5412);
    const castle = new THREE.Mesh(new THREE.BoxGeometry(14, 10, 12), stone);
    castle.position.set(cas.x, 5.2, cas.z);
    add(castle);
    glowAt(pr.x, 10, pr.z, 16771264, 22, 18);
    hit(pr.x, pr.z, 8);
    hit(hm.x, hm.z, 9);
    hit(sp.x, sp.z, 7);
    hit(cas.x, cas.z, 8);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
