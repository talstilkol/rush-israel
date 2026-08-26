import * as THREE from "three";

let tex: THREE.Texture | undefined;

export function getBeam() {
  return tex;
}

export async function loadBeam() {
  if (tex) return tex;
  const t = await new THREE.TextureLoader().loadAsync("/game/beam.png");
  t.colorSpace = THREE.NoColorSpace;
  t.needsUpdate = true;
  tex = t;
  return tex;
}
