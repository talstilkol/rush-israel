import type * as THREE from "three";

export type Object3DDisposalTracker = {
  geometries: Set<THREE.BufferGeometry>;
  materials: Set<THREE.Material>;
};

export type Object3DDisposalReport = {
  geometries: number;
  materials: number;
};

export function createObject3DDisposalTracker(): Object3DDisposalTracker {
  return {
    geometries: new Set<THREE.BufferGeometry>(),
    materials: new Set<THREE.Material>(),
  };
}

function disposeMaterial(
  material: THREE.Material,
  tracker: Object3DDisposalTracker,
) {
  if (tracker.materials.has(material)) return;
  tracker.materials.add(material);
  material.dispose();
}

/**
 * Disposes only Object3D-owned geometries and materials.
 * Textures are intentionally excluded: global asset caches own their lifetime.
 */
export function disposeObject3D(
  root: THREE.Object3D,
  tracker = createObject3DDisposalTracker(),
): Object3DDisposalReport {
  const beforeGeometries = tracker.geometries.size;
  const beforeMaterials = tracker.materials.size;
  root.traverse((object) => {
    const renderable = object as THREE.Object3D & {
      geometry?: THREE.BufferGeometry;
      material?: THREE.Material | THREE.Material[];
    };
    if (renderable.geometry && !tracker.geometries.has(renderable.geometry)) {
      tracker.geometries.add(renderable.geometry);
      renderable.geometry.dispose();
    }
    const materials = Array.isArray(renderable.material)
      ? renderable.material
      : renderable.material
        ? [renderable.material]
        : [];
    for (const material of materials) disposeMaterial(material, tracker);
  });
  root.removeFromParent();
  root.clear();
  return {
    geometries: tracker.geometries.size - beforeGeometries,
    materials: tracker.materials.size - beforeMaterials,
  };
}
