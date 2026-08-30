import * as THREE from "three";
import { ard } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildArad(context: TrackWorldBuilderContext): void {
  const {
    add,
    hit,
    white,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    for (const h of [
      {
        lat: 31.2572,
        lon: 35.2122,
        h: 4.2
      },
      {
        lat: 31.258,
        lon: 35.2134,
        h: 5.6
      },
      {
        lat: 31.2588,
        lon: 35.2126,
        h: 4.8
      },
      {
        lat: 31.2576,
        lon: 35.214,
        h: 6.2
      }
    ]) {
      const p = ard(h.lat, h.lon);
      const house = new THREE.Mesh(new THREE.BoxGeometry(8, h.h, 6), white);
      house.position.set(p.x, h.h * 0.5, p.z);
      add(house);
      hit(p.x, p.z, 4);
    }
    const ridgeP = ard(31.27, 35.24);
    const ridge = new THREE.Mesh(new THREE.ConeGeometry(28, 18, 5), new THREE.MeshStandardMaterial({
      color: 12886128,
      roughness: 0.96,
      flatShading: true
    }));
    ridge.position.set(ridgeP.x, 8, ridgeP.z);
    add(ridge);
    hit(ridgeP.x, ridgeP.z, 16);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
