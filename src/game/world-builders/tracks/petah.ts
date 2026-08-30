import * as THREE from "three";
import { pth } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildPetah(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    white,
    cream,
    paleGlass,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const mallP = pth(32.091, 34.887);
    const mall = new THREE.Mesh(new THREE.BoxGeometry(32, 12, 22), cream);
    mall.position.set(mallP.x, 6.2, mallP.z);
    add(mall);
    const atrium = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 6.4, 10, 12), paleGlass);
    atrium.position.set(mallP.x, 8, mallP.z);
    add(atrium);
    const hospP = pth(32.09, 34.867);
    const hosp = new THREE.Mesh(new THREE.BoxGeometry(22, 18, 14), white);
    hosp.position.set(hospP.x, 9.2, hospP.z);
    add(hosp);
    const wing = new THREE.Mesh(new THREE.BoxGeometry(28, 10, 10), white);
    wing.position.set(hospP.x + 8, 5.2, hospP.z + 10);
    add(wing);
    glowAt(mallP.x, 14, mallP.z, 16764040, 36, 24);
    hit(mallP.x, mallP.z, 12);
    hit(hospP.x, hospP.z, 10);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
