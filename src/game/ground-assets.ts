import * as THREE from "three";

let tex: THREE.Texture | undefined;

export function getGroundNoise() {
  return tex;
}

export async function loadGround() {
  if (tex) return tex;
  const t = await new THREE.TextureLoader().loadAsync("/game/ground.png");
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.repeat.set(90, 90);
  t.anisotropy = 4;
  t.needsUpdate = true;
  tex = t;
  return tex;
}
