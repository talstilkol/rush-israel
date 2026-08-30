import * as THREE from "three";
import { afl } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildAfula(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    cream,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const ctr = afl(32.61, 35.29);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(16, 1.1, 8, 28), cream);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(ctr.x, 0.4, ctr.z);
    add(ring);
    const gb = afl(32.55, 35.33);
    const gilboa = new THREE.Mesh(new THREE.ConeGeometry(22, 28, 5), new THREE.MeshStandardMaterial({
      color: 8022600,
      roughness: 0.95,
      flatShading: true
    }));
    gilboa.position.set(gb.x, 12, gb.z);
    add(gilboa);
    glowAt(ctr.x, 2, ctr.z, 16771264, 18, 22);
    hit(gb.x, gb.z, 16);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
