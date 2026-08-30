import * as THREE from "three";
import { ksm } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildKshmona(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    stone,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const ridge0 = ksm(33.215, 35.58);
    for (let i = 0; i < 5; i++) {
      const ridge = new THREE.Mesh(new THREE.ConeGeometry(12 + i * 2, 18 + i * 4, 5), new THREE.MeshStandardMaterial({
        color: 5925448,
        roughness: 0.95,
        flatShading: true
      }));
      ridge.position.set(ridge0.x + i * 10, 8 + i, ridge0.z + i % 2 * 16);
      add(ridge);
    }
    const lionP = ksm(33.207, 35.567);
    const lion = new THREE.Mesh(new THREE.BoxGeometry(6, 8, 4), stone);
    lion.position.set(lionP.x, 4.2, lionP.z);
    add(lion);
    glowAt(lionP.x, 8, lionP.z, 16771264, 20, 18);
    hit(lionP.x, lionP.z, 8);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
