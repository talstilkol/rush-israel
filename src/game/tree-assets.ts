import * as THREE from "three";

let foliage: THREE.Texture | undefined;
let bark: THREE.Texture | undefined;

export function getFoliage() {
  return foliage;
}
export function getBark() {
  return bark;
}

function prep(t: THREE.Texture, repeatY: number) {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  t.colorSpace = THREE.SRGBColorSpace;
  t.repeat.set(repeatY === 3 ? 1 : 2, repeatY);
  t.needsUpdate = true;
  return t;
}

export async function loadTreeMaps() {
  if (foliage && bark) return;
  const L = new THREE.TextureLoader();
  const [f, b] = await Promise.all([L.loadAsync("/game/foliage.png"), L.loadAsync("/game/bark.png")]);
  foliage = prep(f, 2);
  bark = prep(b, 3);
}
