import * as THREE from "three";
import { nah } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildNahariya(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    white,
    wood,
    cyan,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const canalP = nah(33.006, 35.094);
    const canal = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.25, 160), cyan);
    canal.position.set(canalP.x, 0.12, canalP.z);
    add(canal);
    for (let i = 0; i < 8; i++) {
      const palm = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.4, 8, 6), wood);
      palm.position.set(canalP.x + (i % 2 ? 8 : -8), 4, canalP.z - 70 + i * 18);
      add(palm);
      const fr = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.2, 6), new THREE.MeshStandardMaterial({
        color: 2779704,
        roughness: 0.88
      }));
      fr.position.set(canalP.x + (i % 2 ? 8 : -8), 9, canalP.z - 70 + i * 18);
      add(fr);
    }
    const hotelP = nah(33.0082, 35.0924);
    const hotelN = new THREE.Mesh(new THREE.BoxGeometry(14, 16, 10), white);
    hotelN.position.set(hotelP.x, 8, hotelP.z);
    add(hotelN);
    glowAt(canalP.x, 4, canalP.z, 6736096, 22, 28);
    hit(hotelP.x, hotelP.z, 8);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
