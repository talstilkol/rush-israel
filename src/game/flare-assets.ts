import * as THREE from "three";
import { createAssetCache } from "./asset-cache";
import { loadOwnedResources } from "./owned-load";

const cache = createAssetCache(() => {
  const L = new THREE.TextureLoader();
  return loadOwnedResources([
    () => L.loadAsync("/game/flare-0.png"),
    () => L.loadAsync("/game/flare-1.png"),
  ], ([t0, t1]) => {
    t0.colorSpace = THREE.SRGBColorSpace;
    t1.colorSpace = THREE.SRGBColorSpace;
    t0.needsUpdate = true;
    t1.needsUpdate = true;
    return [t0, t1] as const;
  });
});

export function getFlare0() { return cache.peek()?.[0]; }
export function getFlare1() { return cache.peek()?.[1]; }
export async function loadFlares() { await cache.load(); }
