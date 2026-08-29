import * as THREE from "three";
import { raa } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildRaanana(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    white,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const park = raa(32.185, 34.853);
    for (let i = 0; i < 12; i++) {
      const tree = new THREE.Mesh(new THREE.ConeGeometry(2.2, 7, 6), new THREE.MeshStandardMaterial({
        color: 2779704,
        roughness: 0.88
      }));
      tree.position.set(park.x - 10 + i % 4 * 8, 3.6, park.z + Math.floor(i / 4) * 10);
      add(tree);
    }
    const mallP = raa(32.184, 34.865);
    const mall = new THREE.Mesh(new THREE.BoxGeometry(28, 10, 16), white);
    mall.position.set(mallP.x, 5, mallP.z);
    add(mall);
    glowAt(mallP.x, 10, mallP.z, 15791352, 22, 20);
    hit(mallP.x, mallP.z, 12);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
