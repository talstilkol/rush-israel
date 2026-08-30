import * as THREE from "three";
import { rhv } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildRehovot(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    white,
    cream,
    terracotta,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const wz = rhv(31.9078, 34.818);
    const house = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 8.4, 8, 16), cream);
    house.position.set(wz.x, 5, wz.z);
    add(house);
    const roof = new THREE.Mesh(new THREE.SphereGeometry(8.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), terracotta);
    roof.position.set(wz.x, 9, wz.z);
    add(roof);
    for (const lb of [
      {
        lat: 31.9082,
        lon: 34.8112,
        w: 16,
        h: 9,
        d: 10
      },
      {
        lat: 31.909,
        lon: 34.8098,
        w: 14,
        h: 11,
        d: 12
      },
      {
        lat: 31.9074,
        lon: 34.8106,
        w: 18,
        h: 8,
        d: 10
      },
      {
        lat: 31.9086,
        lon: 34.8122,
        w: 12,
        h: 14,
        d: 10
      }
    ]) {
      const p = rhv(lb.lat, lb.lon);
      const lab = new THREE.Mesh(new THREE.BoxGeometry(lb.w, lb.h, lb.d), white);
      lab.position.set(p.x, lb.h * 0.5, p.z);
      add(lab);
      hit(p.x, p.z, 8);
    }
    glowAt(wz.x, 12, wz.z, 16771264, 28, 22);
    hit(wz.x, wz.z, 10);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
