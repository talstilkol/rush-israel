import * as THREE from "three";
import { rml } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildRamla(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    stone,
    white,
    cream,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const tw = rml(31.9294, 34.866);
    const tower = new THREE.Mesh(new THREE.BoxGeometry(5.2, 28, 5.2), cream);
    tower.position.set(tw.x, 14, tw.z);
    add(tower);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.2, 6.2), cream);
    cap.position.set(tw.x, 29, tw.z);
    add(cap);
    const ms = rml(31.9278, 34.8668);
    const mosque = new THREE.Mesh(new THREE.BoxGeometry(18, 10, 14), stone);
    mosque.position.set(ms.x, 6, ms.z);
    add(mosque);
    const mdome = new THREE.Mesh(new THREE.SphereGeometry(5.4, 12, 8), white);
    mdome.position.set(ms.x, 13, ms.z);
    add(mdome);
    glowAt(tw.x, 30, tw.z, 16771264, 28, 24);
    hit(tw.x, tw.z, 8);
    hit(ms.x, ms.z, 10);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
