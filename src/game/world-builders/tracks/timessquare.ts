import * as THREE from "three";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildTimessquare(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    darkGlass,
    paleGlass,
    placeNycSkyline,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const oneTs = new THREE.Mesh(new THREE.BoxGeometry(12, 52, 10), darkGlass);
    oneTs.position.set(18, 26, 8);
    add(oneTs);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(2.4, 12, 10), paleGlass);
    ball.position.set(18, 56, 8);
    add(ball);
    placeNycSkyline(-48, -40, 0.62);
    glowAt(18, 56, 8, 16737962, 36, 28);
    hit(18, 8, 8);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
