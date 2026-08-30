import * as THREE from "three";
import { mod } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildModiin(context: TrackWorldBuilderContext): void {
  const {
    add,
    hit,
    cream,
    paleGlass,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const mallP = mod(31.907, 35.007);
    const mall = new THREE.Mesh(new THREE.BoxGeometry(24, 12, 16), cream);
    mall.position.set(mallP.x, 6, mallP.z);
    add(mall);
    const atrium = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 5.4, 11, 12), paleGlass);
    atrium.position.set(mallP.x, 7.2, mallP.z);
    add(atrium);
    hit(mallP.x, mallP.z, 12);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
