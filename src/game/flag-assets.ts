import * as THREE from "three";

let tex: THREE.Texture | undefined;

export function getIsraelFlag() {
  return tex;
}

export async function loadIsraelFlag() {
  if (tex) return tex;
  const t = await new THREE.TextureLoader().loadAsync("/game/israel-flag.png");
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  tex = t;
  return tex;
}
