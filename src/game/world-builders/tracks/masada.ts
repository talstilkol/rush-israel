import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { mas } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildMasada(context: TrackWorldBuilderContext): void {
  const {
    bag,
    built,
    add,
    glowAt,
    hit,
    stone,
    cream,
    terracotta,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const ft = mas(31.3157, 35.3538);
    {
      const n = nearestIndex(built.samples, ft.x, ft.z, 0);
      if (n.dist < built.width / 2 + 40) {
        const s = built.samples[n.index];
        ft.x = s.x + s.rx * (built.width / 2 + 58);
        ft.z = s.z + s.rz * (built.width / 2 + 58);
      }
    }
    const mesaRock = new THREE.MeshStandardMaterial({
      color: 0xa08058,
      roughness: 0.96,
      flatShading: true
    });
    const mesaDark = new THREE.MeshStandardMaterial({
      color: 0x6e5438,
      roughness: 0.97,
      flatShading: true
    });
    bag.push(mesaRock, mesaDark);
    const mesa = new THREE.Mesh(new THREE.CylinderGeometry(38, 52, 44, 8), mesaRock);
    mesa.position.set(ft.x, 22, ft.z);
    add(mesa);
    const plateau = new THREE.Mesh(new THREE.CylinderGeometry(34, 36, 3.2, 8), stone);
    plateau.position.set(ft.x, 45.2, ft.z);
    add(plateau);
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + Math.PI / 8;
      const spur = new THREE.Mesh(new THREE.BoxGeometry(18, 16, 10), i % 2 ? mesaDark : mesaRock);
      spur.position.set(ft.x + Math.cos(a) * 40, 14, ft.z + Math.sin(a) * 28);
      spur.rotation.y = a;
      add(spur);
    }
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      const merlon = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.4, 2.2), stone);
      merlon.position.set(ft.x + Math.cos(a) * 32, 48.2, ft.z + Math.sin(a) * 24);
      merlon.rotation.y = a;
      add(merlon);
    }
    const store = new THREE.Mesh(new THREE.BoxGeometry(28, 4.2, 8), stone);
    store.position.set(ft.x - 4, 48.4, ft.z - 6);
    add(store);
    for (let i = 0; i < 5; i++) {
      const hall = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.6, 14), stone);
      hall.position.set(ft.x - 16 + i * 7, 48.2, ft.z + 8);
      add(hall);
    }
    const np = mas(31.3172, 35.3536);
    for (let i = 0; i < 3; i++) {
      const w = 16 - i * 3.2;
      const terrace = new THREE.Mesh(new THREE.BoxGeometry(w, 3.4, 8 - i * 0.8), stone);
      terrace.position.set(np.x, 42 - i * 9, np.z + 8 + i * 7);
      add(terrace);
      const colN = 4 - i;
      for (let c = 0; c < colN; c++) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 4.8, 8), cream);
        col.position.set(np.x - w * 0.32 + c * (w * 0.64 / Math.max(1, colN - 1)), 45.2 - i * 9, np.z + 8 + i * 7);
        add(col);
      }
    }
    const vis = mas(31.3102, 35.3648);
    const vc = new THREE.Mesh(new THREE.BoxGeometry(14, 4.2, 10), cream);
    vc.position.set(vis.x, 2.2, vis.z);
    add(vc);
    const vcRoof = new THREE.Mesh(new THREE.BoxGeometry(15, 0.4, 11), terracotta);
    vcRoof.position.set(vis.x, 4.4, vis.z);
    add(vcRoof);
    glowAt(ft.x, 50, ft.z, 16769184, 40, 32);
    hit(ft.x, ft.z, 22);
    hit(np.x, np.z + 12, 6);
    hit(vis.x, vis.z, 6);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
