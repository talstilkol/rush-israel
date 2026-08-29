import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { tzf } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildTzfat(context: TrackWorldBuilderContext): void {
  const {
    bag,
    built,
    add,
    glowAt,
    hit,
    stone,
    gold,
    cream,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const ct = tzf(32.967, 35.495);
    {
      const n = nearestIndex(built.samples, ct.x, ct.z, 0);
      if (n.dist < built.width / 2 + 14) {
        const s = built.samples[n.index];
        ct.x = s.x + s.rx * (built.width / 2 + 28);
        ct.z = s.z + s.rz * (built.width / 2 + 28);
      }
    }
    const cit = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 9.6, 14, 8), stone);
    cit.position.set(ct.x, 9, ct.z);
    add(cit);
    const citTop = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 8.4, 5, 8), stone);
    citTop.position.set(ct.x, 18.5, ct.z);
    add(citTop);
    const blue = new THREE.MeshStandardMaterial({
      color: 3108528,
      roughness: 0.42,
      metalness: 0.14,
      envMapIntensity: 0.75
    });
    const wash = new THREE.MeshStandardMaterial({
      color: 14214384,
      roughness: 0.7
    });
    bag.push(blue, wash);
    const aq = tzf(32.966, 35.493);
    for (const s of [
      {
        lat: 32.9683,
        lon: 35.4926
      },
      {
        lat: 32.9686,
        lon: 35.4938
      },
      {
        lat: 32.9674,
        lon: 35.493
      },
      {
        lat: 32.9692,
        lon: 35.492
      }
    ]) {
      const p = tzf(s.lat, s.lon);
      const syn = new THREE.Mesh(new THREE.BoxGeometry(11, 8, 11), stone);
      syn.position.set(p.x, 5, p.z);
      add(syn);
      const d = new THREE.Mesh(new THREE.SphereGeometry(4.6, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), blue);
      d.position.set(p.x, 9.2, p.z);
      add(d);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 1.8, 8), gold);
      cap.position.set(p.x, 14.2, p.z);
      add(cap);
      hit(p.x, p.z, 7);
    }
    const houses = [
      {
        lat: 32.9664,
        lon: 35.4922,
        h: 6
      },
      {
        lat: 32.9668,
        lon: 35.4934,
        h: 5.4
      },
      {
        lat: 32.9676,
        lon: 35.4942,
        h: 7.2
      },
      {
        lat: 32.9688,
        lon: 35.4918,
        h: 5.8
      },
      {
        lat: 32.9658,
        lon: 35.4938,
        h: 6.4
      }
    ];
    for (let i = 0; i < houses.length; i++) {
      const h = houses[i];
      const p = tzf(h.lat, h.lon);
      const house = new THREE.Mesh(new THREE.BoxGeometry(6.5, h.h, 7), i % 2 ? wash : cream);
      house.position.set(p.x, h.h * 0.5, p.z);
      add(house);
      const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.2), blue);
      door.position.set(p.x, 1.2, p.z + 3.6);
      add(door);
      hit(p.x, p.z, 4);
    }
    glowAt(aq.x, 14, aq.z, 6727912, 32, 26);
    hit(ct.x, ct.z, 10);
    hit(aq.x, aq.z, 14);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
