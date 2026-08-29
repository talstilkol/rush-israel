import * as THREE from "three";
import { nik } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHanikra(context: TrackWorldBuilderContext): void {
  const {
    bag,
    add,
    glowAt,
    hit,
    stone,
    white,
    cyan,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const chalk = new THREE.MeshStandardMaterial({
      color: 15789282,
      roughness: 0.9,
      envMapIntensity: 0.22
    });
    const darkCave = new THREE.MeshStandardMaterial({
      color: 920586,
      roughness: 1
    });
    bag.push(chalk, darkCave);
    const cl = nik(33.093, 35.104);
    for (let i = 0; i < 10; i++) {
      const h = 18 + i % 4 * 6;
      const cliff = new THREE.Mesh(new THREE.BoxGeometry(22, h, 12), chalk);
      cliff.position.set(cl.x, h * 0.4, cl.z - 28 + i * 11);
      add(cliff);
      const cave = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 10, 12), darkCave);
      cave.rotation.z = Math.PI / 2;
      cave.position.set(cl.x - 10, 3.6 + i % 3, cl.z - 28 + i * 11);
      add(cave);
      if (i % 2 === 0) {
        const cave2 = new THREE.Mesh(new THREE.SphereGeometry(3.4, 10, 8), darkCave);
        cave2.position.set(cl.x - 8, 6, cl.z - 24 + i * 11);
        add(cave2);
      }
    }
    const portal = new THREE.Mesh(new THREE.BoxGeometry(10, 7, 14), stone);
    portal.position.set(cl.x + 14, 3.6, cl.z);
    add(portal);
    const arch = new THREE.Mesh(new THREE.BoxGeometry(5, 4.4, 8), darkCave);
    arch.position.set(cl.x + 14, 3.2, cl.z);
    add(arch);
    for (let i = 0; i < 4; i++) {
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.6, 3.4), white);
      cabin.position.set(cl.x + 2 - i * 8, 12 + i * 4, cl.z + 10);
      add(cabin);
      const win = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 0.15), cyan);
      win.position.set(cl.x + 2 - i * 8, 12.1 + i * 4, cl.z + 11.8);
      add(win);
    }
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 42, 5), new THREE.MeshStandardMaterial({
      color: 3355184,
      metalness: 0.7,
      roughness: 0.3
    }));
    cable.rotation.z = 0.55;
    cable.position.set(cl.x - 8, 20, cl.z + 10);
    add(cable);
    glowAt(cl.x, 10, cl.z, 16771248, 24, 20);
    hit(cl.x, cl.z, 14);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
