import * as THREE from "three";
import { rsh } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildRishon(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    stone,
    white,
    terracotta,
    wood,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const gs = rsh(31.9638, 34.8045);
    const syn = new THREE.Mesh(new THREE.BoxGeometry(16, 11, 14), stone);
    syn.position.set(gs.x, 5.6, gs.z);
    add(syn);
    for (const sx of [-7, 7]) {
      const tw = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 16, 8), stone);
      tw.position.set(gs.x + sx, 9, gs.z + 6);
      add(tw);
      const twCap = new THREE.Mesh(new THREE.ConeGeometry(2.1, 3.2, 4), terracotta);
      twCap.position.set(gs.x + sx, 18.4, gs.z + 6);
      add(twCap);
    }
    const dome = new THREE.Mesh(new THREE.SphereGeometry(5.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), white);
    dome.position.set(gs.x, 11, gs.z);
    add(dome);
    const wn = rsh(31.9618, 34.8072);
    const cellar = new THREE.Mesh(new THREE.BoxGeometry(20, 7, 12), wood);
    cellar.position.set(wn.x, 3.6, wn.z);
    add(cellar);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 4, 10), wood);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(wn.x, 1.8, wn.z + 8);
    add(barrel);
    glowAt(gs.x, 16, gs.z, 16771264, 24, 20);
    hit(gs.x, gs.z, 10);
    hit(wn.x, wn.z, 10);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
