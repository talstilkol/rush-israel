import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { gol } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildGolan(context: TrackWorldBuilderContext): void {
  const {
    bag,
    built,
    add,
    glowAt,
    hit,
    stone,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const basalt = new THREE.MeshStandardMaterial({
      color: 4866104,
      roughness: 0.95,
      flatShading: true
    });
    const grass = new THREE.MeshStandardMaterial({
      color: 4876856,
      roughness: 0.92,
      flatShading: true
    });
    bag.push(basalt, grass);
    const kz = gol(32.992, 35.689);
    {
      const n = nearestIndex(built.samples, kz.x, kz.z, 0);
      if (n.dist < built.width / 2 + 16) {
        const s = built.samples[n.index];
        kz.x = s.x + s.rx * (built.width / 2 + 34);
        kz.z = s.z + s.rz * (built.width / 2 + 34);
      }
    }
    for (let i = 0; i < 8; i++) {
      const hill = new THREE.Mesh(new THREE.ConeGeometry(16 + i * 2, 18 + i * 3.4, 6), i % 2 ? grass : basalt);
      hill.position.set(kz.x + 36 + i % 4 * 18, 9, kz.z - 24 + Math.floor(i / 2) * 26);
      add(hill);
    }
    const keepB = new THREE.Mesh(new THREE.BoxGeometry(22, 12, 18), stone);
    keepB.position.set(kz.x - 20, 8, kz.z + 10);
    add(keepB);
    for (const [dx, dz] of [
      [-9, -7],
      [9, -7],
      [-9, 7],
      [9, 7]
    ]) {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 16, 8), stone);
      t.position.set(kz.x - 20 + dx, 10, kz.z + 10 + dz);
      add(t);
    }
    glowAt(kz.x - 20, 16, kz.z + 10, 16769184, 24, 20);
    hit(kz.x, kz.z, 12);
    hit(kz.x - 20, kz.z + 10, 12);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
