import * as THREE from "three";
import { eil } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildEilatmtn(context: TrackWorldBuilderContext): void {
  const {
    add,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const ridgePts = [
      eil(29.546, 34.916),
      eil(29.548, 34.92),
      eil(29.55, 34.924),
      eil(29.552, 34.918),
      eil(29.554, 34.926),
      eil(29.547, 34.928),
      eil(29.556, 34.922)
    ];
    for (let i = 0; i < ridgePts.length; i++) {
      const p = ridgePts[i];
      const mtn = new THREE.Mesh(new THREE.ConeGeometry(16 + i * 3, 24 + i * 5, 5), new THREE.MeshStandardMaterial({
        color: 10771002,
        roughness: 0.95,
        flatShading: true
      }));
      mtn.position.set(p.x, 12, p.z);
      add(mtn);
    }
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
