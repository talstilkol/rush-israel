import * as THREE from "three";
import { loadOwnedResources } from "./owned-load";

export type RoadKit = {
  map: THREE.Texture;
  roughnessMap: THREE.Texture;
  bumpMap: THREE.Texture;
};

const kits = new Map<number, RoadKit>();
const pending = new Map<number, Promise<RoadKit>>();

export function getBakedRoad(lanes: number): RoadKit | undefined {
  const n = lanes >= 8 ? 8 : lanes >= 4 ? 4 : lanes >= 3 ? 3 : 0;
  return n ? kits.get(n) : undefined;
}

export function getAyalonRoad(): RoadKit | undefined {
  return kits.get(8);
}

function prep(tex: THREE.Texture, srgb: boolean) {
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = srgb ? 16 : 8;
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

async function loadLane(n: number): Promise<RoadKit> {
  if (kits.has(n)) return kits.get(n)!;
  const inFlight = pending.get(n);
  if (inFlight) return inFlight;
  const L = new THREE.TextureLoader();
  const request = loadOwnedResources([
    () => L.loadAsync(`/game/asphalt-${n}.png`),
    () => L.loadAsync(`/game/asphalt-${n}-rough.png`),
    () => L.loadAsync(`/game/asphalt-${n}-bump.png`),
  ], ([map, roughnessMap, bumpMap]) => {
    const kit = {
      map: prep(map, true),
      roughnessMap: prep(roughnessMap, false),
      bumpMap: prep(bumpMap, false),
    };
    kits.set(n, kit);
    return kit;
  }).finally(() => { pending.delete(n); });
  pending.set(n, request);
  return request;
}

/** Baked procedural PNGs. Not photogrammetry. */
export async function loadAyalonRoad() {
  return loadLane(8);
}

export async function loadCityRoad() {
  return loadLane(3);
}

export async function loadHwyRoad() {
  return loadLane(4);
}

export async function loadRoadFor(trackId: string) {
  if (trackId === "ayalon") return loadLane(8);
  if (trackId === "hw1" || trackId === "hw2" || trackId === "hw6" || trackId === "hw40" || trackId === "hw90") return loadLane(4);
  return loadLane(3);
}
