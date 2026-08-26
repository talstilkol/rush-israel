import * as THREE from "three";

let tex: THREE.Texture | undefined;

export function getSidewalk() {
  return tex;
}

export async function loadSidewalk() {
  if (tex) return tex;
  const t = await new THREE.TextureLoader().loadAsync("/game/sidewalk.png");
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.needsUpdate = true;
  tex = t;
  return tex;
}
