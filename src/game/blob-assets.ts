import * as THREE from "three";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

let tex: THREE.Texture | undefined;
let fromKtx = false;

export function getBlob() {
  return tex;
}

export function blobIsKtx2() {
  return fromKtx;
}

export async function loadBlob(renderer?: THREE.WebGLRenderer) {
  if (tex) return tex;
  if (renderer) {
    try {
      const ktx = new KTX2Loader();
      ktx.setTranscoderPath("/basis/");
      ktx.detectSupport(renderer);
      const t = await ktx.loadAsync("/game/blob.ktx2");
      t.colorSpace = THREE.NoColorSpace;
      t.needsUpdate = true;
      tex = t;
      fromKtx = true;
      ktx.dispose();
      return tex;
    } catch (e) {
      console.info("[gfx] ktx2 blob fail", e);
    }
  }
  const t = await new THREE.TextureLoader().loadAsync("/game/blob.png");
  t.colorSpace = THREE.NoColorSpace;
  t.needsUpdate = true;
  tex = t;
  fromKtx = false;
  return tex;
}
