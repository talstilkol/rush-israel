import * as THREE from "three";
import { nearestIndex } from "../../spline";
import { eil } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildEilat(context: TrackWorldBuilderContext): void {
  const {
    built,
    add,
    glowAt,
    hit,
    white,
    cream,
    wood,
    cyan,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const mar = eil(29.5482, 34.9542);
    {
      const n = nearestIndex(built.samples, mar.x, mar.z, 0);
      if (n.dist < built.width / 2 + 10) {
        const s = built.samples[n.index];
        mar.x = s.x + s.rx * (built.width / 2 + 24);
        mar.z = s.z + s.rz * (built.width / 2 + 24);
      }
    }
    const nb = eil(29.5585, 34.96);
    for (let i = 0; i < 7; i++) {
      const mtn = new THREE.Mesh(new THREE.ConeGeometry(18 + i * 3, 22 + i * 6, 5), new THREE.MeshStandardMaterial({
        color: 10771002,
        roughness: 0.95,
        flatShading: true,
        envMapIntensity: 0.2
      }));
      mtn.position.set(mar.x + 80 + i * 18, 10 + i, mar.z - 20 + i % 3 * 30);
      add(mtn);
    }
    const pier = new THREE.Mesh(new THREE.BoxGeometry(5, 0.45, 36), wood);
    pier.position.set(mar.x - 12, 0.22, mar.z);
    add(pier);
    for (const ht of [
      {
        lat: 29.5578,
        lon: 34.9612,
        w: 12,
        h: 26,
        d: 9
      },
      {
        lat: 29.5564,
        lon: 34.9604,
        w: 11,
        h: 22,
        d: 9
      },
      {
        lat: 29.5586,
        lon: 34.9592,
        w: 14,
        h: 32,
        d: 10,
        round: true
      },
      {
        lat: 29.5552,
        lon: 34.9618,
        w: 13,
        h: 24,
        d: 9
      }
    ]) {
      const p = eil(ht.lat, ht.lon);
      if (ht.round) {
        const king = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 8, ht.h, 12), white);
        king.position.set(p.x, ht.h * 0.5, p.z);
        add(king);
        const kingHat = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 6.2, 3.2, 12), cream);
        kingHat.position.set(p.x, ht.h + 1.6, p.z);
        add(kingHat);
      } else {
        const hotel = new THREE.Mesh(new THREE.BoxGeometry(ht.w, ht.h, ht.d), cream);
        hotel.position.set(p.x, ht.h * 0.5, p.z);
        add(hotel);
        for (let f = 0; f < 6; f++) {
          const band = new THREE.Mesh(new THREE.BoxGeometry(ht.w + 0.3, 0.16, ht.d + 0.3), cyan);
          band.position.set(p.x, 4 + f * 3.4, p.z);
          add(band);
        }
      }
      hit(p.x, p.z, 7);
    }
    glowAt(mar.x, 16, mar.z, 6739176, 32, 26);
    hit(mar.x, mar.z, 8);
    hit(nb.x, nb.z, 8);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
