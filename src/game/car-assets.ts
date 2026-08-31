import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import type { CarDef } from "./types";

const templates = new Map<string, THREE.Object3D>();

/** Cloned extruded body from glTF. Not a scan. */
export function cloneCarBody(kind: CarDef["body"], color: number, shadows: boolean): THREE.Mesh | undefined {
  const template = templates.get(kind) ?? templates.get("gt");
  if (!template) return;
  let src: THREE.Mesh | undefined;
  template.traverse((o) => {
    if ((o as THREE.Mesh).isMesh && o.name === "body") src = o as THREE.Mesh;
  });
  if (!src) return;
  const mesh = src.clone();
  // RSH-019: each per-engine visual owns its geometry; the cached template remains process-owned.
  mesh.geometry = src.geometry.clone();
  const mat = (src.material as THREE.MeshPhysicalMaterial).clone();
  mat.color.setHex(color);
  mesh.material = mat;
  mesh.castShadow = shadows;
  mesh.receiveShadow = true;
  mesh.name = "body";
  return mesh;
}

export function cloneCarGtBody(color: number, shadows: boolean) {
  return cloneCarBody("gt", color, shadows);
}

export async function loadCarGt() {
  return loadCars();
}

export async function loadCars(_renderer?: THREE.WebGLRenderer) {
  if (templates.size) return;
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const kinds = ["gt", "hatch", "muscle", "rally", "super"] as const;
  await Promise.all(
    kinds.map(async (k) => {
      const gltf = await loader.loadAsync(`/game/car-${k}.glb`);
      templates.set(k, gltf.scene);
    }),
  );
}
