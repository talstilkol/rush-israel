import * as THREE from "three";

let a: THREE.Texture | undefined;
let b: THREE.Texture | undefined;

export function getFlare0() {
  return a;
}
export function getFlare1() {
  return b;
}

export async function loadFlares() {
  if (a && b) return;
  const L = new THREE.TextureLoader();
  const [t0, t1] = await Promise.all([L.loadAsync("/game/flare-0.png"), L.loadAsync("/game/flare-1.png")]);
  t0.colorSpace = THREE.SRGBColorSpace;
  t1.colorSpace = THREE.SRGBColorSpace;
  t0.needsUpdate = true;
  t1.needsUpdate = true;
  a = t0;
  b = t1;
}
