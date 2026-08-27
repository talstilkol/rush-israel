import * as THREE from "three";

let tex: THREE.Texture | undefined;

export function getBlob() {
  return tex;
}

/** No KTX2 in shipping. Uncompressed blob.ktx2 was not UASTC. */
export function blobIsKtx2() {
  return false;
}

export async function loadBlob(_renderer?: THREE.WebGLRenderer) {
  if (tex) return tex;
  const t = await new THREE.TextureLoader().loadAsync("/game/blob.png");
  t.colorSpace = THREE.NoColorSpace;
  t.needsUpdate = true;
  tex = t;
  return tex;
}
