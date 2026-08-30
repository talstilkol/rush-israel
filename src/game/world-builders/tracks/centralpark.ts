import * as THREE from "three";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildCentralpark(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    stone,
    white,
    copper,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const font = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.45, 8, 24), stone);
    font.rotation.x = Math.PI / 2;
    font.position.set(8, 0.6, 12);
    add(font);
    const angel = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 8, 8), copper);
    angel.position.set(8, 5, 12);
    add(angel);
    const gug = new THREE.Mesh(new THREE.CylinderGeometry(10, 6.5, 16, 16), white);
    gug.position.set(52, 8, 40);
    add(gug);
    const gugTop = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 8.4, 6, 16), white);
    gugTop.position.set(52, 18, 40);
    add(gugTop);
    glowAt(8, 8, 12, 16771264, 22, 20);
    hit(52, 40, 10);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
