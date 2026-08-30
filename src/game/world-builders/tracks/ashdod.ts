import * as THREE from "three";
import { asd } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildAshdod(context: TrackWorldBuilderContext): void {
  const {
    bag,
    add,
    glowAt,
    hit,
    white,
    cream,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const rust = new THREE.MeshStandardMaterial({
      color: 12081714,
      metalness: 0.45,
      roughness: 0.42
    });
    bag.push(rust);
    const quay = asd(31.821, 34.647);
    for (const c of [
      {
        lat: 31.8204,
        lon: 34.6464
      },
      {
        lat: 31.8212,
        lon: 34.647
      },
      {
        lat: 31.822,
        lon: 34.6476
      }
    ]) {
      const p = asd(c.lat, c.lon);
      const crane = new THREE.Mesh(new THREE.BoxGeometry(1.4, 32, 1.4), rust);
      crane.position.set(p.x, 16, p.z);
      add(crane);
      const jib = new THREE.Mesh(new THREE.BoxGeometry(28, 0.8, 0.8), rust);
      jib.position.set(p.x + 14, 32, p.z);
      add(jib);
    }
    glowAt(quay.x, 32, quay.z, 16755302, 36, 26);
    const lightP = asd(31.8198, 34.6458);
    const lightA = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 20, 8), cream);
    lightA.position.set(lightP.x, 10, lightP.z);
    add(lightA);
    const lightCap = new THREE.Mesh(new THREE.ConeGeometry(2.4, 2.8, 8), white);
    lightCap.position.set(lightP.x, 21, lightP.z);
    add(lightCap);
    glowAt(lightP.x, 22, lightP.z, 16771248, 24, 20);
    hit(quay.x, quay.z, 10);
    hit(lightP.x, lightP.z, 6);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
