import * as THREE from "three";
import { hwy40 } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHw40(context: TrackWorldBuilderContext): void {
  const {
    add,
    hit,
    stone,
    cream,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const hutP = hwy40(30.847, 34.781);
    const hut = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 8), cream);
    hut.position.set(hutP.x, 2.2, hutP.z);
    add(hut);
    const avP = hwy40(30.794, 34.773);
    const avdat = new THREE.Mesh(new THREE.BoxGeometry(16, 6, 12), stone);
    avdat.position.set(avP.x, 3.2, avP.z);
    add(avdat);
    hit(hutP.x, hutP.z, 8);
    hit(avP.x, avP.z, 10);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
