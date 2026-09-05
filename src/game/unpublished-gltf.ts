import type * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

type Disposable = { dispose(): void };
type Closable = { close(): void };

/** Rollback only NEW, unpublished GLTFs. Never use on shared live template caches.
 * One disposer per batch deduplicates resources shared between files/scenes.
 */
export function createUnpublishedGltfDisposer() {
  const disposed = new Set<Disposable>();
  const closed = new Set<Closable>();
  return (gltf: Pick<GLTF, "scene" | "scenes">): void => {
    const resources = new Set<Disposable>();
    const images = new Set<Closable>();
    const roots = new Set([gltf.scene, ...gltf.scenes]);
    const addTexture = (value: unknown) => {
      if (!value || typeof value !== "object" || !(value as THREE.Texture).isTexture) return;
      const texture = value as THREE.Texture;
      resources.add(texture);
      const data: unknown = texture.source?.data;
      for (const image of Array.isArray(data) ? data : [data]) {
        if (image && typeof (image as Closable).close === "function") images.add(image as Closable);
      }
    };
    for (const root of roots) root.traverse((object) => {
      const node = object as THREE.Object3D & {
        geometry?: THREE.BufferGeometry;
        material?: THREE.Material | THREE.Material[];
        skeleton?: THREE.Skeleton;
      };
      if (node.geometry) resources.add(node.geometry);
      const materials = Array.isArray(node.material) ? node.material : node.material ? [node.material] : [];
      for (const material of materials) {
        Object.values(material).forEach(addTexture);
        resources.add(material);
      }
      // Skeleton.dispose owns its bone texture; do not dispose that twice.
      if (node.skeleton) resources.add(node.skeleton);
    });
    const errors: unknown[] = [];
    for (const resource of resources) {
      if (disposed.has(resource)) continue;
      disposed.add(resource);
      try { resource.dispose(); } catch (error) { errors.push(error); }
    }
    for (const image of images) {
      if (closed.has(image)) continue;
      closed.add(image);
      try { image.close(); } catch (error) { errors.push(error); }
    }
    for (const root of roots) {
      try { root.removeFromParent(); root.clear(); } catch (error) { errors.push(error); }
    }
    if (errors.length) throw new AggregateError(errors, "Unpublished model rollback failed");
  };
}
