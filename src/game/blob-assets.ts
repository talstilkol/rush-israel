import * as THREE from "three";

let tex: THREE.Texture | undefined;

export function getBlob() {
  return tex;
}

export async function loadBlob() {
  if (tex) return tex;
  const t = await new THREE.TextureLoader().loadAsync("/game/blob.png");
  t.colorSpace = THREE.NoColorSpace;
  t.needsUpdate = true;
  tex = t;
  return tex;
}
