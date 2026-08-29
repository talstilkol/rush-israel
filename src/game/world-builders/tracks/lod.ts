import * as THREE from "three";
import { lodp } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildLod(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    stone,
    white,
    cream,
    paleGlass,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const tw = lodp(31.9514, 34.8882);
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.2, 28, 10), cream);
    tower.position.set(tw.x, 14, tw.z);
    add(tower);
    const church = new THREE.Mesh(new THREE.BoxGeometry(16, 10, 12), stone);
    church.position.set(tw.x + 8, 5.2, tw.z + 4);
    add(church);
    const term = lodp(31.978, 34.888);
    const hall = new THREE.Mesh(new THREE.BoxGeometry(36, 8, 16), white);
    hall.position.set(term.x, 4.2, term.z);
    add(hall);
    const cab = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.6, 4, 12), paleGlass);
    cab.position.set(term.x, 22, term.z);
    add(cab);
    glowAt(term.x, 24, term.z, 8967408, 28, 24);
    hit(tw.x, tw.z, 8);
    hit(term.x, term.z, 12);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
