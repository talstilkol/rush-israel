import * as THREE from "three";
import { distToStreet } from "../../streets";
import { clearRoadsidePoint } from "../../roadside";
import { ksb } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildKsaba(context: TrackWorldBuilderContext): void {
  const {
    add,
    group,
    streets,
    built,
    glowAt,
    hitBox,
    stone,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const hint = ksb(32.175, 34.908);
    const obelisk = new THREE.Mesh(new THREE.BoxGeometry(1.4, 12, 1.4), stone);
    // Existing instanced trunks/crowns must not cut through the moved monument.
    group.updateMatrixWorld(true);
    const trees: THREE.Box3[] = [];
    group.traverse(object => {
      if (!(object instanceof THREE.InstancedMesh) || !["CylinderGeometry", "SphereGeometry"].includes(object.geometry.type)) return;
      object.geometry.computeBoundingBox();
      for (let index = 0; index < object.count; index++) {
        const matrix = new THREE.Matrix4();
        object.getMatrixAt(index, matrix);
        matrix.premultiply(object.matrixWorld);
        trees.push(object.geometry.boundingBox!.clone().applyMatrix4(matrix));
      }
    });
    // Keep the entire garden clear of the route,side streets andexisting trees.
    const candidates = [...built.samples].sort((a, b) =>
      (a.x - hint.x) ** 2 + (a.z - hint.z) ** 2 - ((b.x - hint.x) ** 2 + (b.z - hint.z) ** 2) || a.s - b.s);
    let pk: { x: number; z: number } | undefined;
    for (const sample of candidates) {
      for (const side of [1, -1]) {
        let point: { x: number; z: number };
        try { point = clearRoadsidePoint(built, sample.t, side, 10, false); }
        catch (error) {
          if (!(error instanceof Error) || !error.message.startsWith("No clear roadside point")) throw error;
          continue;
        }
        if (streets.some(street => distToStreet(point.x, point.z, street).dist < 10 + street.half + 2)) continue;
        obelisk.position.set(point.x, 6, point.z);
        obelisk.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(obelisk);
        if (trees.some(tree => tree.intersectsBox(bounds))) continue;
        pk = point;
        break;
      }
      if (pk) break;
    }
    if (!pk) throw new Error("No road/street/tree-clear memorial site");
    const garden = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 0.3, 16), new THREE.MeshStandardMaterial({
      color: 3832386,
      roughness: 0.9
    }));
    garden.position.set(pk.x, 0.15, pk.z);
    garden.name = "rush-ksaba-garden";
    add(garden);
    obelisk.position.set(pk.x, 6, pk.z);
    obelisk.name = "rush-ksaba-obelisk";
    add(obelisk);
    hitBox(obelisk);
    glowAt(pk.x, 12, pk.z, 16771264, 18, 16);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
