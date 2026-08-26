import * as THREE from "three";

let tex: THREE.Texture | undefined;

export function getHerodian() {
  return tex;
}

export async function loadHerodian() {
  if (tex) return tex;
  const t = await new THREE.TextureLoader().loadAsync("/game/herodian.png");
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.colorSpace = THREE.SRGBColorSpace;
  t.repeat.set(3, 2);
  t.needsUpdate = true;
  tex = t;
  return tex;
}
