import * as THREE from "three";
import { hwy90 } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHw90(context: TrackWorldBuilderContext): void {
  const {
    bag,
    add,
    hit,
    cream,
    terracotta,
    wood,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const red = new THREE.MeshStandardMaterial({ color: 11565650, roughness: 0.95, flatShading: true });
    const date = new THREE.MeshStandardMaterial({ color: 3107386, roughness: 0.86, flatShading: true });
    bag.push(red, date);
    for (let i = 0; i < 10; i++) {
      const p = hwy90(30.66 + i * 0.012, 35.255 + i % 2 * 0.018);
      const mtn = new THREE.Mesh(new THREE.ConeGeometry(16 + i % 4 * 6, 22 + i % 5 * 8, 5), red);
      mtn.position.set(p.x, 10 + i % 3 * 4, p.z);
      add(mtn);
    }
    for (let i = 0; i < 12; i++) {
      const p = hwy90(30.668 + i * 8e-3, 35.228);
      const cliff = new THREE.Mesh(new THREE.BoxGeometry(14, 12 + i % 4 * 4, 8), red);
      cliff.position.set(p.x, 6 + i % 4 * 2, p.z);
      add(cliff);
    }
    for (let i = 0; i < 16; i++) {
      const p = hwy90(30.7 + i % 8 * 6e-3, 35.244 + Math.floor(i / 8) * 8e-3);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 8.4, 6), wood);
      trunk.position.set(p.x, 4.2, p.z);
      add(trunk);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(2.4, 6, 5), date);
      crown.position.set(p.x, 8.8, p.z);
      add(crown);
    }
    const stopP = hwy90(30.748, 35.268);
    const stop = new THREE.Mesh(new THREE.BoxGeometry(14, 5.2, 10), cream);
    stop.position.set(stopP.x, 2.7, stopP.z);
    add(stop);
    const stopR = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 12), terracotta);
    stopR.position.set(stopP.x, 5.5, stopP.z);
    add(stopR);
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 6.4, 12), cream);
    tank.position.set(stopP.x + 12, 3.2, stopP.z);
    add(tank);
    hit(stopP.x, stopP.z, 8);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
