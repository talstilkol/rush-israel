import * as THREE from "three";
import { ask } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildAshkelon(context: TrackWorldBuilderContext): void {
  const {
    add,
    hit,
    colliders,
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
      const halfWidth = wall.geometry.parameters.width / 2;
      const halfDepth = wall.geometry.parameters.depth / 2;
      const collider = hit(wall.position.x, wall.position.z,
        Math.hypot(halfWidth, halfDepth), halfWidth, halfDepth, wall.rotation.y);
      collider.maxY = wall.position.y + wall.geometry.parameters.height / 2;
    }
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 14, 8), stone);
    tower.position.set(np.x + 12, 7, np.z);
    add(tower);
    // The tower is circular; omit box extents so collision uses its real radius.
    colliders.push({
      x: tower.position.x,
      z: tower.position.z,
      r: Math.max(tower.geometry.parameters.radiusTop, tower.geometry.parameters.radiusBottom),
      maxY: tower.position.y + tower.geometry.parameters.height / 2,
      kind: "building",
    });
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
