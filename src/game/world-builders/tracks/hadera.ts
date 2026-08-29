import * as THREE from "three";
import { hdr } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHadera(context: TrackWorldBuilderContext): void {
  const {
    bag,
    add,
    glowAt,
    hit,
    cream,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const rust = new THREE.MeshStandardMaterial({
      color: 12081714,
      metalness: 0.35,
      roughness: 0.48
    });
    bag.push(rust);
    const plant = hdr(32.47, 34.888);
    const stacks = [hdr(32.4698, 34.8874), hdr(32.4704, 34.8886)];
    for (const p of stacks) {
      const stack = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 4.4, 52, 12), rust);
      stack.position.set(p.x, 26, p.z);
      add(stack);
    }
    const hall = new THREE.Mesh(new THREE.BoxGeometry(28, 10, 16), cream);
    hall.position.set(plant.x, 5, plant.z + 16);
    add(hall);
    glowAt(plant.x, 50, plant.z, 16746564, 36, 40);
    hit(plant.x, plant.z, 14);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
