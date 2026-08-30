import * as THREE from "three";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildBrooklynbridge(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    copper,
    placeNycSkyline,
    placeGothicTower,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    placeGothicTower(-8, -36, 28);
    placeGothicTower(28, 62, 28);
    placeNycSkyline(-70, 8, 0.55);
    const liberty = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.1, 16, 8), copper);
    liberty.position.set(90, 9, -48);
    add(liberty);
    glowAt(90, 18, -48, 16764006, 22, 20);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
