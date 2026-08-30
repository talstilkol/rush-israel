import * as THREE from "three";
import { ksb } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildKsaba(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    stone,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const pk = ksb(32.175, 34.908);
    const garden = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 0.3, 16), new THREE.MeshStandardMaterial({
      color: 3832386,
      roughness: 0.9
    }));
    garden.position.set(pk.x, 0.15, pk.z);
    add(garden);
    const obelisk = new THREE.Mesh(new THREE.BoxGeometry(1.4, 12, 1.4), stone);
    obelisk.position.set(pk.x, 6, pk.z);
    add(obelisk);
    glowAt(pk.x, 12, pk.z, 16771264, 18, 16);
    hit(pk.x, pk.z, 8);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
