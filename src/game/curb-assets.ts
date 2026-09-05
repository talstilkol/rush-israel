import * as THREE from "three";
import { createAssetCache } from "./asset-cache";
import { loadOwnedResources } from "./owned-load";

const names = ["city", "stone", "dirt", "sand"] as const;
const cache = createAssetCache(() => {
  const L = new THREE.TextureLoader();
  return loadOwnedResources(names.map((k) => () => L.loadAsync(`/game/curb-${k}.png`)), (textures) => {
    const kits = new Map<string, THREE.Texture>();
    textures.forEach((t, i) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.repeat.set(1, 1);
      t.needsUpdate = true;
      kits.set(names[i], t);
    });
    return kits;
  });
});

export function getCurb(kind: string) {
  const kits = cache.peek();
  return kits?.get(kind) ?? kits?.get("city");
}
export async function loadCurbs() { await cache.load(); }
