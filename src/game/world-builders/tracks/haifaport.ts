import * as THREE from "three";
import { hai } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildHaifaport(context: TrackWorldBuilderContext): void {
  const {
    bag,
    add,
    glowAt,
    hit,
    stone,
    terracotta,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const rust = new THREE.MeshStandardMaterial({
      color: 12081714,
      metalness: 0.45,
      roughness: 0.42
    });
    bag.push(rust);
    const pt = hai(32.819, 35.004);
    for (const c of [
      {
        lat: 32.8186,
        lon: 35.0028
      },
      {
        lat: 32.819,
        lon: 35.004
      },
      {
        lat: 32.8194,
        lon: 35.0052
      }
    ]) {
      const p = hai(c.lat, c.lon);
      const crane = new THREE.Mesh(new THREE.BoxGeometry(1.4, 34, 1.4), rust);
      crane.position.set(p.x, 17, p.z);
      add(crane);
      const jib = new THREE.Mesh(new THREE.BoxGeometry(36, 0.9, 0.9), rust);
      jib.position.set(p.x + 16, 34, p.z);
      add(jib);
    }
    const colony = [
      {
        lat: 32.8194,
        lon: 34.9892,
        w: 9,
        h: 8
      },
      {
        lat: 32.8198,
        lon: 34.99,
        w: 10,
        h: 9
      },
      {
        lat: 32.82,
        lon: 34.9908,
        w: 8.4,
        h: 7.6
      },
      {
        lat: 32.8192,
        lon: 34.9914,
        w: 11,
        h: 8.8
      }
    ];
    for (let i = 0; i < colony.length; i++) {
      const c = colony[i];
      const p = hai(c.lat, c.lon);
      const house = new THREE.Mesh(new THREE.BoxGeometry(c.w, c.h, 10), stone);
      house.position.set(p.x, c.h * 0.5, p.z);
      add(house);
      const rf = new THREE.Mesh(new THREE.ConeGeometry(c.w * 0.7, 3, 4), terracotta);
      rf.rotation.y = Math.PI / 4;
      rf.position.set(p.x, c.h + 1.5, p.z);
      add(rf);
      hit(p.x, p.z, 5);
    }
    glowAt(pt.x, 34, pt.z, 16755302, 40, 28);
    hit(pt.x, pt.z, 10);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
