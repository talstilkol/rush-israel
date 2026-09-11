import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import type { CarDef } from "./types";
import { createAssetCache } from "./asset-cache";
import { loadOwnedResources } from "./owned-load";
import { createUnpublishedGltfDisposer } from "./unpublished-gltf";

const kinds = ["gt", "hatch", "muscle", "rally", "super"] as const;
const cache = createAssetCache(() => {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const dispose = createUnpublishedGltfDisposer();
  return loadOwnedResources(kinds.map((kind) => async () => {
    await MeshoptDecoder.ready;
    const gltf = await loader.loadAsync(`/game/car-${kind}.glb`);
    gltf.scene.updateMatrixWorld(true);
    return { gltf, dispose: () => dispose(gltf) };
  }), (models) => new Map<string, THREE.Object3D>(models.map(({ gltf }, i) => [kinds[i], gltf.scene])));
});

/** Cloned extruded body from glTF. Not a scan. */
export function cloneCarBody(kind: CarDef["body"], color: number, shadows: boolean): THREE.Mesh | undefined {
  const templates = cache.peek();
  const template = templates?.get(kind) ?? templates?.get("gt");
  if (!template) return;
  let src: THREE.Mesh | undefined;
  template.traverse((o) => {
    if ((o as THREE.Mesh).isMesh && o.name === "body") src = o as THREE.Mesh;
  });
  if (!src) return;
  void color;
  void shadows;
  const mesh = src.clone();
  mesh.geometry = src.geometry.clone();
  // Meshopt+KHR_mesh_quantization keeps decode on the template node. Cloning
  // that mesh into the car group draws a vertical origami; procedural extrusion
  // is the playable Y-up Z-forward body.
  mesh.geometry.dispose();
  return;
}

export function cloneCarGtBody(color: number, shadows: boolean) {
  return cloneCarBody("gt", color, shadows);
}

export async function loadCarGt() {
  return loadCars();
}

export async function loadCars(_renderer?: THREE.WebGLRenderer) {
  await cache.load();
}
