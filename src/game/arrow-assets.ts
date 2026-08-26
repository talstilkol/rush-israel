import * as THREE from "three";

let tex: THREE.Texture | undefined;

export function getLaneArrow() {
  return tex;
}

export async function loadLaneArrow() {
  if (tex) return tex;
  const t = await new THREE.TextureLoader().loadAsync("/game/lane-arrow.png");
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  tex = t;
  return tex;
}
