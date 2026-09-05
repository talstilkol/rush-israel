import * as THREE from "three";
import { createAssetCache } from "./asset-cache";
import { loadOwnedResources } from "./owned-load";

const cache = createAssetCache(() => {
  const L = new THREE.TextureLoader();
  return loadOwnedResources([
    () => L.loadAsync("/game/foliage.png"),
    () => L.loadAsync("/game/bark.png"),
  ], ([f, b]) => [prep(f, 2), prep(b, 3)] as const);
});

export function getFoliage() {
  return cache.peek()?.[0];
}
export function getBark() {
  return cache.peek()?.[1];
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
  await cache.load();
}
