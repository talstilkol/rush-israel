import * as THREE from "three";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildManhattan(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    copper,
    gold,
    placeNycSkyline,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    placeNycSkyline(8, -120, 1);
    const liberty = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.4, 18, 8), copper);
    liberty.position.set(-96, 10, -180);
    add(liberty);
    const torch = new THREE.Mesh(new THREE.SphereGeometry(1.1, 8, 6), gold);
    torch.position.set(-96, 21, -180);
    add(torch);
    glowAt(-96, 22, -180, 16764006, 24, 22);
    hit(-96, -180, 6);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
