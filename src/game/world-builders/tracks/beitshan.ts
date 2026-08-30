import * as THREE from "three";
import { bsn } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildBeitshan(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    stone,
    cream,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const th = bsn(32.503, 35.502);
    const theatre = new THREE.Mesh(new THREE.CylinderGeometry(10, 12, 6, 16, 1, true, 0, Math.PI), stone);
    theatre.position.set(th.x, 3.2, th.z);
    theatre.rotation.y = 0.4;
    add(theatre);
    for (const c of [
      {
        lat: 32.5032,
        lon: 35.5026
      },
      {
        lat: 32.5036,
        lon: 35.5038
      },
      {
        lat: 32.504,
        lon: 35.505
      },
      {
        lat: 32.5044,
        lon: 35.5062
      },
      {
        lat: 32.5048,
        lon: 35.5074
      }
    ]) {
      const p = bsn(c.lat, c.lon);
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 9, 8), cream);
      col.position.set(p.x, 4.6, p.z);
      add(col);
      const capc = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 1.3), cream);
      capc.position.set(p.x, 9.3, p.z);
      add(capc);
    }
    const gb = bsn(32.48, 35.42);
    const gilboa = new THREE.Mesh(new THREE.ConeGeometry(16, 22, 5), new THREE.MeshStandardMaterial({
      color: 9071176,
      roughness: 0.95,
      flatShading: true
    }));
    gilboa.position.set(gb.x, 10, gb.z);
    add(gilboa);
    glowAt(th.x, 8, th.z, 16769200, 22, 20);
    hit(th.x, th.z, 12);
    hit(gb.x, gb.z, 14);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
