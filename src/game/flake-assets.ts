import * as THREE from "three";

let tex: THREE.Texture | undefined;

export function getFlake() {
  return tex;
}

export async function loadFlake() {
  if (tex) return tex;
  const t = await new THREE.TextureLoader().loadAsync("/game/flake.png");
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(8, 4);
  t.anisotropy = 4;
  t.colorSpace = THREE.NoColorSpace;
  t.needsUpdate = true;
  tex = t;
  return tex;
}
