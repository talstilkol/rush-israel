import * as THREE from "three";
import { createAssetCache } from "./asset-cache";
import { loadOwnedResources } from "./owned-load";

const GANTRY = [
  "gantry-kibbutz-galuyot",
  "gantry-hahagana",
  "gantry-laguardia",
  "gantry-hashalom",
  "gantry-savidor-center",
  "gantry-university",
  "stn-galuyot",
  "stn-hagana",
  "stn-shalom",
  "stn-savidor",
  "stn-uni",
  "dest-rail",
] as const;

const names = ["stop", "yield", "none", "speed50", "speed80", "speed90"] as const;
const entries = [
  ...names.map((k) => [k, `/game/sign-${k}.png`] as const),
  ...GANTRY.map((k) => [k, `/game/${k}.png`] as const),
];
const cache = createAssetCache(() => {
  const L = new THREE.TextureLoader();
  return loadOwnedResources(entries.map(([, url]) => () => L.loadAsync(url)), (textures) => {
    const kits = new Map<string, THREE.Texture>();
    textures.forEach((t, i) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      t.needsUpdate = true;
      kits.set(entries[i][0], t);
    });
    return kits;
  });
});

export function getSign(kind: string) { return cache.peek()?.get(kind); }
export function getGantry(id: string) { return cache.peek()?.get(id); }
export async function loadSigns() { await cache.load(); }
