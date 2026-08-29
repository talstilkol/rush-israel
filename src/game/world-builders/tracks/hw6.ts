import * as THREE from "three";
import { hwy6 } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHw6(context: TrackWorldBuilderContext): void {
  const {
    bag,
    add,
    hit,
    wood,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const conc = new THREE.MeshStandardMaterial({ color: 12105908, roughness: 0.7 });
    const olive = new THREE.MeshStandardMaterial({ color: 4874808, roughness: 0.9, flatShading: true });
    const greenSign = new THREE.MeshStandardMaterial({ color: 1731130, roughness: 0.55 });
    bag.push(conc, olive, greenSign);
    const ks = hwy6(32.134, 34.932);
    const over = new THREE.Mesh(new THREE.BoxGeometry(42, 1.6, 12), conc);
    over.position.set(ks.x, 9.2, ks.z);
    add(over);
    for (const side of [-1, 1]) {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(3.6, 9, 3.6), conc);
      pier.position.set(ks.x + side * 18, 4.6, ks.z);
      add(pier);
      const ramp = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 28), conc);
      ramp.position.set(ks.x + side * 22, 4.4, ks.z);
      ramp.rotation.z = side * 0.18;
      add(ramp);
    }
    const ey = hwy6(32.21, 34.978);
    const gantry = new THREE.Mesh(new THREE.BoxGeometry(28, 0.6, 1.4), conc);
    gantry.position.set(ey.x, 8.2, ey.z);
    add(gantry);
    for (const side of [-1, 1]) {
      const pole = new THREE.Mesh(new THREE.BoxGeometry(0.6, 8.2, 0.6), conc);
      pole.position.set(ey.x + side * 13, 4.2, ey.z);
      add(pole);
    }
    const sign = new THREE.Mesh(new THREE.BoxGeometry(10, 2.4, 0.2), greenSign);
    sign.position.set(ey.x, 8.2, ey.z + 0.8);
    add(sign);
    const nc = hwy6(32.062, 34.948);
    const gantry2 = new THREE.Mesh(new THREE.BoxGeometry(26, 0.5, 1.2), conc);
    gantry2.position.set(nc.x, 7.8, nc.z);
    add(gantry2);
    for (let i = 0; i < 24; i++) {
      const p = hwy6(32.09 + i % 8 * 8e-3, 34.956 + Math.floor(i / 8) * 0.01);
      const tree = new THREE.Mesh(new THREE.SphereGeometry(2.2 + i % 3 * 0.4, 6, 5), olive);
      tree.position.set(p.x, 2.4, p.z);
      add(tree);
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.28, 2.6, 5), wood);
      tr.position.set(p.x, 1.2, p.z);
      add(tr);
    }
    hit(ks.x, ks.z, 8);
    hit(ey.x, ey.z, 4);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
