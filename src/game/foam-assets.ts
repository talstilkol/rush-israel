import * as THREE from "three";

let tex: THREE.Texture | undefined;

export function getFoam() {
  return tex;
}

export async function loadFoam() {
  if (tex) return tex;
  const t = await new THREE.TextureLoader().loadAsync("/game/foam.png");
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 8);
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  tex = t;
  return tex;
}
