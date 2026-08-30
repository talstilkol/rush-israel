import * as THREE from "three";
import { hwy2 } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHw2(context: TrackWorldBuilderContext): void {
  const {
    bag,
    add,
    hit,
    stone,
    white,
    cream,
    terracotta,
    paleGlass,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const sandMat = new THREE.MeshStandardMaterial({ color: 15259572, roughness: 1, flatShading: true });
    const palmTrunk = new THREE.MeshStandardMaterial({ color: 6965810, roughness: 0.9 });
    const palmLeaf = new THREE.MeshStandardMaterial({ color: 3107386, roughness: 0.86, flatShading: true });
    bag.push(sandMat, palmTrunk, palmLeaf);
    for (let i = 0; i < 16; i++) {
      const p = hwy2(32.35 + i * 8e-3, 34.848 + i % 3 * 4e-3);
      const dune = new THREE.Mesh(new THREE.SphereGeometry(10 + i % 4 * 3, 7, 5), sandMat);
      dune.scale.y = 0.38;
      dune.position.set(p.x, 2.2, p.z);
      add(dune);
    }
    for (let i = 0; i < 14; i++) {
      const p = hwy2(32.352 + i * 9e-3, 34.862);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 7.2, 6), palmTrunk);
      trunk.position.set(p.x, 3.6, p.z);
      add(trunk);
      for (let f = 0; f < 6; f++) {
        const a = f / 6 * Math.PI * 2;
        const fr = new THREE.Mesh(new THREE.ConeGeometry(0.45, 3.2, 5), palmLeaf);
        fr.rotation.z = 1.05;
        fr.rotation.y = a;
        fr.position.set(p.x + Math.cos(a) * 0.4, 7.4, p.z + Math.sin(a) * 0.4);
        add(fr);
      }
    }
    const nt = hwy2(32.35, 34.868);
    const n1 = new THREE.Mesh(new THREE.BoxGeometry(10, 42, 10), white);
    n1.position.set(nt.x, 21, nt.z);
    add(n1);
    const n2 = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.6, 36, 10), cream);
    n2.position.set(nt.x + 16, 18, nt.z + 6);
    add(n2);
    const n3 = new THREE.Mesh(new THREE.BoxGeometry(8, 28, 12), paleGlass);
    n3.position.set(nt.x - 14, 14, nt.z + 8);
    add(n3);
    const ca = hwy2(32.48, 34.892);
    for (let i = 0; i < 9; i++) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 8.4, 8), stone);
      col.position.set(ca.x - 18 + i * 4.4, 4.4, ca.z + 16);
      add(col);
      if (i < 8) {
        const arch = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.45, 6, 10, Math.PI), stone);
        arch.rotation.z = Math.PI;
        arch.position.set(ca.x - 16 + i * 4.4, 8.4, ca.z + 16);
        add(arch);
      }
    }
    const rest = new THREE.Mesh(new THREE.BoxGeometry(16, 5.4, 10), cream);
    rest.position.set(ca.x, 2.8, ca.z);
    add(rest);
    const restR = new THREE.Mesh(new THREE.BoxGeometry(18, 0.4, 12), terracotta);
    restR.position.set(ca.x, 5.6, ca.z);
    add(restR);
    hit(nt.x, nt.z, 8);
    hit(ca.x, ca.z, 10);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
