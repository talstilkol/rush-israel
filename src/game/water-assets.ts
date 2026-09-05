import * as THREE from "three";
import { createAssetCache } from "./asset-cache";
import { loadOwnedResources } from "./owned-load";

const cache = createAssetCache(() => {
  const L = new THREE.TextureLoader();
  return loadOwnedResources([
    () => L.loadAsync("/game/water-n.png"),
    () => L.loadAsync("/game/checker.png"),
  ], ([n, c]) => {
    n.wrapS = n.wrapT = THREE.RepeatWrapping;
    n.repeat.set(48, 28);
    n.anisotropy = 4;
    n.needsUpdate = true;
    c.magFilter = THREE.NearestFilter;
    c.colorSpace = THREE.SRGBColorSpace;
    c.repeat.set(1, 1);
    c.needsUpdate = true;
    return [n, c] as const;
  });
});

export function getWaterNormal() { return cache.peek()?.[0]; }
export function getChecker() { return cache.peek()?.[1]; }
export async function loadWater() { await cache.load(); }
