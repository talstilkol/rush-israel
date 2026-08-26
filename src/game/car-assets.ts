import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let template: THREE.Object3D | undefined;

export function hasCarGt() {
  return !!template;
}

/** Cloned GT body. Same extrude as before, via GLTFLoader. Not a scan. */
export function cloneCarGtBody(color: number, shadows: boolean): THREE.Mesh | undefined {
  if (!template) return;
  let src: THREE.Mesh | undefined;
  template.traverse((o) => {
    if ((o as THREE.Mesh).isMesh && o.name === "body") src = o as THREE.Mesh;
  });
  if (!src) return;
  const mesh = src.clone();
  const mat = (src.material as THREE.MeshPhysicalMaterial).clone();
  mat.color.setHex(color);
  mesh.material = mat;
  mesh.castShadow = shadows;
  mesh.receiveShadow = true;
  mesh.name = "body";
  return mesh;
}

export async function loadCarGt() {
  if (template) return;
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync("/game/car-gt.gltf");
  template = gltf.scene;
}
