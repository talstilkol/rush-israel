import * as THREE from "three";
import { ask } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildAshkelon(context: TrackWorldBuilderContext): void {
  const {
    add,
    hit,
    stone,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const np = ask(31.663, 34.548);
    for (const w of [
      {
        lat: 31.6622,
        lon: 34.5472
      },
      {
        lat: 31.6628,
        lon: 34.5478
      },
      {
        lat: 31.6634,
        lon: 34.5484
      },
      {
        lat: 31.664,
        lon: 34.549
      },
      {
        lat: 31.6646,
        lon: 34.5496
      }
    ]) {
      const p = ask(w.lat, w.lon);
      const wall = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 3.2), stone);
      wall.position.set(p.x, 4, p.z);
      add(wall);
    }
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 14, 8), stone);
    tower.position.set(np.x + 12, 7, np.z);
    add(tower);
    hit(np.x, np.z, 12);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
