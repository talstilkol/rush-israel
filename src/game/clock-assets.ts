import * as THREE from "three";

let tex: THREE.Texture | undefined;

export function getJaffaClock() {
  return tex;
}

export async function loadJaffaClock() {
  if (tex) return tex;
  const t = await new THREE.TextureLoader().loadAsync("/game/jaffa-clock.png");
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  tex = t;
  return tex;
}
