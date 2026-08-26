import * as THREE from "three";

let water: THREE.Texture | undefined;
let checker: THREE.Texture | undefined;

export function getWaterNormal() {
  return water;
}
export function getChecker() {
  return checker;
}

export async function loadWater() {
  if (water && checker) return;
  const L = new THREE.TextureLoader();
  const [n, c] = await Promise.all([L.loadAsync("/game/water-n.png"), L.loadAsync("/game/checker.png")]);
  n.wrapS = n.wrapT = THREE.RepeatWrapping;
  n.repeat.set(48, 28);
  n.anisotropy = 4;
  n.needsUpdate = true;
  c.magFilter = THREE.NearestFilter;
  c.colorSpace = THREE.SRGBColorSpace;
  c.repeat.set(1, 1);
  c.needsUpdate = true;
  water = n;
  checker = c;
}
