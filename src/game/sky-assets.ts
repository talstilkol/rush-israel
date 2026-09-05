import * as THREE from "three";
import { createAssetCache } from "./asset-cache";
import { loadOwnedResources } from "./owned-load";

const cache = createAssetCache(() => {
  const L = new THREE.TextureLoader();
  return loadOwnedResources([
    () => L.loadAsync("/game/sky-day.png"),
    () => L.loadAsync("/game/sky-night.png"),
  ], ([d, n]) => [prep(d), prep(n)] as const);
});

export function getSkyDay() {
  return cache.peek()?.[0];
}
export function getSkyNight() {
  return cache.peek()?.[1];
}

function prep(tex: THREE.Texture) {
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/** Baked gradient skies. Not HDRI. */
export async function loadSky() {
  await cache.load();
}
