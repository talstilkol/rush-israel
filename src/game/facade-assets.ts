import * as THREE from "three";
import { createAssetCache } from "./asset-cache";
import { loadOwnedResources } from "./owned-load";

const names = ["blue", "teal", "dark", "gold", "white"] as const;
const cache = createAssetCache(() => {
  const L = new THREE.TextureLoader();
  return loadOwnedResources(names.map((k) => () => L.loadAsync(`/game/curtain-${k}.png`)), (textures) => {
    const kits = new Map<string, THREE.Texture>();
    textures.forEach((t, i) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 8;
      t.colorSpace = THREE.SRGBColorSpace;
      t.repeat.set(2, 8);
      t.needsUpdate = true;
      kits.set(names[i], t);
    });
    return kits;
  });
});

export function getCurtain(kind: string) {
  const kits = cache.peek();
  return kits?.get(kind) ?? kits?.get("blue");
}
export async function loadCurtains() { await cache.load(); }
